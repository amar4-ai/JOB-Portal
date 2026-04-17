import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from '@sentry/node'
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoute from './routes/companyRoute.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoute from './routes/jobRoute.js'
import userRoute from './routes/userRoute.js'
import { clerkMiddleware } from '@clerk/express'

const app = express()

await connectDB()
await connectCloudinary()

app.use(cors())


// Webhook FIRST (raw body)
app.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
)

// JSON parser SECOND
app.use(express.json())


//Clerk middleraware
app.use(clerkMiddleware())

// Routes AFTER JSON parser
app.use('/api/company', companyRoute)
app.use('/api/jobs', jobRoute)
app.use('/api/users', userRoute)

// Test routes
app.get('/', (req, res) => res.send("API Working"))

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
})

Sentry.setupExpressErrorHandler(app)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app