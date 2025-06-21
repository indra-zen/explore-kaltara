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

      const invoice = await xendit.Invoice.createInvoice(invoiceRequest);

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
      throw new Error('Failed to create payment invoice');
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
    
    const hash = crypto
      .createHmac('sha256', webhookToken)
      .update(rawBody)
      .digest('hex');
    
    return hash === signature;
  }
}

export default XenditService;
