# Testing Xendit Payment Integration

## 🧪 Test the Payment Flow

Here's how to test if the payment integration is working:

### Step 1: Go to Your Live Site
Visit: https://explore-kaltara.vercel.app

### Step 2: Try to Book Something
1. Go to a hotel or destination page
2. Click "Book Now" 
3. Fill in the booking form
4. Click "Bayar Sekarang" (Pay Now)

### Step 3: What Should Happen
1. **Loading screen**: "Menyiapkan Pembayaran" (Preparing Payment)
2. **Redirect**: You should be redirected to Xendit payment page
3. **Payment options**: You'll see Indonesian payment methods (bank transfer, e-wallet, etc.)

### Step 4: What If It Doesn't Work
Check the browser console (F12) for any errors.

## 🔧 Potential Issues to Check

### Issue 1: API Route Not Working
If you get an error when clicking "Pay Now", the `/api/payment/create` route might not be working.

**Test**: Visit this URL directly:
```
https://explore-kaltara.vercel.app/api/payment/create
```
You should see an error about missing fields, which means the API is working.

### Issue 2: Xendit Credentials
Make sure your `.env.local` has the correct Xendit credentials.

### Issue 3: Database Schema
Make sure the database has the new payment fields:
- `payment_id`
- `payment_status` 
- `paid_at`

## 🚀 Current Payment Flow

When user clicks "Bayar Sekarang":

1. **Create Booking** → Database booking with status "pending"
2. **Call Payment API** → POST to `/api/payment/create`
3. **Create Xendit Invoice** → Xendit generates payment page
4. **Redirect User** → Browser goes to Xendit payment page
5. **User Pays** → Completes payment on Xendit
6. **Webhook Called** → Xendit notifies your site
7. **Update Booking** → Status changes to "confirmed"
8. **User Redirected** → Back to success page

## 📝 Quick Debug Steps

1. **Check if booking page loads**: ✅ 
2. **Check if form submission works**: ❓
3. **Check if payment API responds**: ❓
4. **Check if Xendit invoice creates**: ❓
5. **Check if redirect happens**: ❓

Try these steps and let me know where it fails!
