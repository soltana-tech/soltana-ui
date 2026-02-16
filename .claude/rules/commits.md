# Commit Conventions

## Issue Reference Requirements

Every commit MUST include an issue reference when work pertains to an issue:

1. Determine: does this commit fully resolve the issue?
   - **Yes** → Add `Fixes #N` on a blank line in the commit **body**
   - **No** → Add `(#N)` in the commit **subject line**
2. Never omit the reference. Never put `Fixes #N` in the subject line.
3. No custom prefix scheme — use GitHub's native `#number` linking.

## Examples

Closing an issue:
```
Fix config crash after reset

Fixes #42
```

Partial progress:
```
Add shadow scale to lifted relief (#15)
```
