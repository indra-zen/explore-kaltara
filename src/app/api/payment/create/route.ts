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

    const body = await request.json();
    
    const { 
      bookingId, 
      amount, 
      currency = 'IDR',
      customerEmail,
      customerName,
      bookingDetails,
    } = body;

    console.log('Payment creation request:', { bookingId, amount, customerEmail, customerName, hasBookingDetails: !!bookingDetails });

    // Validate required fields
    if (!bookingId || !amount || !customerEmail || !customerName) {
      console.log('Missing required fields:', { bookingId, amount, customerEmail, customerName });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let booking;
    let itemName = 'Unknown Item';

    // Try to use booking details from request first (faster)
    if (bookingDetails) {
      console.log('Using booking details from request');
      booking = bookingDetails;
      itemName = bookingDetails.itemName || 'Unknown Item';
    } else {
      // Fallback to database query
      console.log('Fetching booking from database with ID:', bookingId);
      const { data: dbBooking, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      console.log('Booking query result:', { dbBooking, bookingError });

      if (bookingError || !dbBooking) {
        console.error('Booking not found error:', bookingError);
        return NextResponse.json(
          { error: 'Booking not found', details: bookingError?.message },
          { status: 404 }
        );
      }

      booking = dbBooking;

      // Get the related data separately to avoid join issues
      if (booking.hotel_id) {
        const { data: hotel } = await supabase
          .from('hotels')
          .select('name')
          .eq('id', booking.hotel_id)
          .single();
        itemName = hotel?.name || 'Hotel';
      } else if (booking.destination_id) {
        const { data: destination } = await supabase
          .from('destinations')
          .select('name')
          .eq('id', booking.destination_id)
          .single();
        itemName = destination?.name || 'Destination';
      }
    }
    
    const description = `Booking for ${itemName} - ${booking.check_in_date} to ${booking.check_out_date}`;
    
    console.log('Creating Xendit invoice with description:', description);

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
    
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment',
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
