import express from 'express'
import pool from '../db.js'
import authenticate from '../middlewares/authenticate.js'

const router = express.Router()

// GET /api/recommendations
router.get('/', async(req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM recommendations ORDER BY id DESC')
        res.json(rows)
    } catch (error) {
        next(error)
    }
})

// POST // api/recommendations
router.post('/', authenticate, async(req, res, next) => {
    try {
        const { recommendation, recommended_by, job_title, company_name } = req.body

        if (!recommendation || !recommended_by || !job_title || !company_name) {
            return res.status(400).json({ error: 'recommendation, recommended_by, job_title, and company_name are required'})
        }

        const [result] = await pool.query(
            `INSERT INTO recommendations
            (recommendation, recommended_by, job_title, company_name)
            VALUES (?,?,?,?)`,
            [recommendation, recommended_by, job_title, company_name]
        )

        const [rows] = await pool.query(`SELECT * FROM recommendations WHERE id = ?`,[result.insertId])
        res.status(201).json(rows[0])
    } catch (error) {
        next(error)
    }
})

// PUT /api/recommendations/:id
router.put('/:id', authenticate, async(req, res, next) => {
    try {
        const { id } = req.params
        const { recommendation, recommended_by, job_title, company_name } = req.body

        const [existing] = await pool.query('SELECT * FROM recommendations WHERE id = ?', [id])

        if(!existing.length) return res.status(404).json({ error: 'Recommendation not found' })

        const current = existing[0]

        await pool.query(
            `UPDATE recommendations SET
                recommendation = ?,
                recommended_by = ?,
                job_title = ?,
                company_name = ?
            WHERE id = ?`,
            [
                recommendation || current.recommendation,
                recommended_by || current.recommended_by,
                job_title || current.job_title,
                company_name || current.company_name,
                id
            ]
        )

        const [rows] = await pool.query('SELECT * FROM recommendations WHERE id = ?', [id])
        res.json(rows[0])
    } catch (error) {
        next(error)
    }
})

// DELETE /api/recommendations/:id
router.delete('/:id', authenticate, async(req, res, next) => {
    try {
        const { id } = req.params
    
        const [existing] = await pool.query('SELECT * FROM recommendations WHERE id = ?', [id])
        if (!existing.length) return res.status(404).json({ error: 'Recommendation not found' })

        await pool.query('DELETE FROM recommendations WHERE id = ?', [id])
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default router