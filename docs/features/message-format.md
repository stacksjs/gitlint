# Message Format Rules

GitLint includes several built-in rules to ensure your commit messages follow consistent formatting guidelines. These rules help maintain readability and structure across your Git history.

## Header Length Rules

### `header-max-length`

The `header-max-length` rule limits the maximum length of the commit message header (first line). By default, it enforces a maximum of 72 characters, which is considered a best practice for Git commit messages.

```ts
// In gitlint.config.ts
import type { GitLintConfig } from 'gitlint'

const config: GitLintConfig = {
  rules: {
    // Set a custom header length limit of 50 characters
    'header-max-length': [2, { maxLength: 50 }],
  },
}

export default config
```

This helps ensure that commit message headers are concise and readable, especially in contexts where the header is displayed without truncation (such as in `git log` outputs or GitHub/GitLab commit lists).

## Body Formatting Rules

### `body-max-line-length`

The `body-max-line-length` rule ensures that each line in the commit message body doesn't exceed a specified length. By default, the limit is 100 characters.

```ts
// In gitlint.config.ts
import type { GitLintConfig } from 'gitlint'

const config: GitLintConfig = {
  rules: {
    // Set a custom body line length limit of 80 characters
    'body-max-line-length': [2, { maxLength: 80 }],
  },
}

export default config
```

This rule helps maintain readability in terminals and text editors, preventing horizontal scrolling.

### `body-leading-blank`

The `body-leading-blank` rule requires a blank line between the header and the body of the commit message.

```
feat: add user authentication

This commit adds user authentication using JWT tokens.
The implementation includes login, registration, and password reset.
```

In the example above, there's a blank line between the header (`feat: add user authentication`) and the body. This improves readability by clearly separating the summary from the detailed description.

### `no-trailing-whitespace`

The `no-trailing-whitespace` rule checks for and prevents trailing whitespace in commit messages. Trailing whitespace is invisible and can cause unnecessary diff changes.

## Example Configuration

Here's an example of configuring all formatting rules:

```ts
// gitlint.config.ts
import type { GitLintConfig } from 'gitlint'

const config: GitLintConfig = {
  rules: {
    // Header must not exceed 72 characters
    'header-max-length': [2, { maxLength: 72 }],

    // Body lines must not exceed 100 characters
    'body-max-line-length': [2, { maxLength: 100 }],

    // Require blank line between header and body
    'body-leading-blank': 2,

    // Prevent trailing whitespace
    'no-trailing-whitespace': 1,
  },
}

export default config
```

## Best Practices for Message Formatting

Following these message formatting rules provides several benefits:

1. **Improved readability**: Well-formatted messages are easier to read and understand
2. **Better tooling compatibility**: Fixed-width formatting works better with Git-related tools
3. **Consistent history**: Uniformly formatted messages create a more professional commit history
4. **Easier reviews**: Clear formatting makes code review more efficient

## Tips for Writing Well-Formatted Messages

- Write the header as a complete sentence, but without a period at the end
- Use the imperative mood in the header (e.g., "Add feature" not "Added feature")
- Keep the header short and to the point (ideally under 50 characters)
- Provide details in the body, with one blank line after the header
- Use bullet points in the body for multiple changes
- For complex changes, explain the motivation behind the change
- Consider wrapping your text editor to match your line length limits
