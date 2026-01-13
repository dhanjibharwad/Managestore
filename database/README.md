# Jobs Management System - Database Schema & API

## Overview
This implementation provides a complete jobs management system with PostgreSQL database schema and Next.js API routes.

## Database Schema

### Jobs Table Structure
The `jobs` table includes all form fields with the following key features:

#### Primary Keys & Identifiers
- `id`: Auto-incrementing primary key
- `job_id`: Unique random identifier (format: JOB_XXXXXXXX)
- `job_number`: Sequential job number (format: JOB0001, JOB0002, etc.)
- `company_id`: Company identifier for multi-tenant support

#### Form Fields Mapping
- **Customer Info**: customer_name, source, referred_by
- **Service Details**: service_type, job_type, priority, assignee
- **Device Info**: device_type, device_brand, device_model, serial_number, accessories, storage_location, device_color, device_password
- **Service Details**: services, tags, hardware_config, service_assessment
- **Additional**: initial_quotation, due_date, dealer_job_id, terms_conditions
- **Files**: images (JSONB array)

#### Key Features
1. **Unique Job ID Generation**: Random 8-character hex string (JOB_XXXXXXXX)
2. **Sequential Job Numbers**: Auto-incrementing JOB0001, JOB0002, etc.
3. **Company Isolation**: All queries filtered by company_id
4. **Automatic Timestamps**: created_at and updated_at with triggers
5. **Performance Indexes**: On key search and filter fields

## API Routes

### POST /api/admin/jobs
Creates a new job with:
- Unique job_id generation with collision checking
- Sequential job_number assignment
- Company_id support (defaults to 1)
- Full form validation
- Image upload support

### GET /api/admin/jobs
Retrieves jobs with:
- Company-based filtering
- Pagination support
- Search functionality (customer_name, job_number, job_id, device_brand)
- Status and assignee filtering

## Installation

1. **Run the database schema**:
   ```sql
   -- Execute the contents of database/jobs_schema.sql
   ```

2. **Environment Variables**:
   Ensure your `.env.local` has:
   ```
   DB_HOST=your_host
   DB_PORT=5432
   DB_NAME=your_database
   DB_USER=your_user
   DB_PASSWORD=your_password
   ```

3. **Dependencies**:
   The API uses Node.js `crypto` module for random ID generation.

## Usage Examples

### Creating a Job
```javascript
const response = await fetch('/api/admin/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'John Doe',
    deviceType: '1',
    deviceBrand: '2',
    services: 'Screen Repair',
    assignee: 'Tech Support',
    companyId: 1, // Optional, defaults to 1
    // ... other form fields
  })
});
```

### Fetching Jobs
```javascript
const response = await fetch('/api/admin/jobs?page=1&limit=10&companyId=1&search=john');
```

## Security Considerations

1. **Company Isolation**: All queries are filtered by company_id
2. **Input Validation**: Required fields are validated
3. **SQL Injection Protection**: Parameterized queries used throughout
4. **Unique Constraints**: Prevents duplicate job_id and job_number

## Performance Features

1. **Database Indexes**: Created on frequently queried fields
2. **Pagination**: Efficient LIMIT/OFFSET queries
3. **Optimized Counting**: Separate count queries for pagination
4. **Connection Pooling**: PostgreSQL connection pool for scalability