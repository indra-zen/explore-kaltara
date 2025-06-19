# 🗄️ Database Setup Verification Guide

## ⚠️ CRITICAL: Database Must Be Set Up for Full Functionality

Your Explore Kaltara platform requires a properly configured Supabase database to function completely. Here's how to verify and fix any database issues:

## 🔍 **STEP 1: Check Database Status**

### Quick Database Check:
1. **Open Supabase Dashboard** → Your Project
2. **Go to SQL Editor**
3. **Run this query:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Expected Tables:
- ✅ `profiles`
- ✅ `destinations` 
- ✅ `hotels`
- ✅ `bookings`
- ✅ `reviews`
- ✅ `activity_logs`

## 🔧 **STEP 2: Fix Missing Tables**

If any tables are missing, run the complete schema:

### Database Setup Instructions:
1. **Copy ENTIRE contents** of `supabase/complete_schema_fix.sql`
2. **Paste into Supabase SQL Editor**
3. **Click "RUN"**
4. **Wait for completion** (should take 5-10 seconds)

## 🧪 **STEP 3: Verify Setup**

### Test Database Connection:
```sql
-- Test 1: Check if profiles table exists and has correct structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Test 2: Check if sample data exists
SELECT COUNT(*) as destination_count FROM destinations;
SELECT COUNT(*) as hotel_count FROM hotels;

-- Test 3: Check foreign key relationships
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public';
```

## 📊 **Database Health Check Results**

### ✅ **Healthy Database Should Show:**
- All 6 tables exist
- Sample destinations and hotels are present
- Foreign key relationships are correctly set up
- Row Level Security (RLS) policies are active

### ❌ **Common Issues:**

#### Issue 1: "relation does not exist" errors
**Solution**: Run `complete_schema_fix.sql`

#### Issue 2: Foreign key constraint violations  
**Solution**: Ensure profile exists before creating bookings

#### Issue 3: Empty admin dashboard
**Solution**: Create test bookings through the app

## 🔐 **STEP 4: Authentication Setup**

### Supabase Auth Configuration:
1. **Go to Supabase Dashboard** → Authentication → Settings
2. **Ensure these settings:**
   - ✅ Enable email confirmations (recommended for production)
   - ✅ Allow user signups
   - ✅ Email templates configured

### Test Admin Access:
- **Admin Email**: `demo@admin.com`
- **Create Account**: Register through the app first
- **Access Admin**: Go to `/admin` after login

## 🚨 **CRITICAL TROUBLESHOOTING**

### Problem: Bookings not appearing in admin dashboard
**Cause**: Database not set up or foreign key issues
**Solution**: 
1. Run complete schema fix
2. Create a test booking through the app
3. Check admin dashboard

### Problem: Authentication errors
**Cause**: Profile table missing or misconfigured
**Solution**:
1. Ensure `profiles` table exists
2. Check RLS policies are active
3. Verify user can register/login

### Problem: Admin access denied
**Cause**: User email not in admin list
**Solution**:
1. Register with `demo@admin.com` OR
2. Add your email to `src/lib/auth/admin.ts`

## 📋 **Post-Setup Verification Checklist**

- [ ] All database tables exist
- [ ] Sample data is present
- [ ] User registration works
- [ ] User login works  
- [ ] Admin login works
- [ ] Booking creation works
- [ ] Admin dashboard shows data
- [ ] No console errors

## 🎯 **Expected Behavior After Setup**

### User Features:
- ✅ Browse destinations and hotels
- ✅ Create user account
- ✅ Complete booking flow
- ✅ View bookings in profile
- ✅ Add items to wishlist

### Admin Features:
- ✅ Access admin dashboard
- ✅ View all bookings
- ✅ Manage users
- ✅ Manage destinations/hotels
- ✅ View analytics and statistics

## 🔄 **If Problems Persist**

1. **Check browser console** for specific error messages
2. **Check Supabase logs** in Dashboard → API → Logs
3. **Verify environment variables** in `.env.local`
4. **Test with fresh user registration**

---

**⚠️ Note**: The platform works offline with localStorage for basic functionality, but database integration is required for admin features and data persistence.
