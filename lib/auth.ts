// import bcrypt from 'bcryptjs';
// import { SignJWT, jwtVerify } from 'jose';
// import { cookies } from 'next/headers';
// import pool from './db';

// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

// // Password hashing
// export async function hashPassword(password: string): Promise<string> {
//   return bcrypt.hash(password, 12);
// }

// // Password verification
// export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
//   return bcrypt.compare(password, hashedPassword);
// }

// // Create session and set cookie
// export async function createSession(userId: number) {
//   const token = await new SignJWT({ userId })
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('7d')
//     .sign(JWT_SECRET);

//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

//   // Store session in database
//   await pool.query(
//     'INSERT INTO sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)',
//     [userId, token, expiresAt]
//   );

//   // Set HTTP-only cookie
//   const cookieStore = await cookies();
//   cookieStore.set('session', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     expires: expiresAt,
//     path: '/',
//   });

//   return token;
// }

// // Get current session
// export async function getSession() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('session')?.value;

//   if (!token) {
//     return null;
//   }

//   try {
//     // Verify JWT token
//     const { payload } = await jwtVerify(token, JWT_SECRET);
    
//     // Get session and user data from database
//     const result = await pool.query(
//       `SELECT 
//         s.id as session_id,
//         s.expires_at,
//         u.id,
//         u.email,
//         u.name,
//         u.role,
//         u.is_verified,
//         u.created_at
//        FROM sessions s 
//        JOIN users u ON s.user_id = u.id 
//        WHERE s.session_token = $1 AND s.expires_at > NOW()`,
//       [token]
//     );

//     if (result.rows.length === 0) {
//       return null;
//     }

//     const sessionData = result.rows[0];

//     return {
//       user: {
//         id: sessionData.id,
//         email: sessionData.email,
//         name: sessionData.name,
//         role: sessionData.role,
//         isVerified: sessionData.is_verified,
//         createdAt: sessionData.created_at,
//       },
//       sessionId: sessionData.session_id,
//       expiresAt: sessionData.expires_at,
//     };
//   } catch (error) {
//     console.error('Session verification error:', error);
//     return null;
//   }
// }

// // Delete session (logout)
// export async function deleteSession() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('session')?.value;

//   if (token) {
//     try {
//       // Delete session from database
//       await pool.query('DELETE FROM sessions WHERE session_token = $1', [token]);
//     } catch (error) {
//       console.error('Error deleting session:', error);
//     }
//   }

//   // Delete cookie
//   cookieStore.delete('session');
// }

// // Delete all sessions for a user (useful for password reset)
// export async function deleteAllUserSessions(userId: number) {
//   try {
//     await pool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
//   } catch (error) {
//     console.error('Error deleting user sessions:', error);
//   }
// }

// // Generate 6-digit OTP
// export function generateOTP(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Create verification token (for email verification or password reset)
// export async function createVerificationToken(
//   userId: number,
//   type: 'email_verification' | 'password_reset'
// ): Promise<string> {
//   const otp = generateOTP();
//   const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//   // Delete any existing tokens of this type for this user
//   await pool.query(
//     'DELETE FROM verification_tokens WHERE user_id = $1 AND type = $2',
//     [userId, type]
//   );

//   // Insert new token
//   await pool.query(
//     'INSERT INTO verification_tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, $4)',
//     [userId, otp, type, expiresAt]
//   );

//   return otp;
// }

// // Verify OTP token
// export async function verifyToken(
//   userId: number,
//   token: string,
//   type: 'email_verification' | 'password_reset'
// ): Promise<boolean> {
//   try {
//     const result = await pool.query(
//       `SELECT * FROM verification_tokens 
//        WHERE user_id = $1 AND token = $2 AND type = $3 AND expires_at > NOW()`,
//       [userId, token, type]
//     );

//     return result.rows.length > 0;
//   } catch (error) {
//     console.error('Token verification error:', error);
//     return false;
//   }
// }

// // Delete verification token after use
// export async function deleteVerificationToken(
//   userId: number,
//   type: 'email_verification' | 'password_reset'
// ) {
//   try {
//     await pool.query(
//       'DELETE FROM verification_tokens WHERE user_id = $1 AND type = $2',
//       [userId, type]
//     );
//   } catch (error) {
//     console.error('Error deleting verification token:', error);
//   }
// }

// // Get user by email
// export async function getUserByEmail(email: string) {
//   try {
//     const result = await pool.query(
//       'SELECT id, email, name, role, is_verified, created_at FROM users WHERE email = $1',
//       [email]
//     );

//     if (result.rows.length === 0) {
//       return null;
//     }

//     return result.rows[0];
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     return null;
//   }
// }

// // Clean up expired sessions (run this periodically)
// export async function cleanupExpiredSessions() {
//   try {
//     await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
//   } catch (error) {
//     console.error('Error cleaning up expired sessions:', error);
//   }
// }

// // Clean up expired tokens (run this periodically)
// export async function cleanupExpiredTokens() {
//   try {
//     await pool.query('DELETE FROM verification_tokens WHERE expires_at < NOW()');
//   } catch (error) {
//     console.error('Error cleaning up expired tokens:', error);
//   }
// }



