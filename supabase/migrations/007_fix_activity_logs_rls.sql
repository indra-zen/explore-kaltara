-- Fix activity_logs RLS policies to allow admin users to insert activity logs
-- Current issue: Only SELECT policy exists, missing INSERT policy for activity logging

-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.activity_logs;

-- Create comprehensive RLS policies for activity_logs

-- Allow admins to view all activity logs
CREATE POLICY "Admins can view activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  );

-- Allow admins to insert activity logs (this was missing!)
CREATE POLICY "Admins can insert activity logs" 
  ON public.activity_logs FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  );

-- Allow admins to update activity logs (for future use)
CREATE POLICY "Admins can update activity logs" 
  ON public.activity_logs FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  );

-- Allow admins to delete activity logs (for future use)
CREATE POLICY "Admins can delete activity logs" 
  ON public.activity_logs FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email IN ('admin@explorekaltara.com', 'demo@admin.com')
    )
  );
