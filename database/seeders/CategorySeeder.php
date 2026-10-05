<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Frontend',
                'slug' => 'frontend',
                'type' => 'hard_skill',
                'description' => 'User interfaces, client-side web technologies, and interactive SPAs',
                'icon' => 'layout',
                'color' => '#3b82f6',
                'order' => 1,
            ],
            [
                'name' => 'Backend',
                'slug' => 'backend',
                'type' => 'hard_skill',
                'description' => 'Server-side logic, REST APIs, authentication, and core database architecture',
                'icon' => 'server',
                'color' => '#8b5cf6',
                'order' => 2,
            ],
            [
                'name' => 'Database',
                'slug' => 'database',
                'type' => 'hard_skill',
                'description' => 'Relational and NoSQL data storage, indexing, caching, and queries',
                'icon' => 'database',
                'color' => '#10b981',
                'order' => 3,
            ],
            [
                'name' => 'DevOps & Tools',
                'slug' => 'devops-tools',
                'type' => 'hard_skill',
                'description' => 'Docker containerization, CI/CD automated deployment, and cloud servers',
                'icon' => 'terminal',
                'color' => '#f59e0b',
                'order' => 4,
            ],
            [
                'name' => 'Communication',
                'slug' => 'communication',
                'type' => 'soft_skill',
                'description' => 'Cross-functional team alignment, documentation, and stakeholder interaction',
                'icon' => 'message-square',
                'color' => '#0ea5e9',
                'order' => 5,
            ],
            [
                'name' => 'Leadership',
                'slug' => 'leadership',
                'type' => 'soft_skill',
                'description' => 'Sprint management, junior developer mentoring, and agile teamwork',
                'icon' => 'users',
                'color' => '#8b5cf6',
                'order' => 6,
            ],
            [
                'name' => 'Problem Solving',
                'slug' => 'problem-solving',
                'type' => 'soft_skill',
                'description' => 'Analytical thinking, debugging complex distributed systems, and rapid prototyping',
                'icon' => 'brain',
                'color' => '#14b8a6',
                'order' => 7,
            ],
            [
                'name' => 'Full-Stack Application',
                'slug' => 'full-stack-application',
                'type' => 'project',
                'description' => 'Complete web apps featuring both frontend client and backend server components',
                'icon' => 'layers',
                'color' => '#6366f1',
                'order' => 8,
            ],
            [
                'name' => 'AI & Automation',
                'slug' => 'ai-automation',
                'type' => 'project',
                'description' => 'Large Language Model integrations, workflow triggers, and automated telemetry',
                'icon' => 'sparkles',
                'color' => '#ec4899',
                'order' => 9,
            ],
            [
                'name' => 'Frontend & UI/UX',
                'slug' => 'frontend-ui-ux',
                'type' => 'project',
                'description' => 'High-fidelity design systems, component styling, and micro-interactions',
                'icon' => 'palette',
                'color' => '#f43f5e',
                'order' => 10,
            ],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
