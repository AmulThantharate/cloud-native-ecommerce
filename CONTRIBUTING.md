# 🤝 Contributing to NexStore

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Branch Strategy](#-branch-strategy)
- [Commit Convention](#-commit-convention)
- [Pull Request Process](#-pull-request-process)
- [Code Style](#-code-style)
- [Testing](#-testing)
- [Documentation](#-documentation)

## 📜 Code of Conduct

This project adheres to the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose v2+
- Node.js 20+ (frontend)
- Python 3.11+ (backend)
- Git

### Local Setup

```bash
# 1. Fork & clone the repository
git clone https://github.com/<your-username>/cloud-native-ecommerce.git
cd cloud-native-ecommerce

# 2. Create your feature branch
git checkout -b feat/your-feature-name

# 3. Start all services
make up

# 4. Seed the database
make seed

# 5. Open the app
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

## 🔄 Development Workflow

1. **Check Issues** — Look for `good first issue` or `help wanted` labels
2. **Discuss** — Comment on the issue before starting work
3. **Branch** — Create a branch from `main`
4. **Develop** — Make your changes with tests
5. **Test** — Run `make test` to verify
6. **Lint** — Run `make lint` to check formatting
7. **Commit** — Use [Conventional Commits](#-commit-convention)
8. **Push** — Push your branch and open a PR
9. **Review** — Address feedback from reviewers
10. **Merge** — Maintainer merges after approval

## 🌿 Branch Strategy

```
main          ← production-ready, protected
  └── feat/*  ← new features
  └── fix/*   ← bug fixes
  └── docs/*  ← documentation changes
  └── chore/* ← maintenance, CI, deps
  └── refactor/* ← code improvements
```

### Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/short-description` | `feat/product-reviews` |
| Bug Fix | `fix/short-description` | `fix/cart-total-calculation` |
| Docs | `docs/short-description` | `docs/api-endpoints` |
| Chore | `chore/short-description` | `chore/update-deps` |
| Refactor | `refactor/short-description` | `refactor/auth-middleware` |

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description | Emoji |
|------|-------------|-------|
| `feat` | New feature | ✨ |
| `fix` | Bug fix | 🐛 |
| `docs` | Documentation | 📝 |
| `style` | Formatting (no code change) | 🎨 |
| `refactor` | Code restructuring | ♻️ |
| `perf` | Performance improvement | ⚡ |
| `test` | Adding/updating tests | 🧪 |
| `build` | Build system or dependencies | 🔨 |
| `ci` | CI/CD changes | 👷 |
| `chore` | Maintenance | 🔧 |
| `revert` | Revert a commit | ⏪ |

### Scopes

`frontend`, `gateway`, `user`, `product`, `cart`, `order`, `payment`, `notification`, `infra`, `docs`, `ci`

### Examples

```bash
feat(product): add product review system
fix(cart): correct tax calculation for multi-item carts
docs(readme): update deployment instructions
ci(workflow): add security scanning step
refactor(gateway): extract proxy logic to middleware
```

## 🔀 Pull Request Process

1. **Fill out the PR template** completely
2. **Ensure CI passes** — all checks must be green
3. **Request review** from appropriate code owners
4. **Address feedback** — push fixup commits or interactive rebase
5. **Squash & merge** — maintainer will merge with a clean commit

### PR Requirements

- [ ] Descriptive title using conventional commits format
- [ ] Linked to a GitHub issue
- [ ] Tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No unresolved conversations
- [ ] CI/CD pipeline passes

## 🎨 Code Style

### Python (Backend)

- **Formatter**: `black` (line length: 120)
- **Linter**: `ruff`
- **Type checker**: `mypy`
- **Import order**: `isort` (black-compatible profile)

```bash
# Run all checks
make lint-backend
```

### TypeScript (Frontend)

- **Formatter**: `prettier`
- **Linter**: `eslint` with Next.js config
- **Strict mode**: enabled in `tsconfig.json`

```bash
# Run all checks
make lint-frontend
```

## 🧪 Testing

### Backend Tests

```bash
# Unit tests
make test-backend

# With coverage
make test-backend-coverage
```

### Frontend Tests

```bash
# Unit tests
make test-frontend

# With coverage
make test-frontend-coverage
```

### Integration Tests

```bash
# Start services and run integration tests
make test-integration
```

## 📖 Documentation

- Update `README.md` for user-facing changes
- Update `docs/` for architectural decisions
- Add docstrings to all public functions
- Use JSDoc for complex TypeScript functions
- Update API docs if endpoints change

## 🏷️ Labels

| Label | Description | Color |
|-------|-------------|-------|
| `bug` | Something isn't working | 🔴 |
| `enhancement` | New feature or request | 🟢 |
| `chore` | Maintenance task | 🟡 |
| `documentation` | Documentation changes | 🔵 |
| `good first issue` | Good for newcomers | 🟣 |
| `help wanted` | Extra attention needed | 🟠 |
| `triage` | Needs review | ⚪ |
| `wontfix` | Not planned | ⚫ |

---

Thank you for contributing to NexStore! Every contribution makes a difference. 🎉
