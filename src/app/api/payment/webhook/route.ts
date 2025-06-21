import { NextRequest, NextResponse } from 'next/server';
import { XenditService } from '@/lib/xendit/xendit-service';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-callback-token') || '';
    
    // Verify webhook signature for security
    if (!XenditService.verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(body);
    
    console.log('Xendit webhook received:', webhookData);

    // Handle different webhook events
    switch (webhookData.status) {
      case 'PAID':
        await supabase
          .from('bookings')
          .update({
            payment_status: 'completed',
            status: 'confirmed',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', webhookData.id);
        
        console.log('Booking payment completed:', webhookData.id);
        break;

      case 'EXPIRED':
        await supabase
          .from('bookings')
          .update({
            payment_status: 'expired',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', webhookData.id);
        
        console.log('Booking payment expired:', webhookData.id);
        break;

      case 'FAILED':
        await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', webhookData.id);
        
        console.log('Booking payment failed:', webhookData.id);
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
