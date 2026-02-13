# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-11-21

### 🎉 Initial Release

#### Added

- **Authentication System**
  - JWT-based authentication with login/register
  - Protected routes with automatic redirect
  - Token persistence in localStorage
  - Automatic logout on token expiration (401)

- **Article Management**
  - Full CRUD operations for articles
  - Mongoose schema with validation
  - Text search index on title, abstract, authors
  - Advanced filtering (year, authors, journal)
  - Pagination support (limit, skip, page)
  - Rich metadata (volume, issue, pages)

- **Citation System**
  - Bidirectional relationship with articles
  - CRUD operations for citations
  - Automatic parent article update
  - Citation display in article details

- **Search & Filtering**
  - Full-text search with MongoDB text index
  - Query operators (gte, lte, gt, lt, in)
  - Combined filters (search + year + authors)
  - URL-synchronized filters with React Router

- **Frontend Features**
  - React 19 with Vite
  - Mantine UI components
  - React Query for server state
  - Zustand for auth state
  - Optimistic updates with rollback
  - Automatic cache invalidation
  - React Query DevTools (dev only)
  - Responsive design (mobile-first)
  - Dark mode support

- **Backend Features**
  - Express.js REST API
  - MongoDB with Mongoose ODM
  - Zod validation (end-to-end)
  - Centralized error handling
  - Rate limiting (100 req/15min)
  - CORS configuration
  - Helmet security headers
  - JWT authentication middleware

- **Testing**
  - Backend: Jest + Supertest
  - Frontend: Vitest + React Testing Library
  - MongoDB Memory Server for tests
  - 13 integration tests (all passing)
  - Auth helper for authenticated tests

- **DevOps**
  - Docker Compose setup
  - Environment configuration (.env)
  - Development hot reload (nodemon, vite)
  - Production build scripts

- **Documentation**
  - Comprehensive README.md
  - API endpoint documentation
  - Installation guide
  - Troubleshooting section
  - Contributing guidelines
  - MIT License

#### Tech Stack

- **Frontend**: React 19, Mantine UI 8.3, React Query, Zustand, Vite
- **Backend**: Node.js 16+, Express 4.19, MongoDB 8.4, Mongoose 8.4
- **Validation**: Zod 3.23
- **Auth**: JWT (jsonwebtoken)
- **Testing**: Jest 29, Supertest 7, Vitest
- **Security**: Helmet, CORS, Rate Limiting

---

## [Unreleased]

### Planned Features

- [ ] Infinite scroll for article list
- [ ] Export articles to BibTeX/RIS format
- [ ] Advanced citation formatting
- [ ] User profile management
- [ ] Email verification
- [ ] Password reset flow
- [ ] Collaborative editing
- [ ] Real-time notifications
- [ ] Full-text PDF upload
- [ ] Citation graph visualization
- [ ] Elasticsearch integration
- [ ] GraphQL API option

### Known Issues

- None reported yet

---

## Version History

### Version Naming Convention

- **Major**: Breaking changes (v2.0.0)
- **Minor**: New features (v1.1.0)
- **Patch**: Bug fixes (v1.0.1)

---

**Note**: Dates use format YYYY-MM-DD
