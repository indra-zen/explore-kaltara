-- Add payment fields to bookings table for Xendit integration

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Create index for payment queries
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON public.bookings(payment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);

-- Update booking status enum to include payment statuses
-- Note: You may need to modify this based on your existing enum
COMMENT ON COLUMN public.bookings.payment_status IS 'Payment status: pending, processing, completed, failed, expired, refunded';
COMMENT ON COLUMN public.bookings.payment_id IS 'Xendit invoice/payment ID for tracking';
COMMENT ON COLUMN public.bookings.paid_at IS 'Timestamp when payment was completed';
