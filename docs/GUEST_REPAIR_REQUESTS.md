# Guest Repair Service Request System

## Overview
This system allows users to submit repair service requests directly without authentication through a 4-step form process.

## Database Schema

### Table: `guest_repair_requests`

**Location:** `lib/schemas/guest-repair-requests.sql`

#### Columns:

**Device Information (Step 1):**
- `device_type` - Type of device (Camera, Mobile, Laptop, etc.)
- `brand` - Device brand (Sony, Canon, Apple, etc.)
- `model` - Device model
- `serial_number` - Device serial/IMEI number
- `device_password` - Device password for repair access
- `accessories` - Array of accessories included
- `device_image_url` - URL to uploaded device image
- `device_issue` - Detailed description of the issue

**Basic Information (Step 2):**
- `name` - Customer name (required)
- `mobile` - Mobile number (required if email not provided)
- `email` - Email address (required if mobile not provided)
- `terms_accepted` - Terms and conditions acceptance

**Pickup Address (Step 3):**
- `address_line` - Full address
- `region` - State/Region
- `city` - City/Town
- `postal_code` - Postal/Zip code
- `pickup_datetime` - Preferred pickup date and time

**Verification (Step 4):**
- `is_verified` - Verification status
- `verification_method` - 'mobile' or 'email'

**System Fields:**
- `id` - UUID primary key
- `status` - Request status (pending, approved, rejected, completed)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## API Endpoints

### POST `/api/admin/guest-requests`
Submit a new guest repair request

**Request Body:**
```json
{
  "deviceType": "Camera",
  "brand": "Sony",
  "model": "DCR-SR65E",
  "serialNumber": "ABC123456",
  "password": "device_password",
  "accessories": ["Charger", "Case"],
  "deviceImage": "image_url",
  "deviceIssue": "Screen not working",
  "name": "John Doe",
  "mobile": "9999999999",
  "email": "john@example.com",
  "termsAccepted": true,
  "addressLine": "123 Main St",
  "region": "Gujarat",
  "city": "Vadodara",
  "postalCode": "390001",
  "pickupDateTime": "2024-01-15T10:00:00",
  "verificationMethod": "email"
}
```

**Response (201):**
```json
{
  "message": "Repair request submitted successfully",
  "request": { /* full request object */ }
}
```

### GET `/api/admin/guest-requests`
Retrieve guest repair requests with pagination and filtering

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (pending, approved, rejected, completed)
- `search` - Search by name, email, mobile, or brand

**Response (200):**
```json
{
  "requests": [ /* array of requests */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## Frontend Integration

**Location:** `app/extra/guestlead/page.tsx`

The form has been updated to call the API endpoint on submission. The `handleSubmit` function now:
1. Sends form data to `/api/admin/guest-requests`
2. Shows success message on successful submission
3. Displays error alerts on failure

## Setup Instructions

1. **Run the SQL schema:**
   ```bash
   psql -U your_user -d your_database -f lib/schemas/guest-repair-requests.sql
   ```

2. **The API routes are automatically available at:**
   - POST: `/api/admin/guest-requests`
   - GET: `/api/admin/guest-requests`

3. **Frontend form is accessible at:**
   - `/extra/guestlead`

## Features

✅ 4-step form process with progress tracking
✅ Device type, brand, and model selection
✅ Detailed issue description with rich text editor
✅ Customer contact information collection
✅ Pickup address and scheduling
✅ Contact verification (mobile/email)
✅ Form validation at each step
✅ Summary sidebar showing collected information
✅ Success confirmation page
✅ Backend API with pagination and filtering
✅ PostgreSQL database with proper indexing

## Validation Rules

- Device type, brand, model, and name are required
- Either mobile or email must be provided
- Terms and conditions must be accepted
- Address fields required for pickup scheduling
