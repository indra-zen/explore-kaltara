# Activity Logging Error Fix - Complete Guide

## Issue Description
When updating destinations in the admin panel, the console showed: "Error logging activity: {}"

## Root Cause
The error was caused by several mismatches between the database schema and the application code:

1. **Database Schema Mismatch**: The `activity_logs` table in the migration had:
   - `entity_id TEXT` instead of `entity_id UUID`
   - `user_id` referencing `auth.users(id)` instead of `public.profiles(id)`
   - `ip_address INET` instead of `ip_address TEXT`

2. **Missing Error Details**: The error logging was too generic and didn't provide specific error information.

## Fixes Applied

### 1. Updated Migration File (`002_admin_tables.sql`)
```sql
-- Fixed activity_logs table structure
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,  -- Fixed reference
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,  -- Changed from TEXT to UUID
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,  -- Changed from INET to TEXT
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 2. Enhanced Error Logging (`admin-service.ts`)
```typescript
static async logActivity(
  action: string,
  entityType: string,
  entityId: string,
  description: string,
  metadata: any = {}
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No authenticated user found for activity logging');
      return;
    }

    const logData = {
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      description,
      metadata: metadata || {}
    };

    console.log('Attempting to log activity:', logData);

    const { error } = await supabase
      .from('activity_logs')
      .insert(logData);

    if (error) {
      console.error('Database error in logActivity:', error);
      throw error;
    }

    console.log('Activity logged successfully');
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw the error to prevent it from breaking the main operation
  }
}
```

### 3. Updated Database Types
Fixed the `activity_logs` type definition in `database.types.ts` to match the corrected schema.

## Database Setup Required

To resolve this issue completely, you need to:

### 1. Run Migration in Supabase Dashboard
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the content of `supabase/migrations/002_admin_tables.sql`
4. If the table already exists with wrong schema, drop it first:
   ```sql
   DROP TABLE IF EXISTS public.activity_logs CASCADE;
   ```
   Then run the migration.

### 2. Populate Test Data (Optional)
Run `supabase/migrations/003_seed_data.sql` to add sample destinations and hotels for testing.

### 3. Create Test User Profile
1. Sign up a user through your app
2. Manually insert a profile record or ensure your auth triggers create one

## Verification Steps

1. **Check Database Schema**:
   ```sql
   \d public.activity_logs
   ```

2. **Test Activity Logging**:
   - Try updating a destination in the admin panel
   - Check browser console for detailed logs
   - Verify entry in activity_logs table:
   ```sql
   SELECT * FROM public.activity_logs ORDER BY created_at DESC LIMIT 5;
   ```

3. **Check Authentication**:
   - Ensure user is properly authenticated
   - Verify user profile exists in profiles table

## Expected Console Output (After Fix)

When updating a destination, you should see:
```
Attempting to log activity: {
  user_id: "...",
  action: "update",
  entity_type: "destination",
  entity_id: "...",
  description: "Updated destination: ...",
  metadata: {...}
}
Activity logged successfully
```

## Common Issues and Solutions

### Issue: "relation 'activity_logs' does not exist"
**Solution**: Run the migration SQL in Supabase Dashboard

### Issue: "foreign key constraint violation"
**Solution**: Ensure user profile exists in profiles table

### Issue: "column 'entity_id' is of type uuid but expression is of type text"
**Solution**: Ensure migration was run with UUID type for entity_id

### Issue: Still getting "{}" error
**Solution**: Check browser console for more detailed error messages with the updated logging

## Files Modified
- ✅ `supabase/migrations/002_admin_tables.sql`
- ✅ `src/lib/supabase/admin-service.ts`
- ✅ `src/lib/supabase/database.types.ts`
- ✅ Created `supabase/migrations/003_seed_data.sql`

The activity logging error should now be resolved, and you'll get detailed error information if any issues persist.
