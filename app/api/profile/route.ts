import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

// Validation functions
const validatePhone = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone);
};

const validateAadhaar = (aadhaar: string): boolean => {
  return /^\d{12}$/.test(aadhaar);
};

const validatePAN = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

const validatePostalCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};

const validateIFSC = (ifsc: string): boolean => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};

const validateAccountNumber = (account: string): boolean => {
  return /^\d{9,18}$/.test(account);
};

const validateFormData = (data: any) => {
  const errors: string[] = [];
  
  // Required fields
  if (!data.name?.trim()) errors.push('Name is required');
  if (!data.phone?.trim()) errors.push('Phone is required');
  
  // Phone validation
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  // Optional field validations
  if (data.alternatePhone && !validatePhone(data.alternatePhone)) {
    errors.push('Invalid alternate phone number format');
  }
  
  if (data.aadhaarNumber && !validateAadhaar(data.aadhaarNumber)) {
    errors.push('Aadhaar number must be exactly 12 digits');
  }
  
  if (data.panNumber && !validatePAN(data.panNumber)) {
    errors.push('Invalid PAN format (e.g., ABCDE1234F)');
  }
  
  if (data.postalCode && !validatePostalCode(data.postalCode)) {
    errors.push('Postal code must be exactly 6 digits');
  }
  
  if (data.ifscCode && !validateIFSC(data.ifscCode)) {
    errors.push('Invalid IFSC code format');
  }
  
  if (data.accountNumber && !validateAccountNumber(data.accountNumber)) {
    errors.push('Account number must be 9-18 digits');
  }
  
  return errors;
};

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const result = await query(`
      SELECT 
        u.id, u.name, u.email, u.phone, u.role, u.created_at, u.company_id,
        p.display_name, p.alternate_phone, p.aadhaar_number, p.gender, 
        p.pan_number, p.date_of_birth, p.address_line, p.state, 
        p.city, p.postal_code, p.account_name, p.bank_name, 
        p.branch, p.account_number, p.ifsc_code
      FROM users u 
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [userId]);

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result[0];
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.created_at,
        profile: {
          displayName: user.display_name,
          alternatePhone: user.alternate_phone,
          aadhaarNumber: user.aadhaar_number,
          gender: user.gender,
          panNumber: user.pan_number,
          dateOfBirth: user.date_of_birth,
          addressLine: user.address_line,
          state: user.state,
          city: user.city,
          postalCode: user.postal_code,
          accountName: user.account_name,
          bankName: user.bank_name,
          branch: user.branch,
          accountNumber: user.account_number,
          ifscCode: user.ifsc_code
        }
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const companyId = session.company.id;

    const body = await request.json();
    const {
      name, phone, displayName, alternatePhone, aadhaarNumber, gender,
      panNumber, dateOfBirth, addressLine, state, city, postalCode,
      accountName, bankName, branch, accountNumber, ifscCode
    } = body;

    // Server-side validation
    const validationErrors = validateFormData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }

    // Handle empty date
    const formattedDateOfBirth = dateOfBirth && dateOfBirth.trim() !== '' ? dateOfBirth : null;

    // Start transaction
    await query('BEGIN');
    
    try {
      // Update user table
      await query(`
        UPDATE users 
        SET name = $1, phone = $2, updated_at = NOW() 
        WHERE id = $3
      `, [name.trim(), phone.trim(), userId]);

      // Check if profile exists
      const profileExists = await query(`
        SELECT id FROM user_profiles WHERE user_id = $1
      `, [userId]);

      if (profileExists.length > 0) {
        // Update existing profile
        await query(`
          UPDATE user_profiles SET
            display_name = $1, alternate_phone = $2, aadhaar_number = $3, gender = $4,
            pan_number = $5, date_of_birth = $6, address_line = $7, state = $8,
            city = $9, postal_code = $10, account_name = $11, bank_name = $12,
            branch = $13, account_number = $14, ifsc_code = $15, updated_at = NOW()
          WHERE user_id = $16
        `, [
          displayName?.trim() || null,
          alternatePhone?.trim() || null,
          aadhaarNumber?.trim() || null,
          gender || null,
          panNumber?.trim()?.toUpperCase() || null,
          formattedDateOfBirth,
          addressLine?.trim() || null,
          state?.trim() || null,
          city?.trim() || null,
          postalCode?.trim() || null,
          accountName?.trim() || null,
          bankName?.trim() || null,
          branch?.trim() || null,
          accountNumber?.trim() || null,
          ifscCode?.trim()?.toUpperCase() || null,
          userId
        ]);
      } else {
        // Create new profile
        await query(`
          INSERT INTO user_profiles (
            user_id, company_id, display_name, alternate_phone, aadhaar_number, gender,
            pan_number, date_of_birth, address_line, state, city, postal_code,
            account_name, bank_name, branch, account_number, ifsc_code, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
        `, [
          userId,
          companyId,
          displayName?.trim() || null,
          alternatePhone?.trim() || null,
          aadhaarNumber?.trim() || null,
          gender || null,
          panNumber?.trim()?.toUpperCase() || null,
          formattedDateOfBirth,
          addressLine?.trim() || null,
          state?.trim() || null,
          city?.trim() || null,
          postalCode?.trim() || null,
          accountName?.trim() || null,
          bankName?.trim() || null,
          branch?.trim() || null,
          accountNumber?.trim() || null,
          ifscCode?.trim()?.toUpperCase() || null
        ]);
      }
      
      // Commit transaction
      await query('COMMIT');
      
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully'
      });
    } catch (transactionError) {
      // Rollback transaction on error
      await query('ROLLBACK');
      throw transactionError;
    }
  } catch (error: any) {
    console.error('Profile update error:', error);
    
    // Handle database constraint violations
    if (error?.code === '23514') { // Check constraint violation
      return NextResponse.json({ 
        error: 'Data validation failed', 
        details: ['Invalid data format detected'] 
      }, { status: 400 });
    }
    
    if (error?.code === '23505') { // Unique constraint violation
      return NextResponse.json({ 
        error: 'Duplicate data', 
        details: ['Record already exists'] 
      }, { status: 409 });
    }
    
    if (error?.code === '23503') { // Foreign key violation
      return NextResponse.json({ 
        error: 'Invalid reference', 
        details: ['Referenced record not found'] 
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}