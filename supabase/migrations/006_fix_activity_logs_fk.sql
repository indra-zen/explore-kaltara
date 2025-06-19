-- Fix activity_logs foreign key constraint
-- The user_id should reference auth.users instead of profiles to avoid foreign key issues

-- First, drop the existing foreign key constraint
ALTER TABLE public.activity_logs 
DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey;

-- Add a new foreign key constraint that references auth.users directly
ALTER TABLE public.activity_logs 
ADD CONSTRAINT activity_logs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
