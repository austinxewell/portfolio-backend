import express from 'express'
import rateLimit from 'express-rate-limit'
import pool from '../db.js'

const router = express.Router()

const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Try again in a few minutes.' },
})

async function getProjectsWithDetails() {
    const [rows] = await pool.query(`
        SELECT
            p.id AS project_id, p.*,
            i.id AS image_id, i.img_name, i.img_url, i.created_at AS image_created_at, pi.is_thumbnail,
            t.id AS tag_id, t.tag_name, pt.is_primary
        FROM projects p
        LEFT JOIN project_images pi ON pi.project_id = p.id
        LEFT JOIN images i ON i.id = pi.image_id
        LEFT JOIN project_tech_tags pt ON pt.project_id = p.id
        LEFT JOIN tech_tags t ON t.id = pt.tag_id
    `)

    const projectsMap = new Map()

    for (const row of rows) {
        if (!projectsMap.has(row.project_id)) {
            projectsMap.set(row.project_id, {
                ...row,
                image_id: undefined,
                img_name: undefined,
                img_url: undefined,
                image_created_at: undefined,
                is_thumbnail: undefined,
                tag_id: undefined,
                tag_name: undefined,
                is_primary: undefined,
                images: [],
                tags: [],
            })
        }

        const project = projectsMap.get(row.project_id)

        if (row.image_id && !project.images.some((img) => img.id === row.image_id)) {
            project.images.push({
                id: row.image_id,
                img_name: row.img_name,
                img_url: row.img_url,
                created_at: row.image_created_at,
                is_thumbnail: Boolean(row.is_thumbnail),
            })
        }

        if (row.tag_id && !project.tags.some((tag) => tag.id === row.tag_id)) {
            project.tags.push({
                id: row.tag_id,
                tag_name: row.tag_name,
                is_primary: Boolean(row.is_primary),
            })
        }
    }

    return Array.from(projectsMap.values())
}

async function buildSystemPrompt() {
    const [[aboutRows], [skills], projects, [services]] = await Promise.all([
        pool.query('SELECT * FROM about WHERE id = 1'),
        pool.query('SELECT * FROM skills'),
        getProjectsWithDetails(),
        pool.query('SELECT * FROM services'),
    ])
    const about = aboutRows[0] ?? {}

    // Strip fields the model doesn't need to answer questions accurately
    const trimmedProjects = projects.map((p) => ({
        project_name: p.project_name,
        overview: p.overview,
        description: p.description,
        live_url: p.live_url,
        github_url: p.github_url,
        tags: p.tags.map((t) => t.tag_name),
        thumbnail: p.images.find((img) => img.is_thumbnail)?.img_url ?? null,
    }))

    return `You are an AI assistant speaking as Austin Ewell's AI Model on his portfolio site, AuEwellify. Respond in first person, as if Austin himself is answering — "I built this with...", "My experience includes...". Answer questions about your work, skills, and experience using ONLY the information below.

    Respond in plain conversational text only — no markdown, no bullet points, no bold formatting, no headers. Write like you're texting someone, not listing a resume.

    When asked persuasive questions (e.g. "why should I hire you", "what makes you a good fit"), don't just list data verbatim — make an actual case. Pick 2-3 of your strongest, most relevant points and explain briefly why they matter, in a natural, confident tone. Don't try to mention everything.

    If asked something not covered here, do NOT guess or invent details. Instead, respond with something like: "Great question! Austin's AI Model hasn't been trained on this subject — you might want to ask the real Austin this one." Keep it friendly and light, but make it clear you don't have the answer.

    Respond in a friendly, conversational tone otherwise. Keep answers concise; don't pad with unnecessary preamble.

    ABOUT:
    ${JSON.stringify(about)}

    SKILLS:
    ${JSON.stringify(skills)}

    PROJECTS:
    ${JSON.stringify(trimmedProjects)}

    SERVICES:
    ${JSON.stringify(services)}
    `
}

router.post('/', chatLimiter, async (req, res) => {
    const { message } = req.body

    if (!message || typeof message !== 'string' || message.length > 1000) {
        return res.status(400).json({ error: 'Invalid message' })
    }

    try {
        const systemPrompt = await buildSystemPrompt()

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-20b',
                max_tokens: 500,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message },
                ],
            }),
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error('Groq API error:', response.status, errText)
            return res.status(502).json({ error: 'Chat service unavailable' })
        }

        const data = await response.json()
        res.json({ reply: data.choices[0].message.content })
    } catch (err) {
        console.error('Chat route error:', err)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

export default router