import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

import demandImport from './plugin/index'

export default defineConfig({
  plugins: [
    demandImport({
      lib: 'antd-mobile',
      resolver: {
        js({ name }) {
          return `antd-mobile/es/components/${name}`
        }
      }
    }),
    react()
  ]
})
