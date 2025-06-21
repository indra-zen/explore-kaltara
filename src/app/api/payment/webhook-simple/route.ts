import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const webhookData = JSON.parse(body);
    
    console.log('=== SIMPLE WEBHOOK RECEIVED ===');
    console.log('Data:', webhookData);
    console.log('Status:', webhookData.status);
    console.log('Invoice ID:', webhookData.id);
    console.log('External ID:', webhookData.external_id);
    
    // Handle payment status updates
    switch (webhookData.status) {
      case 'PAID':
        console.log('Processing PAID webhook for:', webhookData.external_id);
        const { data: paidUpdate, error: paidError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'completed',
            status: 'confirmed',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', webhookData.id);
        
        if (paidError) {
          console.error('Error updating paid booking:', paidError);
        } else {
          console.log('Successfully updated booking to PAID');
        }
        break;

      case 'EXPIRED':
        console.log('Processing EXPIRED webhook for:', webhookData.external_id);
        const { error: expiredError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'expired',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', webhookData.id);
        
        if (expiredError) {
          console.error('Error updating expired booking:', expiredError);
        }
        break;

      case 'FAILED':
        console.log('Processing FAILED webhook for:', webhookData.external_id);
        const { error: failedError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', webhookData.id);
        
        if (failedError) {
          console.error('Error updating failed booking:', failedError);
        }
        break;

      default:
        console.log('Unhandled webhook status:', webhookData.status);
    }

    return NextResponse.json({ 
      received: true,
      status: webhookData.status,
      processed_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Simple webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
