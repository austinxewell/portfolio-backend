import express from 'express'
import pool from '../db.js'
import { getAllProjectsQuery, getAllFavoriteProjectsQuery, getProjectBySlugQuery } from '../queries/projects.js'

const router = express.Router()

// GET /api/projects
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query(getAllProjectsQuery)

        // Parse JSON fields
        const projects = rows.map(p => ({
            ...p,
            images: p.images || [],
            tech_tags: p.tech_tags || []
        }))

        res.json(projects)
    } catch (err) {
        next(err)
    }
})

// GET /api/projects
router.get('/favorites', async (req, res, next) => {
    try {
        const [rows] = await pool.query(getAllFavoriteProjectsQuery)

        // Parse JSON fields
        const projects = rows.map(p => ({
            ...p,
            images: p.images || [],
            tech_tags: p.tech_tags || []
        }))

        res.json(projects)
    } catch (err) {
        next(err)
    }
})

// GET /api/projects/:slug
router.get('/:slug', async (req, res, next) => {
    try {
        const [rows] = await pool.query(getProjectBySlugQuery, [req.params.slug])

        if (!rows.length) return res.status(404).json({ error: 'Not found' })

        const project = rows[0]

        project.images = project.images || []
        project.tech_tags = project.tech_tags || []

        res.json(project)
    } catch (err) {
        next(err)
    }
})

export default router
