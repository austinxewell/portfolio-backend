// Load environment variables only in dev
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

// Express & Middleware
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

// Routers
import projectsRouter from './routes/projects.js'
import aboutRouter from './routes/about.js'
import skillsRouter from './routes/skills.js'
import collaborationRouter from './routes/collaborations.js'
import servicesRouter from './routes/services.js'
import tagsRouter from './routes/tags.js'
import imagesRouter from './routes/images.js'
import authRouter from './routes/auth.js'
import testRouter from './routes/test.js'

// Custom error handler
import errorHandler from './middlewares/errorHandler.js'

const app = express()

// --------------------
// SECURITY & MIDDLEWARE
// --------------------

// Helmet sets secure HTTP headers
app.use(helmet())

// CORS - allow frontend only
const allowedOrigins = [
    'https://auewellify.dev',
    'http://localhost:3000'
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        } else {
        console.warn(`Blocked by CORS: ${origin}`)
        callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

// Parse JSON body (limit size to avoid huge payload attacks)
app.use(express.json({ limit: '10kb' }))

// Cookie parser (needed for auth cookies)
app.use(cookieParser())

// HTTP request logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')) // verbose in dev
} else {
  app.use(morgan('combined')) // standard logs in prod
}

// --------------------
// ROUTES
// --------------------

app.get('/', (req, res) => res.send('Portfolio API running'))

app.use('/api/projects', projectsRouter)
app.use('/api/about', aboutRouter)
app.use('/api/skills', skillsRouter)
app.use('/api/collaborations', collaborationRouter)
app.use('/api/services', servicesRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/images', imagesRouter)
app.use('/api/auth', authRouter)
app.use('/api/test', testRouter)

// --------------------
// FALLBACKS & ERROR HANDLING
// --------------------

// 404 fallback
app.use((req, res) => res.status(404).json({ error: 'Not found' }))

// Centralized error handler
app.use(errorHandler)

// --------------------
// START SERVER
// --------------------

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
    console.log(
        `Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`
    )
)
