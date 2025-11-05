import express from 'express'
import pool from '../db.js'
import authenticate from '../middlewares/authenticate.js'

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
router.post('/', authenticate, async (req, res, next) => {
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

// POT /api/tags/link
router.post('/link', authenticate, async (req, res, next) => {
    try {
        const { project_id, tag_id, is_primary } = req.body

        if (!project_id || !tag_id) return res.status(400).json({ error: 'project_id and tag_id are required'})

        // Validate project and tag exist
        const [proj] = await pool.query('SELECT * FROM projects WHERE id = ?', [project_id])
        if (!proj.length) return res.status(404).json({ error: 'Project not found' })

        const [tag] = await pool.query('SELECT * FROM tech_tags WHERE id = ?', [tag_id])
        if (!tag.length) return res.status(404).json({ error: 'Tag not found' })

        // Insert or Update relationship
        await pool.query(
            `INSERT INTO project_tech_tags (project_id, tag_id, is_primary)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE is_primary = VALUES(is_primary)`,
            [project_id, tag_id, is_primary ? 1 : 0]
        )

        res.status(201).json({ message: 'Tag linked to project successfully'})
    } catch (err) {
        next(err)
    }
})

// DELETE /api/tags/:id
router.delete('/:id', authenticate, async (req, res, next) => {
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