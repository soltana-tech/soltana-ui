# Linting Rules

## Markdown Line Length (MD013)

**CRITICAL**: Never completely disable the MD013 line length rule.

### Allowed Exceptions

The following exceptions are permitted in `.markdownlint-cli2.jsonc`:

```jsonc
"MD013": {
  "tables": false,        // Disable for tables
  "code_blocks": false,   // Disable for code blocks
  "line_length": 80       // Maximum line length for all other content
}
```

### When Long Lines Occur

If markdown content exceeds the line length limit:

1. **DO NOT** disable the rule globally
2. **DO** refactor the content to fit within 80 characters:
   - Break long sentences into multiple lines
   - Split badge lines (one badge per line if needed)
   - Break link reference definitions across multiple lines
   - Use markdown line continuation (trailing backslash or implicit continuation)

### Examples

**Bad** (disabling the rule):

```jsonc
"MD013": false  // ❌ NEVER DO THIS
```

**Good** (fixing the content):

```markdown
<!-- Instead of one long line: -->

[Documentation](https://example.com) • [Gallery](https://example.com/gallery) • [Playground](https://example.com/playground)

<!-- Break into multiple lines: -->

[Documentation](https://example.com) •
[Gallery](https://example.com/gallery) •
[Playground](https://example.com/playground)
```

## General Principle

**Always resolve linting issues at the source (the content) rather than by
disabling or circumventing the lint rules.**
