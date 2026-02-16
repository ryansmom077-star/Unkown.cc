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

// SQL Injection prevention (for future use if switching from lowdb)
export function preventSQLInjection(input) {
  if (typeof input !== 'string') return input
  
  // Remove common SQL injection patterns
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--[^\n]*)/g,
    /\/\*.*?\*\//g,
    /(\bOR\b.*?=.*?)/gi,
    /(\bAND\b.*?=.*?)/gi,
    /(;[\s]*DROP)/gi,
    /(UNION.*?SELECT)/gi
  ]
  
  let sanitized = input
  patterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })
  
  return sanitized
}

// Admin action logging for audit trail
const adminActionLog = []
export function logAdminAction(adminId, action, target, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    adminId,
    action,
    target,
    details,
    ip: details.ip || 'unknown'
  }
  
  adminActionLog.push(logEntry)
  console.log('[ADMIN ACTION]', JSON.stringify(logEntry))
  
  // Keep only last 10000 entries in memory
  if (adminActionLog.length > 10000) {
    adminActionLog.shift()
  }
  
  return logEntry
}

export function getAdminActionLogs(limit = 100) {
  return adminActionLog.slice(-limit)
}

// Detect suspicious patterns (pen testing)
export function detectSuspiciousActivity(req) {
  const suspiciousPatterns = {
    sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)|(\bOR\b.*?=.*?)|(UNION.*?SELECT)/gi,
    xss: /(<script|javascript:|onerror=|onload=|<iframe|<embed|<object)/gi,
    pathTraversal: /(\.\.[\/\\]|\.\.%2F|\.\.%5C)/gi,
    commandInjection: /(\||;|`|\$\(|\${|&&)/g,
    ldapInjection: /(\*|\(|\)|\||&)/g
  }
  
  const threats = []
  const checkString = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params
  })
  
  for (const [type, pattern] of Object.entries(suspiciousPatterns)) {
    if (pattern.test(checkString)) {
      threats.push({
        type,
        severity: type === 'sqlInjection' || type === 'commandInjection' ? 'high' : 'medium',
        detected: new Date().toISOString(),
        ip: req.ip,
        path: req.path,
        method: req.method
      })
    }
  }
  
  if (threats.length > 0) {
    console.warn('[SECURITY ALERT]', JSON.stringify({
      ip: req.ip,
      path: req.path,
      threats,
      userAgent: req.get('user-agent')
    }))
  }
  
  return threats
}

// Middleware to detect and block suspicious activity
export function securityMonitor(req, res, next) {
  const threats = detectSuspiciousActivity(req)
  
  if (threats.length > 0) {
    // Block high severity threats
    const highSeverity = threats.some(t => t.severity === 'high')
    if (highSeverity) {
      return res.status(403).json({ 
        error: 'Suspicious activity detected',
        message: 'This request has been blocked for security reasons'
      })
    }
  }
  
  next()
}

// Session security
export function validateSessionSecurity(req, res, next) {
  // Check for session hijacking indicators
  const currentUA = req.get('user-agent')
  const currentIP = req.ip
  
  if (req.user) {
    // Store user agent and IP on first auth
    if (!req.user.lastUA) {
      req.user.lastUA = currentUA
      req.user.lastIP = currentIP
    } else {
      // Detect suspicious session changes
      if (req.user.lastUA !== currentUA || req.user.lastIP !== currentIP) {
        console.warn('[SESSION SECURITY]', JSON.stringify({
          userId: req.user.id,
          message: 'Session parameters changed',
          oldUA: req.user.lastUA,
          newUA: currentUA,
          oldIP: req.user.lastIP,
          newIP: currentIP
        }))
      }
    }
  }
  
  next()
}

// CSRF protection token generation
export function generateCSRFToken() {
  return require('crypto').randomBytes(32).toString('hex')
}

// Validate CSRF token
export function validateCSRFToken(req, res, next) {
  // Skip for GET requests
  if (req.method === 'GET') return next()
  
  const token = req.headers['x-csrf-token'] || req.body.csrfToken
  const sessionToken = req.session?.csrfToken
  
  if (!token || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' })
  }
  
  next()
}
