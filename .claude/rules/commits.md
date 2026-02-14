# Commit Conventions

## Issue References

- Reference the GitHub issue number in commits when work pertains to an issue
- Use `Fixes #N` in the commit body to auto-close the issue on merge
- Use `(#N)` in the subject line for partial progress that does not close the issue
- No custom prefix scheme — use GitHub's native `#number` linking

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
