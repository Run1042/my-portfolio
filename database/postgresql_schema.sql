-- =============================================================================
-- Portfolio Application - PostgreSQL Database Schema
-- Compatible with PostgreSQL 13, 14, 15, 16+
-- Includes Role-Based Access Control (RBAC): Roles & Permissions
-- =============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores administrative & authorized users
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 2. ROLES TABLE
-- Defines user authorization roles (e.g. super-admin, editor, viewer)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roles_slug ON roles(slug);

-- -----------------------------------------------------------------------------
-- 3. PERMISSIONS TABLE
-- Granular system capabilities and access grants
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS permissions CASCADE;
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL DEFAULT 'General',
    description VARCHAR(255) NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permissions_slug ON permissions(slug);
CREATE INDEX idx_permissions_category ON permissions(category);

-- -----------------------------------------------------------------------------
-- 4. ROLE_PERMISSIONS TABLE (Pivot: Role <-> Permission)
-- Maps permissions to roles
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS role_permissions CASCADE;
CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_perm ON role_permissions(permission_id);

-- -----------------------------------------------------------------------------
-- 5. USER_ROLES TABLE (Pivot: User <-> Role)
-- Assigns roles to users
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS user_roles CASCADE;
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- -----------------------------------------------------------------------------
-- 6. USER_PERMISSIONS TABLE (Pivot: User <-> Permission)
-- Allows direct granular permission overrides per user
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS user_permissions CASCADE;
CREATE TABLE user_permissions (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, permission_id)
);

CREATE INDEX idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_perm ON user_permissions(permission_id);

-- -----------------------------------------------------------------------------
-- 7. PASSWORD RESET TOKENS
-- Handles secure password recovery tokens
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

-- -----------------------------------------------------------------------------
-- 8. SESSIONS TABLE
-- Database session driver support for authenticated admin sessions
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS sessions CASCADE;
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity);

-- -----------------------------------------------------------------------------
-- 9. PROJECTS TABLE
-- Stores developer portfolio project showcase items
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS projects CASCADE;
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL DEFAULT 'Full-Stack Application',
    description TEXT NOT NULL,
    content TEXT NULL,
    image VARCHAR(500) NULL,
    demo_url VARCHAR(500) NULL,
    github_url VARCHAR(500) NULL,
    tags VARCHAR(255) NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured_order ON projects(is_featured, "order" ASC, created_at DESC);

-- -----------------------------------------------------------------------------
-- 10. SKILLS TABLE
-- Categorized technical skills & proficiency percentages
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS skills CASCADE;
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Frontend',
    proficiency INTEGER NOT NULL DEFAULT 80 CHECK (proficiency BETWEEN 1 AND 100),
    icon VARCHAR(50) NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_category_order ON skills(category, "order" ASC);

-- -----------------------------------------------------------------------------
-- 11. MESSAGES TABLE
-- Client inquiries and contact form submissions
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_is_read ON messages(is_read, created_at DESC);
CREATE INDEX idx_messages_email ON messages(email);

-- -----------------------------------------------------------------------------
-- 12. CACHE & CACHE LOCKS TABLES
-- Database cache driver support
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS cache CASCADE;
CREATE TABLE cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

DROP TABLE IF EXISTS cache_locks CASCADE;
CREATE TABLE cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);

-- -----------------------------------------------------------------------------
-- 13. JOBS & FAILED JOBS TABLES
-- Background queues & asynchronous processing support
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS jobs CASCADE;
CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    attempts SMALLINT NOT NULL,
    reserved_at INTEGER NULL,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX idx_jobs_queue ON jobs(queue);

