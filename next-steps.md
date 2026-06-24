# Next Steps

Use this page after your first DiffPal review is working.

## Change Provider

Switch providers by changing the selected `runtime.providers` entry and the
matching CI install/authentication step. Start with the
[Providers](/providers) section or use
[Custom ACP-Compatible CLI](/custom-acp) for a custom agent.

## Enable Review Comments

Set feedback mode to `review` when you want file-level comments, discussions, or
PR threads. Use `summary` when you only want the summary and non-file artifacts.
See [Feedback Modes](/integrations#feedback-modes).

## Configure Policy

Tune review language, repository instructions, profiles, MCP servers, and
severity policy in `.config/diffpal/config.yaml`. See the
[configuration reference](/configuration).

## Enable A Merge Gate

Enable the gate in CI when blocking findings should fail the job. Start with
`block_on: high`; lower the threshold only after your team has tuned the review
policy. See [Gate](/configuration#gate).

## Retain Artifacts

Upload `.artifacts/diffpal/` from CI when you need audit records, SARIF, Code
Quality reports, or the canonical findings bundle after the job completes. See
the [artifacts reference](/artifacts).

## Move To Another Host Or CI

Use the same DiffPal config shape and change the CI host setup:

- [GitLab CI](/gitlab-ci)
- [Azure Pipelines](/azure-pipelines)
- [Custom CI/CD](/custom-ci)

Next step: choose the integration page for the CI system that will run the next
DiffPal review.
