<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Traits\HasFrontendTranslations;

class About extends Model
{
    use HasFactory, HasFrontendTranslations;

    public $translatable = ['headline', 'bio', 'story'];

    protected $table = 'abouts';

    protected $guarded = ['id'];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public static function defaultData(): array
    {
        return [
            'headline' => 'Architecting high-scale web platforms with precision & craft',
            'bio' => 'Full-Stack Engineer building robust, fault-tolerant web applications. Focused on Laravel, React, Tailwind CSS, and scalable cloud APIs.',
            'story' => 'Passionate about crafting elegant user experiences and rock-solid backend services. Over the last 5+ years, I have architected and deployed mission-critical systems across fintech, SaaS, and e-commerce platforms.',
            'experience_years' => '5+ Years',
            'projects_count' => '30+ Apps',
            'uptime_stat' => '99.9%',
            'satisfaction_stat' => '100%',
            'code_class_name' => 'SeniorFullStackEngineer',
            'code_framework' => 'Laravel 12 / PHP 8.2',
            'code_frontend' => 'React 19 / Tailwind CSS',
            'code_database' => 'PostgreSQL, Redis, SQLite',
        ];
    }
}
