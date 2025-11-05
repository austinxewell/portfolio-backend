import express from 'express'
import pool from '../db.js'

const router = express.Router()

// GET /api/images
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM images ORDER BY id')
        res.json(rows)
    } catch (err) {
        next(err)
    }
})

// GET /api/images/project/:id
router.get('/project/:id', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM project_images WHERE project_id = ?', [req.params.id])
        if (!rows.length) return res.status(404).json({ error: 'Not found' })

        res.json(rows)
    } catch (err) {
        next(err)
    }
})

// POST /api/images
router.post('/', async (req, res, next) => {
    try {
        const { img_name, img_url } = req.body

        if (!img_name || ! img_url) return res.status(400).json({ error: 'Image Name and Image URL are required'})

        const [result] = await pool.query(
            `INSERT INTO images
                (img_name, img_url)
            VALUES(?,?)`, [img_name, img_url]
        )

        const [rows] = await pool.query('SELECT * FROM images WHERE id = ?', [result.insertId])
        res.status(201).json(rows[0])
    } catch (err) {
        next(err)
    }
})

// POST /api/images/link
router.post('/link', async (req, res, next) => {
    try {
        const { project_id, image_id, is_thumbnail } = req.body

        if (!project_id || !image_id) {
            return res.status(400).json({ error: 'project_id and image_id are required' })
        }

        // Optional: validate project and image exist
        const [proj] = await pool.query('SELECT * FROM projects WHERE id = ?', [project_id])
        if (!proj.length) return res.status(404).json({ error: 'Project not found' })

        const [img] = await pool.query('SELECT * FROM images WHERE id = ?', [image_id])
        if (!img.length) return res.status(404).json({ error: 'Image not found' })

        // Insert or update relationship
        await pool.query(
            `INSERT INTO project_images (project_id, image_id, is_thumbnail)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE is_thumbnail = VALUES(is_thumbnail)`,
            [project_id, image_id, is_thumbnail ? 1 : 0]
        )

        res.status(201).json({ message: 'Image linked to project successfully' })
    } catch (err) {
        next(err)
    }
})

// DELETE /api/images/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params

        const [existing] = await pool.query('SELECT * FROM images WHERE id = ?', [id])
        if (!existing.length) return res.status(404).json({ error: 'Not found' })
        
        await pool.query('DELETE FROM images WHERE id = ?', [id])
        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

export default router