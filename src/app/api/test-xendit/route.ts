import { NextRequest, NextResponse } from 'next/server';
import { XenditService } from '@/lib/xendit/xendit-service';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Xendit integration...');
    
    // Test with simple data
    const testPaymentData = {
      bookingId: 'test-booking-123',
      amount: 100000,
      currency: 'IDR',
      description: 'Test booking payment',
      customerEmail: 'test@example.com',
      customerName: 'Test User',
      successRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success`,
      failureRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/failed`,
    };
    
    console.log('Creating test invoice with data:', testPaymentData);
    
    const result = await XenditService.createInvoice(testPaymentData);
    
    console.log('Test invoice created successfully:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Xendit integration working',
      data: result,
    });

  } catch (error) {
    console.error('Xendit test failed:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Xendit test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
