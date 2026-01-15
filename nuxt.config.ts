// https://nuxt.com/docs/api/configuration/nuxt-config

// Strip data-testid attributes when STRIP_TEST_IDS=true (e.g., for actual deployment)
// This is opt-in rather than automatic in production, so E2E tests can still use data-testid
const stripTestIds = process.env.STRIP_TEST_IDS === 'true'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@nuxt/eslint', '@nuxtjs/sitemap'],

  site: {
    url: 'https://reussirmonexamencivique.fr',
  },

  css: ['~/assets/css/main.css'],

  // i18n configuration
  i18n: {
    locales: [{ code: 'fr', file: 'fr.json', name: 'Français' }],
    defaultLocale: 'fr',
    lazy: true,
    langDir: '../locales',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
  },

  // SSG configuration
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
    // Compression for static assets
    compressPublicAssets: true,
  },

  // Performance optimizations
  experimental: {
    payloadExtraction: true,
  },

  // Build optimizations
  vite: {
    build: {
      // Chunk size warning limit
      chunkSizeWarningLimit: 500,
      // Minify CSS
      cssMinify: true,
      // Rollup options for better tree-shaking
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            'vue-vendor': ['vue', 'vue-router'],
          },
        },
      },
    },
    vue: {
      template: {
        compilerOptions: {
          // Strip data-testid attributes when STRIP_TEST_IDS=true
          nodeTransforms: stripTestIds
            ? [
                (node) => {
                  if (node.type === 1 /* ELEMENT */) {
                    node.props = node.props.filter((prop) => {
                      // Static attributes: data-testid="..."
                      if (prop.type === 6 /* ATTRIBUTE */) {
                        return !prop.name.startsWith('data-testid')
                      }
                      // Dynamic attributes: :data-testid="..."
                      if (prop.type === 7 /* DIRECTIVE */ && prop.arg?.content) {
                        return !prop.arg.content.startsWith('data-testid')
                      }
                      return true
                    })
                  }
                },
              ]
            : [],
        },
      },
    },
  },

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#F97066' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: 'Réussir mon Examen Civique' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        // Robots
        { name: 'robots', content: 'index, follow' },
      ],
      htmlAttrs: {
        lang: 'fr',
      },
      link: [
        { rel: 'canonical', href: 'https://reussirmonexamencivique.fr' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
})
