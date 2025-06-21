import { NextRequest, NextResponse } from 'next/server';
import { XenditService } from '@/lib/xendit/xendit-service';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      bookingId, 
      amount, 
      currency = 'IDR',
      customerEmail,
      customerName,
    } = body;

    // Validate required fields
    if (!bookingId || !amount || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        destinations(name),
        hotels(name)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Create description
    const itemName = booking.hotel_id 
      ? booking.hotels?.name 
      : booking.destinations?.name;
    
    const description = `Booking for ${itemName} - ${booking.check_in_date} to ${booking.check_out_date}`;

    // Create Xendit invoice
    const paymentResponse = await XenditService.createInvoice({
      bookingId,
      amount,
      currency,
      description,
      customerEmail,
      customerName,
      successRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?booking_id=${bookingId}`,
      failureRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/failed?booking_id=${bookingId}`,
    });

    // Update booking with payment info
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_id: paymentResponse.id,
        payment_status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking with payment info:', updateError);
    }

    return NextResponse.json({
      success: true,
      payment: paymentResponse,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
