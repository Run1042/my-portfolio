<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Permission;
use App\Models\Project;
use App\Models\Role;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles
        $superAdminRole = Role::firstOrCreate(
            ['slug' => 'super-admin'],
            ['name' => 'Super Administrator', 'description' => 'Unrestricted access', 'is_system' => true]
        );

        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator', 'description' => 'Manage projects, skills, and messages', 'is_system' => true]
        );

        $editorRole = Role::firstOrCreate(
            ['slug' => 'editor'],
            ['name' => 'Content Editor', 'description' => 'Create and edit projects/skills', 'is_system' => false]
        );

        $viewerRole = Role::firstOrCreate(
            ['slug' => 'viewer'],
            ['name' => 'Viewer', 'description' => 'Read-only access', 'is_system' => false]
        );

        // 2. Granular Permissions
        $permissions = [
            // Projects
            ['name' => 'View Projects', 'slug' => 'projects.view', 'category' => 'Projects'],
            ['name' => 'Create Projects', 'slug' => 'projects.create', 'category' => 'Projects'],
            ['name' => 'Edit Projects', 'slug' => 'projects.edit', 'category' => 'Projects'],
            ['name' => 'Delete Projects', 'slug' => 'projects.delete', 'category' => 'Projects'],

            // Skills
            ['name' => 'View Skills', 'slug' => 'skills.view', 'category' => 'Skills'],
            ['name' => 'Create Skills', 'slug' => 'skills.create', 'category' => 'Skills'],
            ['name' => 'Edit Skills', 'slug' => 'skills.edit', 'category' => 'Skills'],
            ['name' => 'Delete Skills', 'slug' => 'skills.delete', 'category' => 'Skills'],

            // Messages
            ['name' => 'View Messages', 'slug' => 'messages.view', 'category' => 'Messages'],
            ['name' => 'Reply Messages', 'slug' => 'messages.reply', 'category' => 'Messages'],
            ['name' => 'Delete Messages', 'slug' => 'messages.delete', 'category' => 'Messages'],

            // Administration
            ['name' => 'Manage Users', 'slug' => 'users.manage', 'category' => 'Access Control'],
            ['name' => 'Manage Roles', 'slug' => 'roles.manage', 'category' => 'Access Control'],
            ['name' => 'System Settings', 'slug' => 'settings.manage', 'category' => 'System'],
        ];

        $permissionIds = [];
        foreach ($permissions as $p) {
            $perm = Permission::firstOrCreate(['slug' => $p['slug']], $p);
            $permissionIds[$p['slug']] = $perm->id;
        }

        // 3. Assign permissions to roles
        // Super Admin gets all permissions
        $superAdminRole->permissions()->sync(array_values($permissionIds));

        // Admin gets standard operational permissions
        $adminPermissions = [
            $permissionIds['projects.view'], $permissionIds['projects.create'], $permissionIds['projects.edit'], $permissionIds['projects.delete'],
            $permissionIds['skills.view'], $permissionIds['skills.create'], $permissionIds['skills.edit'], $permissionIds['skills.delete'],
            $permissionIds['messages.view'], $permissionIds['messages.reply']
        ];
        $adminRole->permissions()->sync($adminPermissions);

        // Editor gets content editing
        $editorPermissions = [
            $permissionIds['projects.view'], $permissionIds['projects.create'], $permissionIds['projects.edit'],
            $permissionIds['skills.view'], $permissionIds['skills.create'], $permissionIds['skills.edit']
        ];
        $editorRole->permissions()->sync($editorPermissions);

        // 4. Create Default Admin User & Assign super-admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@portfolio.test'],
            [
                'name' => 'Portfolio Admin',
                'password' => Hash::make('password'),
            ]
        );
        $admin->assignRole('super-admin');

        // 5. Seed Sample Projects if empty
        if (Project::count() === 0) {
            Project::create([
                'title' => 'Nexus SaaS Cloud Platform',
                'slug' => 'nexus-saas-cloud-platform',
                'category' => 'Full-Stack Application',
                'description' => 'A scalable multi-tenant SaaS application built with Laravel and React, featuring subscription billing, analytics, and role-based permissions.',
                'content' => 'Full architectural overview with micro-services integration, automated reporting, and real-time push events.',
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                'demo_url' => 'https://example.com/demo-nexus',
                'github_url' => 'https://github.com/example/nexus-platform',
                'tags' => 'Laravel, React, Tailwind CSS, PostgreSQL, Redis',
                'is_featured' => true,
                'order' => 1,
            ]);

            Project::create([
                'title' => 'Horizon AI Workflow Engine',
                'slug' => 'horizon-ai-workflow-engine',
                'category' => 'AI & Automation',
                'description' => 'Automated orchestration platform connecting LLM endpoints to business databases with scheduled execution and audit logs.',
                'content' => 'Designed with queue workers, telemetry logging, and dynamic prompt engineering components.',
                'image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                'demo_url' => 'https://example.com/demo-horizon',
                'github_url' => 'https://github.com/example/horizon-ai',
                'tags' => 'Laravel 12, Python, Tailwind, REST API',
                'is_featured' => true,
                'order' => 2,
            ]);

            Project::create([
                'title' => 'Aether Interactive Design System',
                'slug' => 'aether-interactive-design-system',
                'category' => 'Frontend & UI/UX',
                'description' => 'Component library and interactive design system crafted with responsive tokens, dark mode toggle, and micro-interactions.',
                'content' => 'Reusable web components built for performance and high-fidelity accessibility.',
                'image' => 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
                'demo_url' => 'https://example.com/demo-aether',
                'github_url' => 'https://github.com/example/aether-design',
                'tags' => 'Blade, Tailwind CSS, JavaScript, Accessibility',
                'is_featured' => false,
                'order' => 3,
            ]);
        }

        // 6. Seed Sample Skills if empty
        if (Skill::count() === 0) {
            $skills = [
                ['name' => 'Laravel / PHP', 'category' => 'Backend', 'proficiency' => 95, 'icon' => 'server', 'order' => 1],
                ['name' => 'PostgreSQL / MySQL / Redis', 'category' => 'Backend', 'proficiency' => 92, 'icon' => 'database', 'order' => 2],
                ['name' => 'REST APIs & Webhooks', 'category' => 'Backend', 'proficiency' => 90, 'icon' => 'code', 'order' => 3],
                ['name' => 'React 19 & Blade', 'category' => 'Frontend', 'proficiency' => 90, 'icon' => 'layout', 'order' => 4],
                ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'proficiency' => 95, 'icon' => 'palette', 'order' => 5],
                ['name' => 'JavaScript / TypeScript', 'category' => 'Frontend', 'proficiency' => 88, 'icon' => 'code-xml', 'order' => 6],
                ['name' => 'Docker & Containerization', 'category' => 'DevOps & Tools', 'proficiency' => 85, 'icon' => 'terminal', 'order' => 7],
                ['name' => 'CI/CD & Cloud Infrastructure', 'category' => 'DevOps & Tools', 'proficiency' => 82, 'icon' => 'git-branch', 'order' => 8],
            ];

            foreach ($skills as $skill) {
                Skill::create($skill);
            }
        }

        // 7. Seed Sample Messages if empty
        if (Message::count() === 0) {
            Message::create([
                'name' => 'Sarah Jenkins',
                'email' => 'sarah.j@acmeventures.com',
                'subject' => 'Full-Stack Project Collaboration',
                'message' => 'Hi! Loved your recent portfolio work, particularly the SaaS architecture. We would love to discuss a consulting opportunity for our upcoming platform.',
                'is_read' => false,
            ]);

            Message::create([
                'name' => 'Alexander Vance',
                'email' => 'alex@vancedesign.studio',
                'subject' => 'Feedback on Interactive Portfolio',
                'message' => 'Great work on the UI styling and clean structure. Let us know if you are open to contract development for client builds.',
                'is_read' => true,
            ]);
        }
    }
}
