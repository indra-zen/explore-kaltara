# Email Confirmation Setup Guide

## Supabase Dashboard Configuration

1. **Go to Authentication Settings**:
   - Open your Supabase Dashboard
   - Go to **Authentication** → **Settings**

2. **Configure URL Configuration**:
   ```
   Site URL: http://localhost:3000
   Redirect URLs: 
   - http://localhost:3000/auth/callback
   - http://localhost:3000 (optional, for fallback)
   ```

3. **Email Templates** (Optional):
   - Go to **Authentication** → **Email Templates**
   - You can customize the confirmation email template
   - Make sure the confirmation URL uses: `{{ .ConfirmationURL }}`

## How the Flow Works Now

1. **User registers** → Gets email confirmation link
2. **User clicks email link** → Redirects to `/auth/callback`
3. **Callback page** → Automatically verifies and logs in user
4. **Redirects to home** → Shows success message
5. **User is logged in** → No manual login required!

## For Production

When deploying to production, update the URLs in Supabase:
```
Site URL: https://yourdomain.com
Redirect URLs: https://yourdomain.com/auth/callback
```

## Testing

1. Register with a new email
2. Check your email for confirmation link
3. Click the link
4. Should automatically redirect and log you in
5. See success message on home page

## Troubleshooting

**Still redirecting to localhost without login?**
- Check Supabase URL configuration
- Make sure redirect URL is exactly: `http://localhost:3000/auth/callback`
- Clear browser cache/cookies

**Email not arriving?**
- Check spam folder
- Verify email settings in Supabase (Authentication → Settings → SMTP)

**Callback page not working?**
- Check browser console for errors
- Verify the auth callback file exists at `/src/app/auth/callback/page.tsx`
