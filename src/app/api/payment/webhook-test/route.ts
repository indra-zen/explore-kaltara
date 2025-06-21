import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // Log everything for debugging
    console.log('=== WEBHOOK TEST DEBUG ===');
    console.log('Method:', request.method);
    console.log('URL:', request.url);
    
    // Log all headers
    console.log('All Headers:');
    request.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    console.log('Body:', body);
    console.log('Body length:', body.length);
    
    // Try to parse JSON
    try {
      const jsonData = JSON.parse(body);
      console.log('Parsed JSON:', jsonData);
    } catch (e) {
      console.log('Failed to parse JSON:', e);
    }
    
    console.log('=== END DEBUG ===');
    
    return NextResponse.json({ 
      success: true,
      message: 'Webhook test received successfully',
      received_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json(
      { error: 'Webhook test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Webhook test endpoint is working',
    timestamp: new Date().toISOString()
  });
}
