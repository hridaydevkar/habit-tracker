# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in HabitFlow, please report it responsibly:

### 🔒 Private Disclosure (Preferred)

For security vulnerabilities, please **do not** open a public issue. Instead:

1. **GitHub Security Advisory**
   - Go to: https://github.com/hridaydevkar/habit-tracker/security/advisories/new
   - Click "Report a vulnerability"
   - Provide detailed information

2. **Email** (if GitHub advisory not available)
   - Contact: [Your email or security@yourproject.com]
   - Subject: "Security: HabitFlow Vulnerability Report"
   - Encrypt with PGP if possible

### 📋 What to Include

- **Description**: Clear explanation of the vulnerability
- **Impact**: What could an attacker do?
- **Reproduction**: Step-by-step instructions
- **Environment**: Browser, OS, version
- **Severity**: Your assessment (Low/Medium/High/Critical)
- **Suggested Fix**: If you have ideas

### ⏱️ Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix & Disclosure**: Coordinated with reporter

### 🏆 Recognition

Security researchers who responsibly disclose vulnerabilities will be:
- Credited in release notes (with permission)
- Listed in SECURITY.md Hall of Fame
- Awarded a "Security Contributor" badge

## Known Security Considerations

### Local Storage

HabitFlow stores all data in browser `localStorage`:

✅ **Pros:**
- No server exposure
- No data transmission
- Full user control

⚠️ **Limitations:**
- Accessible to JavaScript on same origin
- Not encrypted at rest
- Can be cleared by browser/user

**Mitigation**: Do not store sensitive personal information in habit descriptions.

### XSS Protection

- All user inputs are sanitized
- React's built-in XSS protection
- No `dangerouslySetInnerHTML` usage

### Dependency Security

We actively monitor dependencies:
- GitHub Dependabot alerts enabled
- Regular `npm audit` checks
- Automated dependency updates

## Security Best Practices for Users

1. **Use HTTPS** - Always access via `https://`
2. **Keep Browser Updated** - Latest version recommended
3. **Extension Caution** - Some browser extensions can access localStorage
4. **Shared Computers** - Clear data when using public computers
5. **Backup Safely** - Export data securely if backing up

## Security Checklist for Contributors

When contributing code:

- [ ] Validate all user inputs
- [ ] Sanitize data before rendering
- [ ] Avoid `eval()` and `Function()` constructors
- [ ] Use Content Security Policy headers
- [ ] No hardcoded secrets/API keys
- [ ] Dependencies up-to-date
- [ ] No sensitive data in logs

## Scope

### In Scope ✅

- Cross-Site Scripting (XSS)
- Code injection vulnerabilities
- Authentication/Authorization bypasses (if added)
- Dependency vulnerabilities
- Data leakage issues

### Out of Scope ❌

- Social engineering attacks
- Physical access to device
- Browser vulnerabilities
- Rate limiting (client-side app)
- DDoS (static site)

## Contact

- **Security Email**: [Create one or use your personal]
- **GitHub Issues**: https://github.com/hridaydevkar/habit-tracker/issues (for non-security bugs)
- **Security Advisories**: https://github.com/hridaydevkar/habit-tracker/security/advisories

---

**Last Updated**: March 2026
