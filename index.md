---
layout: home

hero:
  name: DiffPal
  text: Open-source AI PR review you control.
  tagline: Bring your own agent. Keep one PR review workflow.
  image:
    src: /logo.png
    alt: DiffPal logo
  actions:
    - theme: brand
      text: Get started
      link: /quickstart
    - theme: alt
      text: View on GitHub
      link: https://github.com/diffpal/diffpal

features:
  - title: Structured findings
    details: Review output is normalized into a canonical findings bundle.
  - title: PR summaries and inline feedback
    details: Publish summaries and actionable file-level comments where the host supports them.
  - title: Machine-readable artifacts
    details: Write JSON, SARIF, Code Quality, and platform-specific publish plans for CI auditing.
  - title: Merge gates
    details: Fail CI only when configured blocking findings are present or setup and publishing fail.
  - title: Provider choice
    details: Use Codex ACP, another ACP-compatible CLI, hosted providers, or a provider pool.
  - title: GitHub, GitLab, and Azure DevOps support
    details: Keep one review workflow across the major PR and merge request hosts.
---

## How It Works

1. Commit `.config/diffpal/config.yaml` with the provider and review policy you want.
2. Install and authenticate your selected review provider in CI.
3. Run DiffPal against the pull request base and head commits.
4. Publish a summary, inline findings, machine-readable artifacts, and an optional merge gate.

## Quickstart

```bash
npx -y @diffpal/diffpal@latest init --wizard --setup codex-api-key --platform github
```

This creates `.config/diffpal/config.yaml` for the Codex API-key recipe, including the selected provider, review checks, `profiles.ci`, and a GitHub platform block.

Continue with the [quickstart](/quickstart) for the required secret, workflow, and first same-repository pull request.
