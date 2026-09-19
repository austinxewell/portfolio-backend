import express from 'express'
import pool from '../db.js'
import authenticate from '../middlewares/authenticate.js'

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

// POST /api/services
router.post('/', authenticate, async(req, res, next) => {
    try {
        const { service_name, description, icon } = req.body

        if (!service_name || !description || !icon) {
            return res.status(400).json({ error: 'service_name, description, and icon are required' })
        }

        const [result] = await pool.query(
            `INSERT INTO services
            (service_name, description, icon)
            VALUES(?,?,?)`,
            [service_name, description, icon]
        )

        const [rows] = await pool.query(`SELECT * FROM services WHERE id = ?`, [result.insertId])
        res.status(201).json(rows[0])
    } catch (error) {
        next(error)
    }
})

// PUT /api/services/:id
router.put('/:id', authenticate, async(req, res, next) => {
    try {
        const { id } = req.params
        const { service_name, description, icon } = req.body

        const [existing] = await pool.query(`SELECT * FROM services WHERE id = ?`, [id])
        if (!existing.length) return res.status(404).json({ error: 'Service not found' })

        const current = existing[0]

        await pool.query(
            `UPDATE services SET
                service_name = ?,
                description = ?,
                icon = ?
            WHERE id = ?`,
            [
                service_name || current.service_name,
                description || current.description,
                icon || current.icon,
                id
            ]
        )

        const [rows] = await pool.query(`SELECT * FROM services WHERE id = ?`, [id])
        res.json(rows[0])
    } catch (error) {
        next(error)
    }
})

// DELETE /api/services/:id
router.delete('/:id', authenticate, async(req, res, next) => {
    const { id } = req.params

    const [existing] = await pool.query('SELECT * FROM services WHERE id = ?', [id])
    if (!existing.length) return res.status(404).json({ error: 'Service not found' })

    await pool.query(`DELETE FROM services WHERE id = ?`, [id])
    res.status(204).send()
})

export default router