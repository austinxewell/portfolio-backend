import express from 'express'
import pool from '../db.js'

const router = express.Router()

// GET /api/services
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM services')
        res.json(rows)
    } catch (err) {
        next(err)
    }
})

export default router