# Troubleshooting Guide - Performance & Email Issues

## Issues Fixed (March 4, 2026)

### 1. Website Running Very Slow
**Problem:** Backend was constantly restarting every few seconds, causing slow performance and connection issues.

**Root Cause:** Nodemon was watching all files including logs and node_modules, causing infinite restart loops.

**Solution:** Created `backend/nodemon.json` configuration file to:
- Only watch relevant JavaScript files
- Ignore node_modules and log files
- Add 2-second delay between restarts
- Prevent unnecessary restarts

**Result:** Backend now runs stable without constant restarts.

---

### 2. Form Submission Hanging with Blank Page
**Problem:** After submitting admission form, page would show blank screen and hang.

**Root Cause:** 
- Email sending was blocking the response
- No success message shown before navigation
- Alert was used instead of proper UI feedback

**Solution:**
- Made email sending non-blocking using `.catch()` 
- Added success message display in UI
- Added 1.5 second delay before redirect to show message
- Form submission completes immediately even if email fails

**Result:** Form now submits instantly, shows success message, and redirects smoothly.

---

### 3. Gmail "App Password Removed" Error
**Problem:** Gmail showing security alert "App password removed" and emails not being sent.

**Root Cause:** Google automatically revokes app passwords for security reasons if:
- Suspicious activity detected
- Long period of inactivity
- Security policy changes

**Solution:**
- Added email transporter verification on server startup
- Better error logging to identify authentication failures
- Non-blocking email sending so form submission works even if email fails
- Added detailed error messages in backend logs

**How to Fix:**
1. Go to Google Account Security: https://myaccount.google.com/security
2. Navigate to "App passwords" section
3. Delete old app password if it exists
4. Generate new app password:
   - Select "Mail" as app
   - Select "Other (Custom name)" as device
   - Enter "Success Mantra Backend"
   - Click "Generate"
5. Copy the 16-digit password (format: xxxx xxxx xxxx xxxx)
6. Update `backend/.env` file:
   ```
   EMAIL_PASSWORD=your_new_16_digit_password_without_spaces
   ```
7. Restart backend server
8. Check logs for "Email server is ready to send messages"

**Result:** Once new app password is configured, emails will send successfully.

---

## Current Status

### Backend
- Running stable on port 5001
- No more constant restarts
- Email verification runs on startup
- Shows clear error if email credentials invalid

### Frontend
- Form submission works smoothly
- Success message displays properly
- Redirects to profile after 1.5 seconds
- No more blank page hanging

### Email System
- Non-blocking - doesn't prevent form submission
- Better error handling and logging
- Ready to work once new app password is configured

---

## How to Verify Everything is Working

### 1. Check Backend Status
```bash
cd backend
npm run dev
```

Look for these messages:
```
Server is running on port 5001
MongoDB URI: mongodb://localhost:27017/success-mantra
Frontend URL: http://localhost:3000
Email server is ready to send messages  ← This means email is configured correctly
```

If you see:
```
Email transporter verification failed: Invalid login
```
Then you need to generate a new Gmail app password.

### 2. Test Form Submission
1. Go to admission form
2. Fill all details and upload photo
3. Click Submit
4. Should see green success message
5. Should redirect to profile after 1.5 seconds
6. Check backend logs for email status

### 3. Test Email Sending
After configuring new app password:
1. Submit a test admission form
2. Check backend logs for:
   ```
   Email sent successfully to: student@email.com - Message ID: <xxx>
   Email sent successfully to: mysuccessmantrainstitute@gmail.com - Message ID: <xxx>
   ```
3. Check student email inbox
4. Check admin email inbox

---

## Performance Improvements Made

1. **Backend Stability**
   - Added nodemon.json configuration
   - Prevents unnecessary restarts
   - Watches only relevant files

2. **Form Submission**
   - Non-blocking email sending
   - Immediate response to user
   - Proper success message display
   - Smooth navigation

3. **Error Handling**
   - Better error logging
   - Email failures don't block form submission
   - Clear error messages for troubleshooting

4. **Email System**
   - Transporter verification on startup
   - Detailed authentication error messages
   - TLS configuration for better compatibility

---

## Files Modified

1. `backend/nodemon.json` - Created new configuration
2. `backend/utils/email.js` - Added verification and better error handling
3. `backend/utils/emailResubmit.js` - Added verification and better error handling
4. `backend/routes/enrollmentRoutes.js` - Made email sending non-blocking
5. `frontend/src/components/AdmissionForm.jsx` - Fixed navigation and success message
6. `README.md` - Updated with troubleshooting information

---

## Next Steps

1. Generate new Gmail app password
2. Update EMAIL_PASSWORD in backend/.env
3. Restart backend server
4. Test form submission
5. Verify emails are being sent

---

## Support

If issues persist:
1. Check backend logs for specific error messages
2. Verify MongoDB is running
3. Ensure all environment variables are set correctly
4. Check Gmail account security settings
5. Verify 2-Step Verification is enabled on Gmail

---

Last Updated: March 4, 2026
