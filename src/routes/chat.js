import express from 'express'
import rateLimit from 'express-rate-limit'
import { buildSystemPrompt } from '../utils/chatContext.js'

const router = express.Router()

const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Try again in a few minutes.' },
})

router.post('/', chatLimiter, async (req, res) => {
    const { message } = req.body

    if (!message || typeof message !== 'string' || message.length > 1000) {
        return res.status(400).json({ error: 'Invalid message' })
    }

    try {
        const systemPrompt = await buildSystemPrompt(message)

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-20b',
                max_tokens: 300,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message },
                ],
            }),
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error('Groq API error:', response.status, errText)

            let errBody
            try {
                errBody = JSON.parse(errText)
            } catch {
                errBody = null
            }

            if (errBody?.error?.code === 'rate_limit_exceeded') {
                const retryAfter = response.headers.get('retry-after')
                const waitText = retryAfter
                    ? `about ${Math.ceil(Number(retryAfter) / 60)} minute(s)`
                    : 'a minute or two'

                return res.status(429).json({
                    error: `I'm running on a free-tier AI plan with limited usage per minute, and we've hit that limit. Try again in ${waitText}!`
                })
            }

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