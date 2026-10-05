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
        Schema::create('about_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('Alex Rivera');
            $table->string('title')->default('Full-Stack Engineer & Cloud Architect');
            $table->string('status_badge')->default('Available for full-time & high-impact contracts');
            $table->boolean('status_active')->default(true);
            $table->text('headline')->nullable();
            $table->text('bio')->nullable();
            $table->text('about_text')->nullable();
            $table->string('location')->nullable()->default('Phnom Penh, Cambodia');
            $table->string('avatar_url')->nullable();
            $table->string('resume_url')->nullable();
            $table->string('experience_years')->default('5+ Years');
            $table->string('projects_count')->default('30+ Apps');
            $table->string('uptime_stat')->default('99.9%');
            $table->string('satisfaction_stat')->default('100%');
            $table->string('email')->nullable()->default('alex.rivera@devmail.test');
            $table->string('phone')->nullable();
            $table->string('github_url')->nullable()->default('https://github.com');
            $table->string('linkedin_url')->nullable()->default('https://linkedin.com');
            $table->string('twitter_url')->nullable();
            $table->string('telegram_url')->nullable();
            $table->string('code_class_name')->default('SeniorFullStackEngineer');
            $table->string('code_framework')->default('Laravel 12 / PHP 8.2');
            $table->string('code_frontend')->default('React 19 / Tailwind CSS');
            $table->string('code_database')->default('PostgreSQL, Redis, SQLite');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_profiles');
    }
};
