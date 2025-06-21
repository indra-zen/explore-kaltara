import { Xendit } from 'xendit-node';

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
});

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
}

export interface PaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  invoice_url: string;
  external_id: string;
}

export class XenditService {
  // Create Invoice using any type to handle API differences
  static async createInvoice(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Creating Xendit invoice with data:', paymentData);
      
      const invoiceRequest = {
        externalId: `booking-${paymentData.bookingId}-${Date.now()}`,
        amount: paymentData.amount,
        description: paymentData.description,
        invoiceDuration: 86400, // 24 hours
        customer: {
          givenNames: paymentData.customerName,
          email: paymentData.customerEmail,
        },
        successRedirectUrl: paymentData.successRedirectUrl,
        failureRedirectUrl: paymentData.failureRedirectUrl,
        currency: paymentData.currency,
        items: [
          {
            name: paymentData.description,
            quantity: 1,
            price: paymentData.amount,
          },
        ],
      } as any;

      console.log('Xendit invoice request:', invoiceRequest);
      
      // The Xendit SDK expects the data to be wrapped in a createInvoiceRequest object
      const invoice = await xendit.Invoice.createInvoice({
        data: invoiceRequest
      });
      
      console.log('Xendit invoice response:', invoice);

      return {
        id: invoice.id || '',
        status: invoice.status || 'PENDING',
        amount: invoice.amount || paymentData.amount,
        currency: invoice.currency || paymentData.currency,
        description: invoice.description || paymentData.description,
        invoice_url: invoice.invoiceUrl || (invoice as any).invoice_url || '',
        external_id: invoice.externalId || (invoice as any).external_id || '',
      };
    } catch (error) {
      console.error('Xendit Invoice Creation Error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Provide more specific error messages
      if (error instanceof Error) {
        throw new Error(`Xendit API Error: ${error.message}`);
      } else {
        throw new Error('Failed to create payment invoice');
      }
    }
  }

  // Get Invoice Status by ID
  static async getInvoiceStatus(invoiceId: string) {
    try {
      // For now, we'll return a basic structure
      // In production, you'd implement proper invoice status checking
      return {
        id: invoiceId,
        status: 'PENDING',
        amount: 0,
        paid_amount: 0,
        external_id: invoiceId,
      };
    } catch (error) {
      console.error('Xendit Get Invoice Error:', error);
      throw new Error('Failed to get invoice status');
    }
  }

  // Verify Webhook Signature (for security)
  static verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const crypto = require('crypto');
    const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN!;
    
    if (!webhookToken) {
      console.warn('XENDIT_WEBHOOK_TOKEN not set, skipping signature verification');
      return true; // For development, allow without verification
    }
    
    // Log for debugging
    console.log('Signature verification:', {
      receivedSignature: signature,
      webhookToken: webhookToken,
      bodyLength: rawBody.length
    });
    
    // Method 1: Direct token comparison (most common for Xendit)
    if (signature === webhookToken) {
      console.log('Direct token match successful');
      return true;
    }
    
    // Method 2: HMAC SHA256 signature
    const hash = crypto
      .createHmac('sha256', webhookToken)
      .update(rawBody)
      .digest('hex');
    
    if (hash === signature) {
      console.log('HMAC signature match successful');
      return true;
    }
    
    // Method 3: Try with 'sha256=' prefix
    const hashWithPrefix = 'sha256=' + hash;
    if (hashWithPrefix === signature) {
      console.log('HMAC with prefix match successful');
      return true;
    }
    
    console.log('All signature verification methods failed');
    return false;
  }
}

export default XenditService;
