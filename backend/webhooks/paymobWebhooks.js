import crypto from 'crypto';
import { supabase } from '../supabaseServer.js';

export const paymobWebhook = async (req, res) => {
  try {
    const receivedHmac = req.query.hmac;
    const payload = req.body;
    const secureHash = crypto
      .createHmac('sha512', process.env.PAYMOB_HMAC_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (secureHash !== receivedHmac) {
      console.error('Invalid HMAC signature');
      return res.status(403).send('Invalid HMAC signature');
    }

    const { obj } = req.body;
    const appointmentId = obj.order.merchant_order_id;

    // Check if appointment exists in Supabase
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('id, payment, cancelled')
      .eq('id', appointmentId)
      .single();

    if (error || !appointment) {
      console.error('Appointment not found:', appointmentId, error?.message);
      return res.status(404).send('Appointment not found');
    }

    // Update appointment payment status
    const updates = {
      payment: obj.success,
      cancelled: !obj.success,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase.from('appointments').update(updates).eq('id', appointmentId);

    if (updateError) {
      console.error('Error updating appointment:', updateError.message);
      return res.status(500).send('Error updating appointment');
    }

    // Store payment details in payments table
    const paymentData = {
      appointment_id: appointmentId,
      payment_gateway: 'paymob',
      transaction_id: obj.id,
      status: obj.success ? 'succeeded' : 'failed',
      amount: obj.amount_cents / 100,
      currency: obj.currency,
      created_at: new Date().toISOString(),
    };

    const { error: paymentError } = await supabase.from('payments').insert([paymentData]);

    if (paymentError) {
      console.error('Error storing payment:', paymentError.message);
      return res.status(500).send('Error storing payment');
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(400).send('Webhook Error');
  }
};
