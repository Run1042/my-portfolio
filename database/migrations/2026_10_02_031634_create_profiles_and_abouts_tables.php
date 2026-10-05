<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Profiles Table
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name')->default('Alex Rivera');
            $table->string('title')->default('Full-Stack Engineer & Cloud Architect');
            $table->string('status_badge')->default('Available for full-time & high-impact contracts');
            $table->boolean('status_active')->default(true);
            $table->string('email')->nullable()->default('alex.rivera@devmail.test');
            $table->string('phone')->nullable()->default('+855 12 345 678');
            $table->string('location')->nullable()->default('Phnom Penh, Cambodia');
            $table->string('avatar_url')->nullable();
            $table->string('resume_url')->nullable();
            $table->string('github_url')->nullable()->default('https://github.com');
            $table->string('linkedin_url')->nullable()->default('https://linkedin.com');
            $table->string('twitter_url')->nullable()->default('https://x.com');
            $table->string('telegram_url')->nullable()->default('https://t.me/alexdev');
            $table->string('website_url')->nullable();
            $table->timestamps();
        });

        // 2. Abouts Table
        Schema::create('abouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->nullable()->constrained('profiles')->cascadeOnDelete();
            $table->text('headline')->nullable();
            $table->text('bio')->nullable();
            $table->text('story')->nullable();
            $table->string('experience_years')->default('5+ Years');
            $table->string('projects_count')->default('30+ Apps');
            $table->string('uptime_stat')->default('99.9%');
            $table->string('satisfaction_stat')->default('100%');
            $table->string('code_class_name')->default('SeniorFullStackEngineer');
            $table->string('code_framework')->default('Laravel 12 / PHP 8.2');
            $table->string('code_frontend')->default('React 19 / Tailwind CSS');
            $table->string('code_database')->default('PostgreSQL, Redis, SQLite');
            $table->timestamps();
        });

        // Drop redundant single about_profiles if exists
        Schema::dropIfExists('about_profiles');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('abouts');
        Schema::dropIfExists('profiles');
    }
};
