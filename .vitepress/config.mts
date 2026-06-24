import { defineConfig } from 'vitepress'

const siteTitle = 'DiffPal'
const siteDescription = 'Open-source AI PR review you control.'
const mainRepo = 'https://github.com/diffpal/diffpal'
const examplesBase = `${mainRepo}/tree/main/examples`
const changelog = `${mainRepo}/blob/main/CHANGELOG.md`
const googleAnalyticsId = 'G-B8G6D7K9SQ'

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
    [
      'script',
      {
        async: '',
        src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
      }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`
    ],
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
          { text: 'GitHub quickstart', link: '/github-quickstart' },
          { text: 'Custom CI/CD', link: '/custom-ci' },
          { text: 'Bring your own agent', link: '/providers' },
          { text: 'Configuration reference', link: '/configuration' },
          { text: 'Troubleshooting', link: '/troubleshooting' }
        ]
      },
      {
        text: 'Concepts',
        items: [
          { text: 'How DiffPal works', link: '/how-diffpal-works' },
          { text: 'Review lifecycle', link: '/review-lifecycle' },
          { text: 'Findings, feedback, and gates', link: '/findings-feedback-and-gates' },
          { text: 'Providers and agents', link: '/providers-and-agents' },
          { text: 'Comparison', link: '/comparison' },
          { text: 'Glossary', link: '/glossary' }
        ]
      },
      {
        text: 'Integrations',
        items: [
          { text: 'Overview', link: '/integrations' },
          { text: 'GitHub Actions', link: '/github-actions' },
          { text: 'GitLab CI', link: '/gitlab-ci' },
          { text: 'Azure Pipelines', link: '/azure-pipelines' },
          { text: 'Custom CI/CD', link: '/custom-ci' }
        ]
      },
      {
        text: 'Providers',
        items: [
          { text: 'Provider recipes', link: '/providers' },
          { text: 'Provider model', link: '/providers-and-agents' },
          { text: 'Codex', link: '/codex' },
          { text: 'Copilot', link: '/copilot' },
          { text: 'OpenCode', link: '/opencode' },
          { text: 'Generic ACP CLI', link: '/custom-acp' }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Verify first review', link: '/verify-first-review' },
          { text: 'Next steps', link: '/next-steps' },
          { text: 'Secrets and fork PRs', link: '/secrets-and-fork-prs' },
          { text: 'Examples gallery', link: examplesBase }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Configuration', link: '/configuration' },
          { text: 'CLI', link: '/cli' },
          { text: 'Artifacts', link: '/artifacts' },
          { text: 'Findings schema', link: '/findings-schema' },
          { text: 'Support matrix', link: '/support-matrix' },
          { text: 'Exit behavior', link: '/exit-behavior' },
          { text: 'Versioning', link: '/versioning' }
        ]
      },
      {
        text: 'Help',
        items: [
          { text: 'Troubleshooting', link: '/troubleshooting' },
          { text: 'FAQ', link: '/faq' }
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
