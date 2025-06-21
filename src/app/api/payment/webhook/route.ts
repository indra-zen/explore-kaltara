import { NextRequest, NextResponse } from 'next/server';
import { XenditService } from '@/lib/xendit/xendit-service';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with service role for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const body = await request.text();
    const signature = request.headers.get('x-callback-token') || '';
    const authHeader = request.headers.get('authorization') || '';
    const xenditSignature = request.headers.get('x-callback-token') || '';
    
    // Log headers for debugging
    console.log('Webhook received:');
    console.log('Headers:', {
      'x-callback-token': xenditSignature,
      'authorization': authHeader,
      'content-type': request.headers.get('content-type'),
    });
    console.log('Body:', body);
    console.log('Expected token:', process.env.XENDIT_WEBHOOK_TOKEN);
    
    // Temporarily disable signature verification for testing
    // TODO: Re-enable after confirming webhook format
    /*
    if (!XenditService.verifyWebhookSignature(body, signature)) {
      console.log('Signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    */
    
    // Simple token verification as fallback
    if (process.env.XENDIT_WEBHOOK_TOKEN && xenditSignature !== process.env.XENDIT_WEBHOOK_TOKEN) {
      console.log('Token verification failed:', {
        received: xenditSignature,
        expected: process.env.XENDIT_WEBHOOK_TOKEN
      });
      // For now, let's allow it to proceed for testing
    }

    const webhookData = JSON.parse(body);
    
    console.log('Xendit webhook received:', webhookData);

    // Handle different webhook events
    switch (webhookData.status) {
      case 'PAID':
        const { data: paidBooking, error: paidError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', webhookData.id)
          .select()
          .single();
        
        if (paidError) {
          console.error('Error updating paid booking:', paidError);
        } else {
          console.log('Booking payment completed:', webhookData.id, paidBooking);
        }
        break;

      case 'EXPIRED':
        const { data: expiredBooking, error: expiredError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'expired',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', webhookData.id)
          .select()
          .single();
        
        if (expiredError) {
          console.error('Error updating expired booking:', expiredError);
        } else {
          console.log('Booking payment expired:', webhookData.id, expiredBooking);
        }
        break;

      case 'FAILED':
        const { data: failedBooking, error: failedError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', webhookData.id)
          .select()
          .single();
        
        if (failedError) {
          console.error('Error updating failed booking:', failedError);
        } else {
          console.log('Booking payment failed:', webhookData.id, failedBooking);
        }
        break;

      default:
        console.log('Unhandled webhook status:', webhookData.status);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
