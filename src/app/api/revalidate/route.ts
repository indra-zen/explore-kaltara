import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, slug, secret } = body;

    // Verify secret token to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate specific paths based on type
    switch (type) {
      case 'destination':
        if (slug) {
          // Revalidate specific destination page
          await revalidatePath(`/destinations/${slug}`);
          console.log(`Revalidated destination: /destinations/${slug}`);
        } else {
          // Revalidate all destination pages
          await revalidatePath('/destinations');
          console.log('Revalidated all destinations');
        }
        break;

      case 'hotel':
        if (slug) {
          // Revalidate specific hotel page
          await revalidatePath(`/hotels/${slug}`);
          console.log(`Revalidated hotel: /hotels/${slug}`);
        } else {
          // Revalidate all hotel pages
          await revalidatePath('/hotels');
          console.log('Revalidated all hotels');
        }
        break;

      case 'all':
        // Revalidate all pages
        await revalidatePath('/');
        await revalidatePath('/destinations');
        await revalidatePath('/hotels');
        console.log('Revalidated all pages');
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: destination, hotel, or all' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated ${type}${slug ? ` (${slug})` : ''}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
