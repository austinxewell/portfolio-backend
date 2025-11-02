import express from 'express'
const router = express.Router()
import pool from '../db.js'

// GET /api/about
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM about WHERE id = 1')
        if (rows.length === 0) return res.status(404).json({ error: 'No about data' })
        res.json(rows[0])
    } catch (err) {
        next(err)
    }
})

export default router