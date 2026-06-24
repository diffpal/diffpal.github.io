---
layout: home

hero:
  name: DiffPal
  text: Open-source AI pull request review you control.
  tagline: Bring your own agent. Run it in your CI. Publish consistent findings, summaries, and merge gates.
  image:
    src: /logo.png
    alt: DiffPal logo
  actions:
    - theme: brand
      text: Get started
      link: /github-quickstart
    - theme: alt
      text: Read the docs
      link: /docs
    - theme: alt
      text: View on GitHub
      link: https://github.com/diffpal/diffpal
---

## Outcome Preview

After a successful review, DiffPal publishes the same core outputs across supported hosts:

| Output | What users see |
| --- | --- |
| Review summary | A PR or MR summary with the review result and notable changes. |
| Inline finding | File-level feedback on changed lines when actionable issues exist. |
| Status or gate | A check, commit status, PR status, or CI result tied to the configured gate. |
| Findings artifact | A machine-readable findings bundle written in the workflow workspace. |

## How It Works

1. Resolve the PR or MR review scope.
2. Invoke the configured provider or ACP-compatible agent.
3. Validate structured findings against the changed code.
4. Publish feedback and apply the configured gate.

## Why Teams Use DiffPal

- **Provider choice:** use Codex, Copilot, OpenCode, a hosted provider, or another ACP-compatible agent.
- **CI-native operation:** run reviews inside the workflow environment your team already controls.
- **Repository-owned policy:** keep review configuration, instructions, artifacts, and gates with the codebase.
- **Consistent output:** publish summaries, findings, artifacts, and statuses across supported hosts.
- **Machine-readable artifacts:** keep review output available for auditing, reporting, and downstream tooling.

## Integrations

### Code Hosts And CI Publishers

DiffPal publishes review feedback through the CI and code review systems your repository uses:

- GitHub Actions
- GitLab CI
- Azure Pipelines

### AI Providers And ACP-Compatible Agents

CI installs and authenticates the provider you choose, while DiffPal keeps the review workflow and output contract consistent:

- Codex
- Copilot
- OpenCode
- hosted providers configured in DiffPal
- any CLI that starts an ACP stdio server

## Security And Control

DiffPal runs in your CI or workflow environment. Your repository supplies the platform token used to publish feedback and the provider credentials used by the selected review agent.

DiffPal resolves the PR or MR review scope and sends review input to the provider you configure. Depending on that provider and agent setup, the provider or agent may inspect source context. Choose provider credentials, fork-pull-request rules, and CI permissions according to your repository's trust model.

## Start Reviewing

- [Start with GitHub Actions](/github-quickstart)
- [Use another CI/CD system](/custom-ci)
- [Bring your own agent](/providers)
