import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import seo from './vite-plugin-seo.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), seo(loadEnv(mode, process.cwd(), 'VITE_'))],
}))
