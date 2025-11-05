import jwt from 'jsonwebtoken'

export default function authenticate(req, res, next) {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
    const token = auth.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = { id: payload.userId }
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
}