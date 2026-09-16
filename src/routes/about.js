import express from 'express'
const router = express.Router()
import pool from '../db.js'
import authenticate from '../middlewares/authenticate.js'

// GET /api/about
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM about WHERE id = 1')
        if (rows.length === 0) return res.status(404).json({ error: 'No about data' })
        res.json(rows[0])
    } catch (err) {
        next(err)
    }
})

// PUT /api/about
router.put('/', authenticate, async (req, res, next) => {
    try {
        const { name, title, specialty, contact_email, linkedin_url, github_url, resume_url, blog_url } = req.body

        const [existing] = await pool.query('SELECT * FROM about WHERE id = 1')
        if (!existing.length) return res.status(404).json({ error: 'About not found' })

        const current = existing[0]

        await pool.query(
            `UPDATE about SET
                name = ?,
                title = ?,
                specialty = ?,
                contact_email = ?,
                linkedin_url = ?,
                github_url = ?,
                resume_url = ?,
                blog_url = ?,
                updated_at = NOW()
            WHERE id = 1`,
            [
                name ?? current.name,
                title ?? current.title,
                specialty ?? current.specialty,
                contact_email ?? current.contact_email,
                linkedin_url ?? current.linkedin_url,
                github_url ?? current.github_url,
                resume_url ?? current.resume_url,
                blog_url ?? current.blog_url
            ]
        )

        const [rows] = await pool.query('SELECT * FROM about WHERE id = 1')
        res.json(rows[0])
    } catch (err) {
        next(err)
    }
})

export default router