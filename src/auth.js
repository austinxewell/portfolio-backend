import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import pool from './db.js' // your mysql2 pool

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRY || '15m'
const REFRESH_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || process.env.REFRESH_TOKEN_EXPIRY_DAYS || '30', 10) || 30

export function hashPassword(plain) {
    const saltRounds = 10
    return bcrypt.hash(plain, saltRounds)
}

export function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash)
}

export function signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES })
}

export function signRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: `${REFRESH_DAYS}d` })
}

export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}

// Hash refresh token before storing in DB (so DB compromise doesn't leak tokens)
export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex')
}

// helper to store refresh token in DB
export async function storeRefreshToken(userId, token, expiresAt) {
    const tokenHash = hashToken(token)
    await pool.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)`,
        [userId, tokenHash, expiresAt]
    )
}

// remove refresh token (logout)
export async function removeRefreshToken(userId, token) {
    const tokenHash = hashToken(token)
    await pool.query(`DELETE FROM refresh_tokens WHERE user_id = ? AND token_hash = ?`, [userId, tokenHash])
}

// optional - revoke all refresh tokens for a user
export async function removeAllRefreshTokens(userId) {
    await pool.query(`DELETE FROM refresh_tokens WHERE user_id = ?`, [userId])
}

// check token exists and not expired
export async function findRefreshToken(userId, token) {
    const tokenHash = hashToken(token)
    const [rows] = await pool.query(
        `SELECT * FROM refresh_tokens WHERE user_id = ? AND token_hash = ? AND expires_at > NOW()`,
        [userId, tokenHash]
    )
    return rows.length ? rows[0] : null
}
