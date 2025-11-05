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

// GET /api/projects/favorites
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

// GET /api/projects/slug/:slug
router.get('/slug/:slug', async (req, res, next) => {
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

// GET /api/projects/:id
router.get('/:id', async (req, res, next) => {
    const [rows] = await pool.query(`SELECT * FROM projects WHERE id = ?`, [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    const project = rows[0]
    project.images = project.images || []
    project.tech_tags = project.tech_tags || []
    res.json(project)
})

// POST /api/projects
router.post('/', async (req, res, next) => {
    try {
        const { project_name, slug, overview, description, live_url, github_url, is_favorite } = req.body

        if (!project_name || !slug) {
            return res.status(400).json({ error: 'Project name and slug are required' })
        }

        const [result] = await pool.query(
            `INSERT INTO projects 
                (project_name, slug, overview, description, live_url, github_url, is_favorite)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [project_name, slug, overview || null, description || null, live_url || null, github_url || null, is_favorite || false]
        )

        const [rows] = await pool.query(`SELECT * FROM projects WHERE id = ?`, [result.insertId])
        res.status(201).json(rows[0])
    } catch (err) {
        next(err)
    }
})

// PUT /api/projects/:id - Update an existing project
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const { project_name, slug, overview, description, live_url, github_url, is_favorite } = req.body

        const [existing] = await pool.query(`SELECT * FROM projects WHERE id = ?`, [id])
        if (!existing.length) return res.status(404).json({ error: 'Project not found' })

        const current = existing[0]

        await pool.query(
            `UPDATE projects SET 
                project_name = ?, 
                slug = ?, 
                overview = ?, 
                description = ?, 
                live_url = ?, 
                github_url = ?, 
                is_favorite = ?, 
                updated_at = NOW()
            WHERE id = ?`,
            [
                project_name || current.project_name,
                slug || current.slug,
                overview || current.overview,
                description || current.description,
                live_url || current.live_url,
                github_url || current.github_url,
                typeof is_favorite === 'boolean' ? is_favorite : current.is_favorite,
                id
            ]
        )

        const [rows] = await pool.query(`SELECT * FROM projects WHERE id = ?`, [id])
        res.json(rows[0])
    } catch (err) {
        next(err)
    }
})

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params

        const [existing] = await pool.query(`SELECT * FROM projects WHERE id = ?`, [id])
        if (!existing.length) return res.status(404).json({ error: 'Project not found' })

        await pool.query(`DELETE FROM projects WHERE id = ?`, [id])
        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

export default router
