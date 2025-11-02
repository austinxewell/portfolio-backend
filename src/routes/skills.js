import express from 'express'
const router = express.Router()
import pool from '../db.js'

// GET /api/skills
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM skills ORDER BY id')
        res.json(rows)
    } catch (error) {
        next(error)
    }
})

export default router