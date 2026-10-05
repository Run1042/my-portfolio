<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutProfile extends Model
{
    use HasFactory;

    protected $table = 'about_profiles';

    protected $guarded = ['id'];

    protected $casts = [
        'status_active' => 'boolean',
    ];

    public static function defaultData(): array
    {
        return [
            'name' => 'Alex Rivera',
            'title' => 'Full-Stack Engineer & Cloud Architect',
            'status_badge' => 'Available for full-time & high-impact contracts',
            'status_active' => true,
            'headline' => 'Architecting high-scale web platforms with precision & craft',
            'bio' => 'Full-Stack Engineer building robust, fault-tolerant web applications. Focused on Laravel, React, Tailwind CSS, and scalable cloud APIs.',
            'about_text' => 'Passionate about crafting elegant user experiences and rock-solid backend services. Over the last 5+ years, I have architected and deployed mission-critical systems across fintech, SaaS, and e-commerce platforms.',
            'location' => 'Phnom Penh, Cambodia',
            'avatar_url' => '',
            'resume_url' => '',
            'experience_years' => '5+ Years',
            'projects_count' => '30+ Apps',
            'uptime_stat' => '99.9%',
            'satisfaction_stat' => '100%',
            'email' => 'alex.rivera@devmail.test',
            'phone' => '+855 12 345 678',
            'github_url' => 'https://github.com',
            'linkedin_url' => 'https://linkedin.com',
            'twitter_url' => 'https://x.com',
            'telegram_url' => 'https://t.me/alexdev',
            'code_class_name' => 'SeniorFullStackEngineer',
            'code_framework' => 'Laravel 12 / PHP 8.2',
            'code_frontend' => 'React 19 / Tailwind CSS',
            'code_database' => 'PostgreSQL, Redis, SQLite',
        ];
    }

    public static function getOrCreateCurrent(): self
    {
        return self::firstOrCreate(
            ['id' => 1],
            self::defaultData()
        );
    }
}
