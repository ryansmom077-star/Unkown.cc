import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import { body, validationResult } from 'express-validator'

// Rate limiting configurations
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
})

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: false
})

export const generalRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per window
  message: 'Too many requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false
})

export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per window
  message: 'API rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false
})

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
})

// Input sanitization middleware
export const sanitizeInput = [
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`Sanitized input: ${key} in ${req.path}`)
    }
  }),
  hpp()
]

// Validation helpers
export const validateEmail = body('email')
  .trim()
  .isEmail()
  .normalizeEmail()
  .withMessage('Invalid email format')

export const validatePassword = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
  .withMessage('Password must contain uppercase, lowercase, number and special character')

export const validateUsername = body('username')
  .trim()
  .isLength({ min: 3, max: 30 })
  .withMessage('Username must be 3-30 characters')
  .matches(/^[a-zA-Z0-9._-]+$/)
  .withMessage('Username can only contain letters, numbers, dots, underscores and hyphens')

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => err.msg)
    })
  }
  next()
}

// Login attempt tracking
const loginAttempts = new Map()
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export function checkLoginAttempts(identifier) {
  const attempts = loginAttempts.get(identifier)
  if (!attempts) return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS }
  
  const now = Date.now()
  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    const remainingTime = Math.ceil((attempts.lockedUntil - now) / 1000 / 60)
    return { 
      allowed: false, 
      remaining: 0,
      lockedUntil: attempts.lockedUntil,
      message: `Account locked. Try again in ${remainingTime} minutes`
    }
  }
  
  // Reset if lockout expired
  if (attempts.lockedUntil && now >= attempts.lockedUntil) {
    loginAttempts.delete(identifier)
    return { allowed: true, remaining: MAX_LOGIN_ATTEMPTS }
  }
  
  const remaining = MAX_LOGIN_ATTEMPTS - attempts.count
  return { allowed: remaining > 0, remaining }
}

export function recordLoginAttempt(identifier, success) {
  if (success) {
    loginAttempts.delete(identifier)
    return
  }
  
  const attempts = loginAttempts.get(identifier) || { count: 0, lockedUntil: null }
  attempts.count++
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = Date.now() + LOCKOUT_DURATION
    attempts.count = 0
  }
  
  loginAttempts.set(identifier, attempts)
}

// JWT blacklist for logout
const jwtBlacklist = new Set()

export function blacklistToken(token) {
  jwtBlacklist.add(token)
  // Clean up old tokens after 7 days
  setTimeout(() => jwtBlacklist.delete(token), 7 * 24 * 60 * 60 * 1000)
}

export function isTokenBlacklisted(token) {
  return jwtBlacklist.has(token)
}

// Request logging middleware
export function requestLogger(req, res, next) {
  const start = Date.now()
  const originalSend = res.send
  
  res.send = function(data) {
    res.send = originalSend
    const duration = Date.now() - start
    
    // Log security-relevant requests
    const shouldLog = req.method !== 'GET' || 
                     req.path.includes('admin') || 
                     req.path.includes('auth')
    
    if (shouldLog) {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userId: req.user?.id || 'anonymous'
      }))
    }
    
    return res.send(data)
  }
  
  next()
}

// File upload validation
export function validateFileUpload(allowedTypes, maxSize = 5 * 1024 * 1024) {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next()
    }
    
    const files = req.files || [req.file]
    
    for (const file of files) {
      if (!file) continue
      
      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({ 
          error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
        })
      }
      
      // Check file type
      if (allowedTypes && !allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ 
          error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
        })
      }
      
      // Check for malicious filenames
      const filename = file.originalname || file.name || ''
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return res.status(400).json({ 
          error: 'Invalid filename' 
        })
      }
    }
    
    next()
  }
}

// CORS configuration
export function corsConfig() {
  return {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || 'https://unknown.cc'
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400 // 24 hours
  }
}

// Sanitize output to prevent XSS
export function sanitizeOutput(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeOutput)
  }
  
  const sanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Basic HTML encoding
      sanitized[key] = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
    } else {
      sanitized[key] = sanitizeOutput(value)
    }
  }
  
  return sanitized
}
