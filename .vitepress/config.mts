import { defineConfig } from 'vitepress'

const siteTitle = 'DiffPal'
const siteDescription = 'Open-source AI PR review you control.'
const mainRepo = 'https://github.com/diffpal/diffpal'
const docsBase = `${mainRepo}/blob/main/docs`
const examplesBase = `${mainRepo}/tree/main/examples`
const changelog = `${mainRepo}/blob/main/CHANGELOG.md`

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
      { icon: 'github', link: mainRepo }
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs' },
      { text: 'Examples', link: examplesBase },
      { text: 'Security', link: '/security' },
      { text: 'Changelog', link: changelog },
      { text: 'GitHub', link: mainRepo }
    ],
    sidebar: [
      {
        text: 'Get started',
        items: [
          { text: 'GitHub quickstart', link: `${docsBase}/getting-started/github-quickstart.md` },
          { text: 'Custom CI/CD', link: `${docsBase}/integrations/README.md#common-setup` },
          { text: 'Bring your own agent', link: `${docsBase}/integrations/README.md#using-another-acp-cli` },
          { text: 'Configuration reference', link: `${docsBase}/reference/configuration.md` },
          { text: 'Troubleshooting', link: `${docsBase}/help/troubleshooting.md` }
        ]
      },
      {
        text: 'Concepts',
        items: [
          { text: 'How DiffPal works', link: `${docsBase}/concepts/how-diffpal-works.md` },
          { text: 'Comparison', link: `${docsBase}/concepts/comparison.md` }
        ]
      },
      {
        text: 'Integrations',
        items: [
          { text: 'GitHub Actions', link: `${docsBase}/integrations/github-actions.md` },
          { text: 'GitLab CI', link: `${docsBase}/integrations/gitlab-ci.md` },
          { text: 'Azure Pipelines', link: `${docsBase}/integrations/azure-pipelines.md` }
        ]
      },
      {
        text: 'Providers',
        items: [
          { text: 'Provider recipes', link: `${docsBase}/integrations/README.md#common-setup` },
          { text: 'Provider model', link: `${docsBase}/reference/configuration.md#provider-model` },
          { text: 'Generic ACP CLI', link: `${docsBase}/reference/configuration.md#generic-acp-cli` }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Verify first review', link: `${docsBase}/getting-started/verify-first-review.md` },
          { text: 'Examples gallery', link: examplesBase }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Configuration', link: `${docsBase}/reference/configuration.md` },
          { text: 'Artifacts', link: `${docsBase}/reference/artifacts.md` },
          { text: 'Findings schema', link: `${docsBase}/reference/findings-schema.md` },
          { text: 'Support matrix', link: `${docsBase}/reference/support-matrix.md` },
          { text: 'Versioning', link: `${docsBase}/reference/versioning.md` }
        ]
      },
      {
        text: 'Help',
        items: [
          { text: 'Troubleshooting', link: `${docsBase}/help/troubleshooting.md` },
          { text: 'Fork pull requests and secrets', link: `${docsBase}/help/troubleshooting.md#fork-pull-requests-and-secrets` }
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