import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import pool from './db';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Password verification
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create session with company context
export async function createSession(userId: number, companyId: number) {
  const token = await new SignJWT({ userId, companyId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Store session in database with company_id
  await pool.query(
    'INSERT INTO sessions (user_id, company_id, session_token, expires_at) VALUES ($1, $2, $3, $4)',
    [userId, companyId, token, expiresAt]
  );

  // Set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return token;
}

// Get current session with company data
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Get session, user, and company data from database
    const result = await pool.query(
      `SELECT 
        s.id as session_id,
        s.expires_at,
        u.id as user_id,
        u.email,
        u.name,
        u.phone,
        u.role,
        u.is_verified,
        u.is_active,
        u.last_login_at,
        u.created_at,
        c.id as company_id,
        c.company_name,
        c.company_owner_name,
        c.email as company_email,
        c.phone as company_phone,
        c.country,
        c.subscription_plan,
        c.status as company_status,
        c.subscription_start_date,
        c.subscription_end_date
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       JOIN companies c ON s.company_id = c.id
       WHERE s.session_token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const sessionData = result.rows[0];

    // Check if company is active
    if (sessionData.company_status !== 'active') {
      return null;
    }

    // Check if user is active
    if (!sessionData.is_active) {
      return null;
    }

    return {
      user: {
        id: sessionData.user_id,
        email: sessionData.email,
        name: sessionData.name,
        phone: sessionData.phone,
        role: sessionData.role,
        isVerified: sessionData.is_verified,
        isActive: sessionData.is_active,
        lastLoginAt: sessionData.last_login_at,
        createdAt: sessionData.created_at,
      },
      company: {
        id: sessionData.company_id,
        name: sessionData.company_name,
        ownerName: sessionData.company_owner_name,
        email: sessionData.company_email,
        phone: sessionData.company_phone,
        country: sessionData.country,
        subscriptionPlan: sessionData.subscription_plan,
        status: sessionData.company_status,
        subscriptionStartDate: sessionData.subscription_start_date,
        subscriptionEndDate: sessionData.subscription_end_date,
      },
      sessionId: sessionData.session_id,
      expiresAt: sessionData.expires_at,
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

// Delete session (logout)
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (token) {
    try {
      await pool.query('DELETE FROM sessions WHERE session_token = $1', [token]);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }

  cookieStore.delete('session');
}

// Delete all sessions for a user in a company
export async function deleteAllUserSessions(userId: number, companyId: number) {
  try {
    await pool.query(
      'DELETE FROM sessions WHERE user_id = $1 AND company_id = $2',
      [userId, companyId]
    );
  } catch (error) {
    console.error('Error deleting user sessions:', error);
  }
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create verification token with company context
export async function createVerificationToken(
  userId: number,
  companyId: number,
  type: 'email_verification' | 'password_reset'
): Promise<string> {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete any existing tokens of this type for this user
  await pool.query(
    'DELETE FROM verification_tokens WHERE user_id = $1 AND company_id = $2 AND type = $3',
    [userId, companyId, type]
  );

  // Insert new token
  await pool.query(
    'INSERT INTO verification_tokens (user_id, company_id, token, type, expires_at) VALUES ($1, $2, $3, $4, $5)',
    [userId, companyId, otp, type, expiresAt]
  );

  return otp;
}

// Verify OTP token with company context
export async function verifyToken(
  userId: number,
  companyId: number,
  token: string,
  type: 'email_verification' | 'password_reset'
): Promise<boolean> {
  try {
    const result = await pool.query(
      `SELECT * FROM verification_tokens 
       WHERE user_id = $1 AND company_id = $2 AND token = $3 AND type = $4 AND expires_at > NOW()`,
      [userId, companyId, token, type]
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

// Delete verification token
export async function deleteVerificationToken(
  userId: number,
  companyId: number,
  type: 'email_verification' | 'password_reset'
) {
  try {
    await pool.query(
      'DELETE FROM verification_tokens WHERE user_id = $1 AND company_id = $2 AND type = $3',
      [userId, companyId, type]
    );
  } catch (error) {
    console.error('Error deleting verification token:', error);
  }
}

// Get user by email and company
export async function getUserByEmailAndCompany(email: string, companyId: number) {
  try {
    const result = await pool.query(
      `SELECT u.*, c.company_name, c.status as company_status 
       FROM users u
       JOIN companies c ON u.company_id = c.id
       WHERE u.email = $1 AND u.company_id = $2`,
      [email.toLowerCase().trim(), companyId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Get company by ID
export async function getCompanyById(companyId: number) {
  try {
    const result = await pool.query(
      'SELECT * FROM companies WHERE id = $1',
      [companyId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

// Get company by email
export async function getCompanyByEmail(email: string) {
  try {
    const result = await pool.query(
      'SELECT * FROM companies WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

// Check if user exists in company by email
export async function checkUserExistsInCompany(email: string, companyId: number): Promise<boolean> {
  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND company_id = $2',
      [email.toLowerCase().trim(), companyId]
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
}

// Check subscription status and limits
export async function checkCompanySubscription(companyId: number) {
  try {
    const result = await pool.query(
      `SELECT 
        c.subscription_plan,
        c.status,
        c.subscription_end_date,
        COUNT(u.id) as user_count
       FROM companies c
       LEFT JOIN users u ON c.id = u.company_id AND u.is_active = true
       WHERE c.id = $1
       GROUP BY c.id`,
      [companyId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const company = result.rows[0];

    // Define user limits per plan
    const limits = {
      free: 5,
      basic: 20,
      pro: 50,
      enterprise: 999999, // unlimited
    };

    const maxUsers = limits[company.subscription_plan as keyof typeof limits] || 5;

    return {
      plan: company.subscription_plan,
      status: company.status,
      endDate: company.subscription_end_date,
      userCount: parseInt(company.user_count),
      maxUsers: maxUsers,
      canAddUser: parseInt(company.user_count) < maxUsers,
      isActive: company.status === 'active',
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return null;
  }
}

// Update last login timestamp
export async function updateLastLogin(userId: number) {
  try {
    await pool.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [userId]
    );
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}

// Clean up expired sessions
export async function cleanupExpiredSessions() {
  try {
    await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
}

// Clean up expired tokens
export async function cleanupExpiredTokens() {
  try {
    await pool.query('DELETE FROM verification_tokens WHERE expires_at < NOW()');
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}