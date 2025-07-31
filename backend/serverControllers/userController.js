import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { Readable } from "stream";
import axios from "axios";
import stripe from "stripe";
import PDFParser from "pdf2json";
import { supabase } from "../supabaseServer.js";
import { v2 as cloudinary } from "cloudinary";
// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Function to get audio duration
export const getAudioDuration = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer);
    ffmpeg.ffprobe(stream, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const duration = metadata.format.duration;
      resolve(duration);
    });
  });
};

// API to upload and transcribe audio
export const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No audio file uploaded." });
    }

    // Validate audio duration
    const duration = await getAudioDuration(req.file.buffer);
    if (duration > 60) {
      return res.status(400).json({
        success: false,
        message: "Audio duration exceeds 60 seconds.",
      });
    }

    // Upload audio to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "video", folder: "roshetta/audio" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // Transcribe audio using Open AI Whisper API
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
    });
    formData.append("model", "whisper-1");

    const transcriptionResponse = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const transcription = transcriptionResponse.data.text;

    // Store metadata in Supabase
    const fileData = {
      user_id: req.userId || null,
      session_id: req.sessionID || "anonymous",
      type: "audio",
      url: result.secure_url,
      transcription,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("files").insert([fileData]);

    if (error) {
      console.error("Error storing file metadata:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Error storing file metadata" });
    }

    res
      .status(200)
      .json({ success: true, transcription, fileUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading audio:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to upload file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "auto", folder: "roshetta/files" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // Store metadata in Supabase
    const fileData = {
      user_id: req.userId || null,
      session_id: req.sessionID || "anonymous",
      type: req.file.mimetype,
      url: result.secure_url,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("files").insert([fileData]);

    if (error) {
      console.error("Error storing file metadata:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Error storing file metadata" });
    }

    res.status(200).json({ success: true, fileUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to analyze image
export const analyzeImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Image URL is required" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Analyze medical prescriptions from images. Extract details such as medication names, dosages, and instructions. If the image is unclear or not a prescription, state so.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this prescription image." },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({
      success: true,
      analysis: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to analyze PDF text
export const analyzePdfText = async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ success: false, message: "No PDF file uploaded." });
    }

    // Upload PDF to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "auto", folder: "roshetta/files" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // Extract text from PDF using pdf2json
    const pdfParser = new PDFParser();
    let text = "";
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      text = pdfParser.getRawTextContent();
    });
    pdfParser.on("pdfParser_dataError", (errData) => {
      throw new Error(errData.parserError);
    });
    await new Promise((resolve, reject) => {
      pdfParser.parseBuffer(req.file.buffer);
      pdfParser.on("end", resolve);
      pdfParser.on("error", reject);
    });

    // Analyze text using Open AI
    const textAnalysisResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Analyze medical prescriptions from text. Extract details such as medication names, dosages, and instructions. If the text is unclear or not a prescription, state so.",
          },
          {
            role: "user",
            content: `Analyze this prescription text: ${text}`,
          },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Store metadata in Supabase
    const fileData = {
      user_id: req.userId || null,
      session_id: req.sessionID || "anonymous",
      type: "application/pdf",
      url: result.secure_url,
      text_content: text,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("files").insert([fileData]);

    if (error) {
      console.error("Error storing file metadata:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Error storing file metadata" });
    }

    res.json({
      success: true,
      text,
      fileUrl: result.secure_url,
      analysis: textAnalysisResponse.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error analyzing PDF text:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to get Paymob auth token
export const getAuthToken = async () => {
  try {
    const rawKey = process.env.PAYMOB_API_KEY;
    if (!rawKey) {
      throw new Error("PAYMOB_API_KEY is not defined in environment variables");
    }
    const cleanedKey = rawKey.trim();

    const response = await axios.post(
      "https://accept.paymobsolutions.com/api/auth/tokens",
      { api_key: cleanedKey },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data.token;
  } catch (error) {
    console.error("DEBUG: Paymob Auth Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    throw new Error(
      `Paymob Auth Token Error: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Helper function to register Paymob order
export const registerAppointment = async (
  authToken,
  amountCents,
  appointmentId
) => {
  try {
    const response = await axios.post(
      "https://accept.paymobsolutions.com/api/ecommerce/orders",
      {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amountCents,
        currency: "EGP",
        merchant_order_id: appointmentId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data.id;
  } catch (error) {
    console.error("DEBUG: registerAppointment Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(
      `Paymob Register Order Error: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Helper function to get Paymob payment key
export const getPaymentKey = async (
  authToken,
  amountCents,
  appointmentId,
  billingData,
  integrationId,
  origin
) => {
  try {
    const payload = {
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: appointmentId,
      billing_data: billingData,
      currency: "EGP",
      integration_id: integrationId,
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    };
    console.log("DEBUG: getPaymentKey Payload:", payload);
    const response = await axios.post(
      "https://accept.paymobsolutions.com/api/acceptance/payment_keys",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log("DEBUG: getPaymentKey Response:", response.data);
    return response.data.token;
  } catch (error) {
    console.error("DEBUG: getPaymentKey Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    throw new Error(
      `Paymob get payment key Error: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// API to pay for appointment with Paymob
export const payAppointmentPaymob = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    // Check if appointment exists in Supabase
    const { data: appointment, error: apptError } = await supabase
      .from("appointments")
      .select(
        "id, amount, payment, cancelled, patient_id, doctor_id, doctors(name)"
      )
      .eq("id", appointmentId)
      .single();

    if (apptError || !appointment) {
      return res.json({ success: false, message: "Appointment Not Found" });
    }

    if (appointment.patient_id !== userId) {
      return res.json({ success: false, message: "Unauthorized Action" });
    }

    if (appointment.payment) {
      return res.json({ success: false, message: "Appointment Already Paid" });
    }
    if (appointment.cancelled) {
      return res.json({ success: false, message: "Appointment Cancelled" });
    }

    const amountCents = Math.floor(appointment.amount * 100);

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from("patients")
      .select("id, fullName, email, phoneNumber")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    const billingData = {
      first_name: user.fullName.split(" ")[0] || "Unknown",
      last_name: user.fullName.split(" ")[1] || "Unknown",
      email: user.email || "no-email@domain.com",
      phone_number: user.phoneNumber
        ? `+2${user.phoneNumber}`
        : "+201000000000",
      street: "Unknown",
      building: "Unknown",
      floor: "Unknown",
      apartment: "Unknown",
      city: "Cairo",
      state: "Cairo",
      country: "EGY",
      postal_code: "00000",
    };

    const authToken = await getAuthToken();
    const paymobAppointmentId = await registerAppointment(
      authToken,
      amountCents,
      appointmentId
    );
    const paymentKey = await getPaymentKey(
      authToken,
      amountCents,
      paymobAppointmentId,
      billingData,
      process.env.PAYMOB_INTEGRATION_ID,
      origin
    );

    // Store payment attempt in Supabase
    const paymentData = {
      appointment_id: appointmentId,
      payment_gateway: "paymob",
      transaction_id: paymobAppointmentId,
      status: "pending",
      amount: amountCents / 100,
      currency: "EGP",
      created_at: new Date().toISOString(),
    };

    const { error: paymentError } = await supabase
      .from("payments")
      .insert([paymentData]);

    if (paymentError) {
      console.error("Error storing payment attempt:", paymentError.message);
      return res
        .status(500)
        .json({ success: false, message: "Error storing payment attempt" });
    }

    const paymentUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    res.json({ success: true, url: paymentUrl });
  } catch (error) {
    console.error("DEBUG: payAppointmentPaymob Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.json({ success: false, message: error.message });
  }
};

// API to pay for appointment with Stripe
export const payAppointmentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    // Check if appointment exists in Supabase
    const { data: appointment, error: apptError } = await supabase
      .from("appointments")
      .select(
        "id, amount, payment, cancelled, patient_id, doctor_id, doctors(name)"
      )
      .eq("id", appointmentId)
      .single();

    if (apptError || !appointment) {
      return res.json({ success: false, message: "Appointment Not Found" });
    }

    if (appointment.patient_id !== userId) {
      return res.json({ success: false, message: "Unauthorized Action" });
    }

    if (appointment.payment) {
      return res.json({ success: false, message: "Appointment Already Paid" });
    }
    if (appointment.cancelled) {
      return res.json({ success: false, message: "Appointment Cancelled" });
    }

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: appointment.doctors?.name
              ? `Appointment with ${appointment.doctors.name}`
              : "Lab Appointment",
          },
          unit_amount: Math.floor(appointment.amount * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        appointmentId: appointment.id,
        userId,
        isDoctorAppointment: appointment.doctor_id ? "true" : "false",
      },
    });

    // Store payment attempt in Supabase
    const paymentData = {
      appointment_id: appointmentId,
      payment_gateway: "stripe",
      transaction_id: session.id,
      status: "pending",
      amount: appointment.amount,
      currency: "EGP",
      created_at: new Date().toISOString(),
    };

    const { error: paymentError } = await supabase
      .from("payments")
      .insert([paymentData]);

    if (paymentError) {
      console.error("Error storing payment attempt:", paymentError.message);
      return res
        .status(500)
        .json({ success: false, message: "Error storing payment attempt" });
    }

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
