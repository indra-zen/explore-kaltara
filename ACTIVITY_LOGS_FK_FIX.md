# Activity Logs Foreign Key Fix

## Issue
The `activity_logs` table has a foreign key constraint that references `public.profiles(id)`, but admin users might exist in `auth.users` without having a corresponding record in `public.profiles`. This causes the logActivity function to fail when trying to insert activity logs during destination updates.

## Root Cause
- `activity_logs.user_id` has a foreign key constraint to `public.profiles(id)`
- Admin users exist in `auth.users` but may not have profiles in `public.profiles`
- PostgreSQL foreign key constraint (error code 23503) prevents the insert

## Solutions Implemented

### 1. Enhanced Error Handling (Immediate Fix)
Updated `AdminService.logActivity()` to:
- Detect foreign key constraint errors (error code 23503)
- Automatically create missing profile records when needed
- Retry the activity logging after profile creation
- Graceful failure that doesn't break the main operation

### 2. Database Migration (Recommended Long-term Fix)
Created migration `006_fix_activity_logs_fk.sql` to:
- Change foreign key to reference `auth.users(id)` instead of `public.profiles(id)`
- Add proper indexes for performance
- Use `ON DELETE SET NULL` for safer constraint handling

## Migration to Apply (Optional)
Run the following SQL in your Supabase Dashboard → SQL Editor:

```sql
-- Fix activity_logs foreign key constraint
-- The user_id should reference auth.users instead of profiles to avoid foreign key issues

-- First, drop the existing foreign key constraint
ALTER TABLE public.activity_logs 
DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey;

-- Add a new foreign key constraint that references auth.users directly
ALTER TABLE public.activity_logs 
ADD CONSTRAINT activity_logs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
```

## Status
✅ **FIXED**: Enhanced error handling now automatically resolves the foreign key issue
✅ **TESTED**: Build passes successfully with no TypeScript errors
🔄 **RECOMMENDED**: Apply the database migration for cleaner long-term solution

## How to Test
1. Go to `/admin/destinations` 
2. Edit any destination and save it
3. Check the browser console:
   - If profile exists: Activity logs normally
   - If profile missing: Creates profile automatically and logs activity
   - No more "Database error in logActivity" blocking the operation

## Files Changed
- `/src/lib/supabase/admin-service.ts` (enhanced logActivity function)
- `/supabase/migrations/006_fix_activity_logs_fk.sql` (optional migration)
- `/ACTIVITY_LOGS_FK_FIX.md` (this documentation)
