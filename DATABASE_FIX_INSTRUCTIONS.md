# Database Foreign Key Relationship Fix

## Problem
Browser console error: "Searched for a foreign key relationship between 'reviews' and 'profiles' in the schema 'public', but no matches were found."

## Root Cause
The database foreign key relationships were incorrectly set up to reference `auth.users` instead of `profiles` table, causing join failures in admin queries.

## Solution

### Step 1: Execute Database Schema Fix

1. **Open Supabase Dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the ENTIRE contents** of `supabase/complete_schema_fix.sql`
4. **Click "RUN"** to execute the script

### Step 2: Verify the Fix

After running the SQL script, check that:

1. **Tables exist** with correct foreign key relationships:
   - `bookings.user_id` → `profiles.id`
   - `reviews.user_id` → `profiles.id`

2. **Sample data is inserted**:
   - At least one destination
   - At least one hotel

3. **Permissions are correct**:
   - Row Level Security (RLS) enabled
   - Appropriate policies in place

### Step 3: Test Booking Flow

1. **Create a new booking** through the application
2. **Check browser console** - should show no foreign key errors
3. **Check admin dashboard** - should display the booking
4. **Check profile page** - should also show the booking

## What the Script Does

### Database Structure
- ✅ **Recreates tables** with correct foreign key relationships
- ✅ **Sets up proper RLS policies** for security
- ✅ **Inserts sample data** for testing
- ✅ **Grants correct permissions** for app functionality

### Foreign Key Relationships Fixed
- `bookings.user_id` → `profiles.id` (was `auth.users.id`)
- `reviews.user_id` → `profiles.id` (was `auth.users.id`)
- `bookings.hotel_id` → `hotels.id` ✅
- `bookings.destination_id` → `destinations.id` ✅

### Sample Data Inserted
- **Destination**: "Hutan Mangrove dan Konservasi Bekantan"
- **Hotel**: "Swiss-Belhotel Tarakan"

## Expected Result

After executing this script:
- ✅ **No more foreign key errors** in browser console
- ✅ **Bookings save to database** successfully
- ✅ **Admin dashboard shows bookings** from database
- ✅ **Profile page shows bookings** from localStorage
- ✅ **Complete integration** between frontend and database

## Troubleshooting

If you still see errors after running the script:

1. **Check Supabase SQL Editor** for any execution errors
2. **Verify all tables exist** in Database → Tables
3. **Check foreign key relationships** in table details
4. **Ensure sample data exists** by running: `SELECT * FROM destinations; SELECT * FROM hotels;`

## File Location
`supabase/complete_schema_fix.sql` - Run this entire file in Supabase Dashboard → SQL Editor
