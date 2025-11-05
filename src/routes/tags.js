import express from 'express'
import pool from '../db.js'

const router = express.Router()

// GET /api/tags
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tech_tags ORDER BY id')
        res.json(rows)
    } catch (err) {
        next(err)
    }
})

// POST /api/tags
router.post('/', async (req, res, next) => {
    try {
        const { tag_name } = req.body
    
        if (!tag_name) return res.status(400).json({ error: 'Tag Name is required'})
    
        const [result] = await pool.query(
            `INSERT INTO tech_tags
                (tag_name)
            VALUES(?)`, [tag_name]
        )
        
        const [rows] = await pool.query('SELECT * FROM tech_tags WHERE id = ?', [result.insertId])
        res.status(201).json(rows[0])
    } catch (err) {
        next(err)
    }
})

// DELETE /api/tags/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params

        const [existing] = await pool.query('SELECT * FROM tech_tags WHERE id = ?', [id])
        if (!existing.length) return res.status(404).json({ error: 'Tag not found' })

        await pool.query('DELETE FROM tech_tags WHERE id = ?', [id])
        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

export default router