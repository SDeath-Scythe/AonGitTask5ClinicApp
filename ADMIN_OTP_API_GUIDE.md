# Admin OTP Authentication API Guide

## 📋 Overview

The Admin controller now includes complete OTP generation and verification functionality with JWT token authentication.

## 🔧 Setup

**Environment Variables (.env):**
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT token generation

## 🔐 Admin OTP Authentication Flow

### Step 1: Create Admin Account

**POST** `http://localhost:3000/admin/add`

**Body:**
```json
{
  "phone": "07701234567"
}
```

**Response:**
```json
{
  "id": "clxxx...",
  "phone": "07701234567",
  "otp": null,
  "otpCreatedAt": null,
  "active": true
}
```

---

### Step 2: Generate OTP

**POST** `http://localhost:3000/admin/otp/generate`

**Body:**
```json
{
  "phone": "07701234567"
}
```

**Response:**
```json
{
  "message": "OTP generated successfully",
  "otp": "1234"
}
```

**Note:** OTP is valid for 5 minutes. In production, the OTP should be sent via SMS and not returned in the response.

---

### Step 3: Verify OTP and Login

**POST** `http://localhost:3000/admin/otp/verify`

**Body:**
```json
{
  "phone": "07701234567",
  "otp": "1234"
}
```

**Response:**
```json
{
  "id": "clxxx...",
  "phone": "07701234567",
  "active": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**💾 Save the token!** Use it for authenticated requests.

---

## 📡 Other Admin Endpoints

### Get All Admins

**GET** `http://localhost:3000/admin/getAll`

**Response:**
```json
[
  {
    "id": "clxxx...",
    "phone": "07701234567",
    "otp": null,
    "otpCreatedAt": null,
    "active": true
  }
]
```

---

### Get Admin by ID

**GET** `http://localhost:3000/admin/getById/:id`

**Response:**
```json
{
  "id": "clxxx...",
  "phone": "07701234567",
  "otp": null,
  "otpCreatedAt": null,
  "active": true
}
```

---

### Delete Admin

**DELETE** `http://localhost:3000/admin/delete/:id`

**Response:**
```json
{
  "id": "clxxx...",
  "phone": "07701234567",
  "otp": null,
  "otpCreatedAt": null,
  "active": true
}
```

---

## ⚠️ Error Responses

### OTP Generation Errors

**Admin Not Found (404):**
```json
{
  "error": "Admin not found with this phone number"
}
```

**Missing Phone (400):**
```json
{
  "error": "Phone number is required"
}
```

---

### OTP Verification Errors

**Invalid OTP (401):**
```json
{
  "error": "Invalid phone number or OTP"
}
```

**Expired OTP (401):**
```json
{
  "error": "OTP has expired. Please request a new one."
}
```

**Missing Fields (400):**
```json
{
  "error": "Phone and OTP are required"
}
```

---

## 🔄 Complete Authentication Flow

```
1. POST /admin/add
   ↓
   Admin Created (phone registered)
   ↓
2. POST /admin/otp/generate
   ↓
   OTP Generated (4-digit, 5-minute expiry)
   ↓
3. POST /admin/otp/verify
   ↓
   OTP Verified
   JWT Token Issued (30-day expiry)
   OTP Cleared from Database
   ↓
4. Admin Can Now Use Protected Routes
```

---

## 🧪 Testing in Postman

### Test Sequence:

1. **Create Admin:**
   - POST to `/admin/add` with phone number
   - Copy the returned ID

2. **Generate OTP:**
   - POST to `/admin/otp/generate` with same phone
   - Copy the returned OTP

3. **Verify OTP:**
   - POST to `/admin/otp/verify` with phone and OTP
   - Save the JWT token

4. **Test OTP Expiry:**
   - Wait 5+ minutes after generating OTP
   - Try to verify - should get expiry error

5. **Regenerate OTP:**
   - Call `/admin/otp/generate` again
   - Use new OTP to verify

---

## 📝 Implementation Details

### Controller Functions:

- **`generateOTP(phone)`**
  - Checks if admin exists
  - Generates 4-digit random OTP
  - Updates admin record with OTP and timestamp
  - Returns OTP (for testing; send via SMS in production)

- **`verifyOTP(phone, otp)`**
  - Finds admin by phone and OTP
  - Checks OTP expiry (5 minutes)
  - Clears OTP after successful verification
  - Generates JWT token (30-day expiry)
  - Returns admin info with token

### Security Features:

- ✅ OTP expires after 5 minutes
- ✅ OTP is cleared after successful verification
- ✅ JWT token has 30-day expiry
- ✅ Phone number uniqueness enforced by database
- ✅ Error messages don't expose sensitive information

---

## 🚀 All Available Routes

**Admin:**
- GET `/admin/getAll`
- GET `/admin/getById/:id`
- POST `/admin/add`
- DELETE `/admin/delete/:id`
- POST `/admin/otp/generate`
- POST `/admin/otp/verify`

**Drugs:**
- GET `/drugs/getAll`
- GET `/drugs/getById/:id`
- POST `/drugs/add`
- DELETE `/drugs/delete/:id`

**Patients:**
- GET `/patients/getAll`
- GET `/patients/getById/:id`
- POST `/patients/add`
- DELETE `/patients/delete/:id`

**Visits:**
- GET `/visits/getAll`
- GET `/visits/getById/:id`
- POST `/visits/add`
- DELETE `/visits/delete/:id`

---

## ✅ Status: Fully Implemented and Ready for Testing!
