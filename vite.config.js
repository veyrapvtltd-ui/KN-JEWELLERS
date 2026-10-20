import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'saj-local-persistence',
      configureServer(server) {
        server.middlewares.use('/api/save-rates', (req, res) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const filePath = path.resolve(__dirname, 'public/assets/rates.json')
                fs.writeFileSync(filePath, body, 'utf8')
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: e.message }))
              }
            })
          }
        })

        server.middlewares.use('/api/save-products', (req, res) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const filePath = path.resolve(__dirname, 'public/assets/custom_products.json')
                fs.writeFileSync(filePath, body, 'utf8')
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: e.message }))
              }
            })
          }
        })
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
