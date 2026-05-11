# 🚀 Production Checklist

Before deploying to production, ensure all items are checked:

## 🔒 Security
- [ ] All secrets are stored in a secrets manager (not env files)
- [ ] JWT secret key is unique and strong (256+ bits)
- [ ] CORS is configured for production domain only
- [ ] Rate limiting is enabled on the API gateway
- [ ] HTTPS is enforced (TLS termination at load balancer)
- [ ] Database connections use SSL
- [ ] Container images are scanned for vulnerabilities
- [ ] No debug endpoints are exposed
- [ ] Admin endpoints require authentication

## 🐘 Database
- [ ] Database migrations are applied
- [ ] Connection pooling is configured
- [ ] Backups are scheduled and tested
- [ ] Read replicas are set up for high-traffic services
- [ ] Database credentials are rotated

## 📦 Infrastructure
- [ ] Health checks are configured for all services
- [ ] Resource limits (CPU/memory) are set
- [ ] Auto-scaling rules are defined
- [ ] Load balancer is configured
- [ ] DNS records are set up
- [ ] CDN is configured for static assets

## 📊 Observability
- [ ] Structured logging is enabled
- [ ] Metrics are exported to monitoring system
- [ ] Distributed tracing is configured
- [ ] Alerting rules are set up
- [ ] Dashboards are created
- [ ] Error tracking is configured (e.g., Sentry)

## 🧪 Testing
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Load testing has been performed
- [ ] Chaos testing has been performed
- [ ] Rollback procedure has been tested

## 📋 Operations
- [ ] Runbooks are documented
- [ ] Incident response plan is in place
- [ ] On-call rotation is set up
- [ ] Change management process is defined
