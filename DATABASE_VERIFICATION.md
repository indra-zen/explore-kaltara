# Database Schema Verification

## After Running safe_schema_fix.sql

Run these queries in Supabase SQL Editor to verify the fix worked:

### 1. Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'destinations', 'hotels', 'bookings', 'reviews');
```

### 2. Check Foreign Key Constraints
```sql
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('bookings', 'reviews')
ORDER BY tc.table_name, tc.constraint_name;
```

### 3. Check Bookings Table Structure
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
```

### 4. Test Sample Data
```sql
-- Check destinations
SELECT id, name, slug FROM destinations LIMIT 3;

-- Check hotels  
SELECT id, name, slug FROM hotels LIMIT 3;

-- Check existing bookings
SELECT id, booking_type, status, created_at FROM bookings;
```

## Expected Results

✅ All tables should exist
✅ Foreign key constraints should be properly set up
✅ Bookings table should have all required columns
✅ Sample data should be present (if not already existing)
✅ Any existing bookings should still be there

## Next Steps

After verification:
1. Test creating a new booking through the app
2. Check if booking appears in admin dashboard
3. Verify booking shows in user profile
