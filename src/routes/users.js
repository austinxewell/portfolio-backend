import express from 'express'
import pool from '../db.js'
import authenticate from '../middlewares/authenticate.js'
import { hashPassword } from '../auth.js'

const router = express.Router()

// GET /api/users
router.get('/', authenticate, async(req, res, next) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM users ORDER BY id`)
        res.json(rows)
    } catch (error) {
        next(error)
    }
})

// PUT /api/users/:id
router.put('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params
        const { email, password, display_name } = req.body

        const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
        if (!existing.length) return res.status(404).json({ error: 'User not found' })

        const current = existing[0]

        if (email && email !== current.email) {
            const [duplicate] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id])
            if (duplicate.length) return res.status(409).json({ error: 'Email already registered' })
        }

        const password_hash = password ? await hashPassword(password) : current.password_hash

        await pool.query(
            `UPDATE users SET
                email = ?,
                display_name = ?,
                password_hash = ?
            WHERE id = ?`,
            [
                email || current.email,
                display_name ?? current.display_name,
                password_hash,
                id
            ]
        )

        const [rows] = await pool.query('SELECT id, email, display_name, created_at FROM users WHERE id = ?', [id])
        res.json(rows[0])
    } catch (err) {
        next(err)
    }
})

// DELETE /api/users/:id
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params

        const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
        if (!existing.length) return res.status(404).json({ error: 'User not found' })

        await pool.query('DELETE FROM users WHERE id = ?', [id])
        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

export default router