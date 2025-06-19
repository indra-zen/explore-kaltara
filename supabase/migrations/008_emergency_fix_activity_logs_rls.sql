-- Emergency fix for activity_logs RLS policies
-- This creates more permissive policies to restore functionality

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admins can update activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admins can delete activity logs" ON public.activity_logs;

-- Create a simple, permissive policy for authenticated users
-- This allows any authenticated user to perform all operations on activity_logs
CREATE POLICY "Authenticated users can manage activity logs" 
  ON public.activity_logs FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Alternative: If you want to be more specific to admin emails, use this instead:
-- (Comment out the above policy and uncomment this one if needed)
/*
CREATE POLICY "Admin users can manage activity logs" 
  ON public.activity_logs FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    auth.jwt() ->> 'email' IN ('admin@explorekaltara.com', 'demo@admin.com')
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    auth.jwt() ->> 'email' IN ('admin@explorekaltara.com', 'demo@admin.com')
  );
*/
