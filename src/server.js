import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'

import projectsRouter from './routes/projects.js'
import aboutRouter from './routes/about.js'
import skillsRouter from './routes/skills.js'
import collaborationRouter from './routes/collaborations.js'
import servicesRouter from './routes/services.js'
import tagsRouter from './routes/tags.js'

import errorHandler from './middlewares/errorHandler.js'

dotenv.config()
const app = express()

app.use(helmet())
app.use(cors({ origin: true })) // change origin in prod to my domain
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.send('Portfolio API running'))

app.use('/api/projects', projectsRouter)
app.use('/api/about', aboutRouter)
app.use('/api/skills', skillsRouter)
app.use('/api/collaborations', collaborationRouter)
app.use('/api/services', servicesRouter)
app.use('/api/tags', tagsRouter)

// fallback
app.use((req, res) => res.status(404).json({ error: 'Not found' }))
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))