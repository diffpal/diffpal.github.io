# Security And Control

DiffPal runs in your CI or workflow environment. Your repository provides the platform token used to publish feedback and the provider credentials used by the selected review agent.

DiffPal sends review requests to the provider you configure. Depending on that provider and agent setup, pull request diffs or source code may be sent to that provider. Choose provider credentials, fork-pull-request rules, and CI permissions according to your repository's trust model.

## Credential Boundaries

- Keep provider credentials in CI secrets.
- Use the platform token required by your host to publish comments, statuses, or artifacts.
- Do not expose provider credentials to untrusted fork pull request code.

## Canonical References

- [GitHub quickstart security notes](https://github.com/diffpal/diffpal/blob/main/docs/getting-started/github-quickstart.md#2-add-secret)
- [Fork pull requests and secrets](https://github.com/diffpal/diffpal/blob/main/docs/help/troubleshooting.md#fork-pull-requests-and-secrets)
- [Platform authentication reference](https://github.com/diffpal/diffpal/blob/main/docs/reference/configuration.md#platform-auth)
