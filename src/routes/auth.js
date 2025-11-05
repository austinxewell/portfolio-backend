import express from 'express'
import pool from '../db.js'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import jwt from 'jsonwebtoken'
import authenticate from '../middlewares/authenticate.js'
import {
  hashPassword, verifyPassword,
  signAccessToken, signRefreshToken,
  storeRefreshToken, removeRefreshToken,
  findRefreshToken
} from '../auth.js'

const router = express.Router()

// RATE LIMIT for login & register
const loginLimiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 1 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// --------------------
// REGISTER
// --------------------
router.post('/register', loginLimiter, async (req, res, next) => {
  try {
    const { email, password, display_name } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (exists.length) return res.status(409).json({ error: 'Email already registered' })

    const password_hash = await hashPassword(password)
    const [result] = await pool.query(
      'INSERT INTO users (email, display_name, password_hash) VALUES (?, ?, ?)',
      [email, display_name || null, password_hash]
    )

    const [rows] = await pool.query('SELECT id, email, display_name, created_at FROM users WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
})

// --------------------
// LOGIN
// --------------------
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' })

    const user = rows[0]
    const isMatch = await verifyPassword(password, user.password_hash)
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })

    const accessToken = signAccessToken({ userId: user.id })
    const refreshToken = signRefreshToken({ userId: user.id })

    // Store hashed refresh token in DB
    await storeRefreshToken(user.id, refreshToken, new Date(Date.now() + (process.env.REFRESH_TOKEN_EXPIRY_DAYS || 30) * 24 * 60 * 60 * 1000))

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    }
    res.cookie('token', accessToken, cookieOptions)
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: (process.env.REFRESH_TOKEN_EXPIRY_DAYS || 30) * 24 * 60 * 60 * 1000 })

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, display_name: user.display_name },
      accessToken,
    })
  } catch (err) {
    next(err)
  }
})

// --------------------
// REFRESH TOKEN
// --------------------
router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) return res.status(401).json({ error: 'No refresh token' })

    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    const userId = payload.userId
    const found = await findRefreshToken(userId, token)
    if (!found) return res.status(401).json({ error: 'Refresh token not recognized' })

    const accessToken = signAccessToken({ userId })
    res.json({ accessToken })
  } catch (err) {
    next(err)
  }
})

// --------------------
// LOGOUT
// --------------------
router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (refreshToken) {
      let payload
      try { payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) } catch { }
      if (payload?.userId) await removeRefreshToken(payload.userId, refreshToken)
    }

    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })

    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' })
  }
})

// --------------------
// GET CURRENT USER
// --------------------
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id
    const [rows] = await pool.query('SELECT id, email, display_name, created_at FROM users WHERE id = ?', [userId])
    if (!rows.length) return res.status(404).json({ error: 'Not found' })

    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

export default router
