import express from 'express'
const router = express.Router()
import pool from '../db.js'

// GET /api/projects
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC')
        // parse JSON tech_stack
        const projects = rows.map(r => ({ ...r, tech_stack: JSON.parse(r.tech_stack) }))
        res.json(projects)
    } catch (err) {
        next(err)
    }
})

// GET /api/projects/:id
router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id])
        if (rows.length === 0) return res.status(404).json({ error: 'Not found'})
        const project = rows[0]
        project.tech_stack = JSON.parse(project.tech_stack)
        res.json(project)
    } catch (error) {
        next(error)
    }
})

export default router