DROP TABLE IF EXISTS failed_jobs CASCADE;
CREATE TABLE failed_jobs (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- SEED DATA
-- Pre-populated Roles, Permissions, Admin User, and Showcase Content
-- =============================================================================

-- 1. Insert Default Roles
INSERT INTO roles (name, slug, description, is_system, created_at, updated_at)
VALUES 
('Super Administrator', 'super-admin', 'Unrestricted administrative access to all resources', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Administrator', 'admin', 'Can manage projects, skills, and respond to inquiries', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Content Editor', 'editor', 'Can create and edit projects and skills showcase', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Auditor / Viewer', 'viewer', 'Read-only access to admin dashboards and analytics', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Granular Permissions
INSERT INTO permissions (name, slug, category, description, created_at, updated_at)
VALUES 
-- Projects permissions
('View Projects', 'projects.view', 'Projects', 'Permission to view showcase projects', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Create Projects', 'projects.create', 'Projects', 'Permission to create new portfolio projects', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Edit Projects', 'projects.edit', 'Projects', 'Permission to modify existing projects', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Delete Projects', 'projects.delete', 'Projects', 'Permission to permanently remove projects', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Skills permissions
('View Skills', 'skills.view', 'Skills', 'Permission to inspect skills matrix', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Create Skills', 'skills.create', 'Skills', 'Permission to add new technical skills', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Edit Skills', 'skills.edit', 'Skills', 'Permission to update skills and proficiencies', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Delete Skills', 'skills.delete', 'Skills', 'Permission to delete skills', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Messages permissions
('View Messages', 'messages.view', 'Messages', 'Permission to read contact inbox inquiries', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Reply Messages', 'messages.reply', 'Messages', 'Permission to toggle status and reply to inquiries', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Delete Messages', 'messages.delete', 'Messages', 'Permission to delete messages', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- User & Access Control permissions
('Manage Users', 'users.manage', 'Access Control', 'Permission to invite and manage admin users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Manage Roles', 'roles.manage', 'Access Control', 'Permission to configure roles and permissions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('System Settings', 'settings.manage', 'System', 'Permission to edit general system settings', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

-- 3. Assign All Permissions to 'super-admin' Role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.slug = 'super-admin'
ON CONFLICT DO NOTHING;

-- 4. Assign Standard Operational Permissions to 'admin' Role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.slug IN (
    'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
    'skills.view', 'skills.create', 'skills.edit', 'skills.delete',
    'messages.view', 'messages.reply'
)
WHERE r.slug = 'admin'
ON CONFLICT DO NOTHING;

-- 5. Assign Content Permissions to 'editor' Role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.slug IN (
    'projects.view', 'projects.create', 'projects.edit',
    'skills.view', 'skills.create', 'skills.edit'
)
WHERE r.slug = 'editor'
ON CONFLICT DO NOTHING;

-- 6. Insert Default Admin User: admin@portfolio.test / password
INSERT INTO users (name, email, password, created_at, updated_at)
VALUES (
    'Portfolio Admin',
    'admin@portfolio.test',
    '$2y$12$eGtwX6u1r9/r039B6F3v7.t03K1P1P8QjV7n/J3D8p1Q7bZzMZy6q', -- bcrypt hash of 'password'
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- 7. Assign 'super-admin' Role to Default Admin User
INSERT INTO user_roles (user_id, role_id, assigned_at)
SELECT u.id, r.id, CURRENT_TIMESTAMP
FROM users u
JOIN roles r ON r.slug = 'super-admin'
WHERE u.email = 'admin@portfolio.test'
ON CONFLICT DO NOTHING;

-- 8. Initial Showcase Projects
INSERT INTO projects (title, slug, category, description, content, image, demo_url, github_url, tags, is_featured, "order", created_at, updated_at)
VALUES 
(
    'Nexus SaaS Cloud Platform',
    'nexus-saas-cloud-platform',
    'Full-Stack Application',
    'A scalable multi-tenant SaaS application built with Laravel and React, featuring subscription billing, analytics, and role-based permissions.',
    'Full architectural overview with micro-services integration, automated reporting, and real-time push events.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://example.com/demo-nexus',
    'https://github.com/example/nexus-platform',
    'Laravel, React, Tailwind CSS, PostgreSQL, Redis',
    TRUE,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Horizon AI Workflow Engine',
    'horizon-ai-workflow-engine',
    'AI & Automation',
    'Automated orchestration platform connecting LLM endpoints to business databases with scheduled execution and audit logs.',
    'Designed with queue workers, telemetry logging, and dynamic prompt engineering components.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://example.com/demo-horizon',
    'https://github.com/example/horizon-ai',
    'Laravel 12, Python, Tailwind, REST API',
    TRUE,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'Aether Interactive Design System',
    'aether-interactive-design-system',
    'Frontend & UI/UX',
    'Component library and interactive design system crafted with responsive tokens, dark mode toggle, and micro-interactions.',
    'Reusable web components built for performance and high-fidelity accessibility.',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    'https://example.com/demo-aether',
    'https://github.com/example/aether-design',
    'Blade, Tailwind CSS, JavaScript, Accessibility',
    FALSE,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO NOTHING;

-- 9. Initial Technical Skills
INSERT INTO skills (name, category, proficiency, icon, "order", created_at, updated_at)
VALUES
('Laravel / PHP', 'Backend', 95, 'server', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('PostgreSQL / MySQL / Redis', 'Backend', 92, 'database', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('RESTful APIs & Webhooks', 'Backend', 90, 'code', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('React 19 & Blade', 'Frontend', 90, 'layout', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tailwind CSS', 'Frontend', 95, 'palette', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JavaScript / TypeScript', 'Frontend', 88, 'code-xml', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Docker & Containerization', 'DevOps & Tools', 85, 'terminal', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('CI/CD & Cloud Infrastructure', 'DevOps & Tools', 82, 'git-branch', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 10. Sample Initial Contact Inquiry
INSERT INTO messages (name, email, subject, message, is_read, created_at, updated_at)
VALUES
(
    'Sarah Jenkins',
    'sarah.j@acmeventures.com',
    'Full-Stack Project Collaboration',
    'Hi! Loved your recent portfolio work, particularly the SaaS architecture. We would love to discuss a consulting opportunity for our upcoming platform.',
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
