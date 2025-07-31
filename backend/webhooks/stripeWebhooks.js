import stripe from 'stripe';
import { supabase } from '../supabaseServer.js';

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Webhook Error:', error.message);
    response.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { appointmentId } = session.data[0].metadata;

      // Update appointment in Supabase
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ payment: true, updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      if (updateError) {
        console.error('Error updating appointment:', updateError.message);
        response.status(500).send('Error updating appointment');
        return;
      }

      // Store payment details
      const paymentData = {
        appointment_id: appointmentId,
        payment_gateway: 'stripe',
        transaction_id: paymentIntentId,
        status: 'succeeded',
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        created_at: new Date().toISOString(),
      };

      const { error: paymentError } = await supabase.from('payments').insert([paymentData]);

      if (paymentError) {
        console.error('Error storing payment:', paymentError.message);
        response.status(500).send('Error storing payment');
        return;
      }

      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { appointmentId } = session.data[0].metadata;

      // Update appointment in Supabase
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ cancelled: true, updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      if (updateError) {
        console.error('Error updating appointment:', updateError.message);
        response.status(500).send('Error updating appointment');
        return;
      }

      // Store payment details
      const paymentData = {
        appointment_id: appointmentId,
        payment_gateway: 'stripe',
        transaction_id: paymentIntentId,
        status: 'failed',
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        created_at: new Date().toISOString(),
      };

      const { error: paymentError } = await supabase.from('payments').insert([paymentData]);

      if (paymentError) {
        console.error('Error storing payment:', paymentError.message);
        response.status(500).send('Error storing payment');
        return;
      }

      break;
    }
    default:
      console.error(`Unhandled event type ${event.type}`);
      break;
  }
  response.json({ received: true });
};
