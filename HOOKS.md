# Git Hooks Setup 🪝

This project uses **Husky** and **lint-staged** to automatically check your code before commits.

## What Happens on Commit?

When you run `git commit`, the following checks run automatically on **staged files only**:

1. ✨ **Format** - Prettier auto-formats your code
2. 🔍 **Lint** - ESLint checks and auto-fixes issues

**Note:** Type checking is handled by GitHub Actions CI/CD to keep commits fast.

## Files Configured

- **`.husky/pre-commit`** - Hook that runs before each commit
- **`.lintstagedrc.json`** - Configuration for what to check
- **`package.json`** - Scripts and dependencies

## Testing the Hook

Try making a commit with improperly formatted code:

```bash
# 1. Make a small change (add extra spaces, missing semicolons, etc.)
echo "const   x   =   1" >> apps/web/src/test.ts

# 2. Stage the file
git add apps/web/src/test.ts

# 3. Try to commit
git commit -m "test: checking pre-commit hook"

# The hook will:
# - Auto-format the code
# - Fix linting issues
# - If everything passes, commit succeeds!
```

## Bypassing Hooks (Not Recommended)

If you absolutely need to skip the checks (emergency only):

```bash
git commit --no-verify -m "your message"
```

## Manual Run

You can manually run lint-staged without committing:

```bash
pnpm lint-staged
```

## Troubleshooting

**Hook not running?**

```bash
# Reinstall husky
pnpm install
```

**Want to check all files (not just staged)?**

```bash
pnpm format    # Format everything
pnpm lint      # Lint everything
pnpm type-check # Type check everything
```

## What Gets Checked?

| File Type                  | Actions                       |
| -------------------------- | ----------------------------- |
| `*.ts, *.tsx, *.js, *.jsx` | Format → Lint (with auto-fix) |
| `*.json, *.md`             | Format only                   |

All checks run in **parallel** for speed! ⚡

Type checking is done in CI/CD (GitHub Actions) to keep local commits fast.
