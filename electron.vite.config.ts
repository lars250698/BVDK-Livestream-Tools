import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    assetsInclude: ['**/*.gql', '**/*.graphql', '**/*.mustache'],
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    assetsInclude: ['**/*.gql', '**/*.graphql', '**/*.mustache'],
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    assetsInclude: ['**/*.gql', '**/*.graphql', '**/*.mustache'],
    plugins: [vue()]
  }
})
