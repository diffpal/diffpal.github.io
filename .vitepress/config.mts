import { defineConfig } from 'vitepress'

const siteTitle = 'DiffPal'
const siteDescription = 'Open-source AI PR review you control.'

export default defineConfig({
  lang: 'en-US',
  title: siteTitle,
  description: siteDescription,
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md', 'AGENTS.md'],
  sitemap: {
    hostname: 'https://diffpal.github.io'
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo-mark.png' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: siteTitle }],
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { property: 'og:url', content: 'https://diffpal.github.io/' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: siteTitle }],
    ['meta', { name: 'twitter:description', content: siteDescription }]
  ],
  themeConfig: {
    logo: '/logo-mark.png',
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/diffpal/diffpal.github.io/edit/main/:path',
      text: 'Edit this page on GitHub'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/diffpal/diffpal' }
    ],
    nav: [
      { text: 'Guide', link: '/quickstart' },
      { text: 'Configuration', link: '/config-reference' },
      { text: 'Platforms', link: '/platform-gitlab' },
      { text: 'GitHub', link: 'https://github.com/diffpal/diffpal' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Quickstart', link: '/quickstart' },
          { text: 'What Success Looks Like', link: '/what-success-looks-like' }
        ]
      },
      {
        text: 'Setup',
        items: [
          { text: 'CI Setup', link: '/ci-examples' },
          { text: 'GitLab', link: '/platform-gitlab' },
          { text: 'Azure DevOps', link: '/platform-azure' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Configuration Reference', link: '/config-reference' },
          { text: 'Configuration Schema', link: '/config-schema' },
          { text: 'Findings Schema', link: '/findings-schema' },
          { text: 'Versions and Artifacts', link: '/version-and-artifacts' }
        ]
      },
      {
        text: 'Concepts',
        items: [
          { text: 'Product Contract', link: '/product-contract' },
          { text: 'Comparison', link: '/comparison' }
        ]
      },
      {
        text: 'Operations',
        items: [
          { text: 'Troubleshooting', link: '/troubleshooting' },
          { text: 'Release Process', link: '/release' }
        ]
      }
    ],
    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },
    footer: {
      message: 'Released as open source software.',
      copyright: 'Copyright © 2026 Alexey Samoylov'
    }
  }
})
