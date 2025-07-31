import express from 'express';
import { supabase } from '../supabaseServer.js';
import {
  // placeOrderStripe,
  // placeOrderPaymob,
  payAppointmentStripe,
  payAppointmentPaymob,
  uploadAudio,
  uploadFile,
  analyzeImage,
  analyzePdfText,
} from '../serverControllers/userController.js';
import upload from '../config/multer.js';

const userRouter = express.Router();

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.userId = user.id;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

userRouter.post('/pay-appointment-stripe', authUser, payAppointmentStripe);
userRouter.post('/pay-appointment-paymob', authUser, payAppointmentPaymob);
// userRouter.post('/stripe', authUser, placeOrderStripe);
// userRouter.post('/paymob', authUser, placeOrderPaymob);
// userRouter.get('/chatbot-context', async (req, res) => {
//   try {
//     const doctors = await doctorModel.find({ available: true }).select('name specialty fees');
//     const labs = await labModel.find({ available: true }).select('name services');
//     res.json({
//       success: true,
//       context: {
//         doctors: doctors.map(doc => ({
//           name: doc.name,
//           specialty: doc.specialty,
//           fees: doc.fees,
//         })),
//         labs: labs.map(lab => ({
//           name: lab.name,
//           services: lab.services,
//         })),
//       },
//     });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// });
userRouter.post('/upload-audio-public', upload.single('audio'), uploadAudio);
userRouter.post('/upload-file-public', upload.single('file'), uploadFile);
userRouter.post('/analyze-image', authUser, analyzeImage);
userRouter.post('/analyze-pdf', upload.single('file'), analyzePdfText);

export default userRouter;