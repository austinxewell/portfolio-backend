import express from 'express'
import pool from '../db.js'
import authenticate from '../middlewares/authenticate.js'

const router = express.Router()

// GET /api/collaborations
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM collaborations')
        res.json(rows)
    } catch (err) {
        next(err)
    }
})

// POST /api/collaborations
router.post('/', authenticate, async(req, res, next) => {
    try {
        const { company_name } = req.body

        if (!company_name) return res.status(400).json({ error: 'company_name is required' })
        
        const [result] = await pool.query(
            `INSERT INTO collaborations
            (company_name)
            VALUES (?)`,
            [company_name]
        )

        const [rows] = await pool.query(`SELECT * FROM collaborations WHERE id = ?`, [result.insertId])
        res.status(201).json(rows[0])
    } catch (error) {
        next(error)
    }
})

// PUT /api/collaborations/:id
router.put('/:id', authenticate, async(req, res, next) => {
    try {
        const { id } = req.params
        const { company_name } = req.body

        const [existing] = await pool.query(`SELECT * FROM collaborations WHERE id = ?`, [id])
        if(!existing.length) return res.status(404).json({ error: 'Collaboration not found' })

        const current = existing[0]

        await pool.query(
            `UPDATE collaborations SET
            company_name = ?
            WHERE id = ?`,
            [
                company_name || current.company_name,
                id
            ]
        )

        const [rows] = await pool.query(`SELECT * FROM collaborations WHERE id = ?`, [id])

        res.json(rows[0])
    } catch (error) {
        next(error)
    }
})

// DELETE /api/collaborations/:id
router.delete('/:id', authenticate, async(req, res, next) => {
    try {
        const { id } = req.params
        const [existing] = await pool.query(`SELECT * FROM collaborations WHERE id = ?`, [id])
        if(!existing.length) return res.status(404).json({ error: 'Collaboration not found'})

        await pool.query(`DELETE FROM collaborations WHERE id = ?`, [id])
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})
export default router