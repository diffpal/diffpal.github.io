import { defineConfig } from 'vitepress'

const siteTitle = 'DiffPal'
const siteDescription = 'Open-source AI PR review you control.'
const mainRepo = 'https://github.com/diffpal/diffpal'
const demoReview = 'https://github.com/diffpal/demo/pull/13'
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
  transformHead({ page, pageData }) {
    if (pageData.isNotFound) {
      return []
    }

    const route = `/${page.replace(/index\.md$/, '').replace(/\.md$/, '')}`
    const canonicalURL = `https://diffpal.github.io${route}`
    const socialTitle = pageData.title
      ? `${pageData.title} | ${siteTitle}`
      : siteTitle

    return [
      ['link', { rel: 'canonical', href: canonicalURL }],
      ['meta', { property: 'og:title', content: socialTitle }],
      ['meta', { property: 'og:url', content: canonicalURL }],
      ['meta', { name: 'twitter:title', content: socialTitle }]
    ]
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
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
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
      { text: 'Docs', link: '/docs' },
      { text: 'Integrations', link: '/integrations/' },
      { text: 'Providers', link: '/providers/' },
      {
        text: 'Resources',
        items: [
          { text: 'Live review demo', link: demoReview },
          { text: 'Examples', link: examplesBase },
          { text: 'Changelog', link: changelog }
        ]
      }
    ],
    sidebar: [
      {
        text: 'Get started',
        link: '/getting-started/',
        items: [
          { text: 'GitHub quickstart', link: '/getting-started/github-quickstart' },
          { text: 'Verify your first review', link: '/getting-started/verify-first-review' },
          { text: 'Choose next steps', link: '/getting-started/next-steps' }
        ]
      },
      {
        text: 'Integrations',
        link: '/integrations/',
        collapsed: true,
        items: [
          { text: 'GitHub Actions', link: '/integrations/github-actions' },
          { text: 'GitLab CI', link: '/integrations/gitlab-ci' },
          { text: 'Azure Pipelines', link: '/integrations/azure-pipelines' },
          { text: 'Custom CI/CD', link: '/integrations/custom-ci' }
        ]
      },
      {
        text: 'Providers',
        link: '/providers/',
        collapsed: true,
        items: [
          { text: 'Codex', link: '/providers/codex' },
          { text: 'Copilot', link: '/providers/copilot' },
          { text: 'OpenCode', link: '/providers/opencode' },
          { text: 'ACP Registry agents', link: '/providers/acp-registry' },
          { text: 'Custom ACP-compatible CLI', link: '/providers/custom-acp' }
        ]
      },
      {
        text: 'Guides',
        link: '/guides/',
        collapsed: true,
        items: [
          { text: 'Secrets and fork PRs', link: '/guides/secrets-and-fork-prs' },
          { text: 'Security controls', link: '/security' }
        ]
      },
      {
        text: 'Concepts',
        link: '/concepts/',
        collapsed: true,
        items: [
          { text: 'How DiffPal works', link: '/concepts/how-diffpal-works' },
          { text: 'Review lifecycle', link: '/concepts/review-lifecycle' },
          { text: 'Findings, feedback, and gates', link: '/concepts/findings-feedback-and-gates' },
          { text: 'Providers and agents', link: '/concepts/providers-and-agents' },
          { text: 'Comparison', link: '/concepts/comparison' }
        ]
      },
      {
        text: 'Reference',
        link: '/reference/',
        collapsed: true,
        items: [
          { text: 'Configuration', link: '/reference/configuration' },
          { text: 'CLI', link: '/reference/cli' },
          { text: 'Artifacts', link: '/reference/artifacts' },
          { text: 'Findings schema', link: '/reference/findings-schema' },
          { text: 'Support matrix', link: '/reference/support-matrix' },
          { text: 'Exit behavior', link: '/reference/exit-behavior' },
          { text: 'Versioning', link: '/reference/versioning' },
          { text: 'Glossary', link: '/reference/glossary' }
        ]
      },
      {
        text: 'Help',
        link: '/help/',
        collapsed: true,
        items: [
          { text: 'Troubleshooting', link: '/help/troubleshooting' },
          { text: 'FAQ', link: '/help/faq' }
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
