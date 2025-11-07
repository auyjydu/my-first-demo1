import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 9527

// Directory for managed files
const MANAGED_FILES_DIR = path.join(__dirname, '_managed_files')

// Ensure the managed files directory exists
if (!fs.existsSync(MANAGED_FILES_DIR)) {
  fs.mkdirSync(MANAGED_FILES_DIR, { recursive: true })
}

// CORS configuration
// In production, replace with your actual deployed domain
const allowedOrigins = [
  'https://your-app-name.vercel.app',
  'https://your-app-name.netlify.app',
  // Add your actual deployment URL here
  // For development:
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
]

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    // Check if origin is in allowed list
    if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
      callback(null, true)
    } else {
      // For development, you might want to allow all origins
      // In production, be more strict
      console.warn(`CORS blocked origin: ${origin}`)
      callback(null, true) // Change to callback(new Error('Not allowed by CORS')) in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())

// Root endpoint - API information
app.get('/', (req, res) => {
  res.json({
    message: 'Local File Server API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      listFiles: 'GET /files',
      getFile: 'GET /files/:filename',
      createFile: 'POST /files',
      updateFile: 'PUT /files/:filename',
      deleteFile: 'DELETE /files/:filename',
    },
    note: 'This is an API server. Please use the React web application to interact with it.',
  })
})

// Helper function to get file path
function getFilePath(filename) {
  // Security: Only allow .txt files and prevent directory traversal
  if (!filename.endsWith('.txt') || filename.includes('..') || filename.includes('/')) {
    throw new Error('Invalid filename')
  }
  return path.join(MANAGED_FILES_DIR, filename)
}

// Helper function to list .txt files
function listTxtFiles() {
  try {
    const files = fs.readdirSync(MANAGED_FILES_DIR)
    return files.filter((file) => file.endsWith('.txt'))
  } catch (error) {
    console.error('Error listing files:', error)
    return []
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Get all files
app.get('/files', (req, res) => {
  try {
    const files = listTxtFiles()
    res.json(files)
  } catch (error) {
    console.error('Error getting files:', error)
    res.status(500).json({ error: 'Failed to list files' })
  }
})

// Get file content
app.get('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = getFilePath(filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    const content = fs.readFileSync(filePath, 'utf8')
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.send(content)
  } catch (error) {
    console.error('Error reading file:', error)
    if (error.message === 'Invalid filename') {
      return res.status(400).json({ error: 'Invalid filename' })
    }
    res.status(500).json({ error: 'Failed to read file' })
  }
})

// Create file
app.post('/files', (req, res) => {
  try {
    const { filename, content } = req.body

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Filename is required' })
    }

    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Content must be a string' })
    }

    const filePath = getFilePath(filename)

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return res.status(409).json({ error: 'File already exists' })
    }

    fs.writeFileSync(filePath, content, 'utf8')
    res.status(201).json({ message: 'File created successfully' })
  } catch (error) {
    console.error('Error creating file:', error)
    if (error.message === 'Invalid filename') {
      return res.status(400).json({ error: 'Invalid filename' })
    }
    res.status(500).json({ error: 'Failed to create file' })
  }
})

// Update file
app.put('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const { content } = req.body

    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Content must be a string' })
    }

    const filePath = getFilePath(filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    fs.writeFileSync(filePath, content, 'utf8')
    res.json({ message: 'File updated successfully' })
  } catch (error) {
    console.error('Error updating file:', error)
    if (error.message === 'Invalid filename') {
      return res.status(400).json({ error: 'Invalid filename' })
    }
    res.status(500).json({ error: 'Failed to update file' })
  }
})

// Delete file
app.delete('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = getFilePath(filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    fs.unlinkSync(filePath)
    res.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting file:', error)
    if (error.message === 'Invalid filename') {
      return res.status(400).json({ error: 'Invalid filename' })
    }
    res.status(500).json({ error: 'Failed to delete file' })
  }
})

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /files',
      'GET /files/:filename',
      'POST /files',
      'PUT /files/:filename',
      'DELETE /files/:filename',
    ],
  })
})

// Load SSL certificates
const certPath = path.join(__dirname, 'localhost.pem')
const keyPath = path.join(__dirname, 'localhost-key.pem')

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.error('❌ SSL certificates not found!')
  console.error('Please generate certificates using mkcert:')
  console.error('  1. Install mkcert: https://github.com/FiloSottile/mkcert')
  console.error('  2. Run: mkcert -install')
  console.error('  3. Run: mkcert localhost')
  console.error('  4. Move localhost.pem and localhost-key.pem to the local-server directory')
  process.exit(1)
}

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
}

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`✅ HTTPS server running on https://localhost:${PORT}`)
  console.log(`📁 Managed files directory: ${MANAGED_FILES_DIR}`)
  console.log(`🔒 CORS enabled for: ${allowedOrigins.join(', ')}`)
})

