import express from 'express'
import pool from '../db.js'
import authenticate from '../middlewares/authenticate.js'

const router = express.Router()

// GET /api/skills
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM skills ORDER BY id')
        res.json(rows)
    } catch (error) {
        next(error)
    }
})

// POST /api/skills
router.post('/', authenticate, async(req, res, next) =>{
    try {
        const { name, level, category, icon } = req.body

        if (!name || !level || !category || !icon) {
            return res.status(400).json({ error: 'name, level, category, and icon are required' })
        }

        const [result] = await pool.query(
            `INSERT INTO skills
            (name, level, category, icon)
            VALUES (?,?,?,?)`,
            [name, level, category, icon]
        )

        const [rows] = await pool.query(`SELECT * FROM skills WHERE id = ?`, [result.insertId])
        res.status(201).json(rows[0])
    } catch (error) {
        next(error)
    }
})

// PUT /api/skills/:id
router.put('/:id', authenticate, async(req, res, next) => {
    try {
        const { id } = req.params
        const { name, level, category, icon } = req.body

        const [existing] = await pool.query(`SELECT * FROM skills WHERE id = ?`, [id])
        if(!existing.length) return res.status(404).json({ error: 'Skill not found' })

        const current = existing[0]

        await pool.query(
            `UPDATE skills SET
                name = ?,
                level = ?,
                category = ?,
                icon = ?
            WHERE id = ?`,
            [
                name || current.name,
                level || current.level,
                category || current.category,
                icon || current.icon,
                id
            ]
        )

        const [rows] = await pool.query(`SELECT * FROM skills WHERE id = ?`, [id])
        res.json(rows[0])
    } catch (error) {
        next(error)
    }
})

// DELETE /api/skills/:id
router.delete('/:id', authenticate, async(req, res, next) => {
    try {
        const { id } = req.params

        const [existing] = await pool.query(`SELECT * FROM skills WHERE id = ?`, [id])
        if(!existing.length) return res.status(404).json({error: 'Skill not found'})

        await pool.query(`DELETE FROM skills WHERE id = ?`, [id])
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default router