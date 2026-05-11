# 🔒 Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x.x   | ✅ Active support  |
| 0.x.x   | ❌ End of life     |

## 🚨 Reporting a Vulnerability

We take security seriously at NexStore. If you discover a security vulnerability, please report it responsibly.

### How to Report

**⚠️ DO NOT open a public GitHub issue for security vulnerabilities.**

1. **Email**: Send details to **security@nexstore.dev**
2. **GitHub Security Advisory**: Use [GitHub's private vulnerability reporting](https://github.com/nexstore/cloud-native-ecommerce/security/advisories/new)
3. **PGP Key**: Available at `https://nexstore.dev/.well-known/pgp-key.txt`

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Affected service(s) and version(s)
- Potential impact assessment
- Suggested fix (if any)

### Response Timeline

| Action | Timeline |
|--------|----------|
| Acknowledgment | Within **24 hours** |
| Initial Assessment | Within **72 hours** |
| Fix Developed | Within **7 days** (critical) / **30 days** (non-critical) |
| Public Disclosure | After fix is deployed and users notified |

## 🛡️ Security Best Practices

### For Contributors

- **Never** commit secrets, API keys, or credentials
- Use environment variables for all sensitive configuration
- Follow the principle of least privilege
- Keep dependencies up to date
- Use parameterized queries — never string interpolation for SQL
- Validate and sanitize all user input
- Use HTTPS everywhere

### For Operators

- Rotate secrets and JWT signing keys regularly
- Enable audit logging in production
- Use network policies to restrict inter-service communication
- Run containers as non-root users
- Enable image scanning in your CI/CD pipeline
- Monitor for anomalous traffic patterns

## 🔐 Security Features

- **JWT Authentication** with expiring tokens
- **bcrypt** password hashing
- **Rate Limiting** on API gateway
- **CORS** configuration
- **Input Validation** via Pydantic models
- **SQL Injection Protection** via SQLAlchemy ORM
- **Dependency Scanning** via GitHub Dependabot
- **Container Scanning** via Trivy

## 📋 Dependency Policy

- Dependencies are audited monthly
- Critical CVEs are patched within 48 hours
- Dependabot alerts are reviewed within 5 business days
- All dependencies must have active maintenance

## Hall of Fame

We appreciate responsible disclosure. Contributors who report valid security issues will be acknowledged here (with their permission):

<!-- Add security contributors here -->

---

Thank you for helping keep NexStore and its users safe! 🙏
