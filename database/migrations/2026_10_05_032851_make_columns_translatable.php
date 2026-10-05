<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'projects' => ['title', 'description', 'content'],
            'skills' => ['name'],
            'profiles' => ['name', 'title', 'status_badge', 'location'],
            'abouts' => ['headline', 'bio', 'story'],
            'categories' => ['name', 'description'],
        ];

        foreach ($tables as $table => $columns) {
            foreach ($columns as $column) {
                DB::statement("ALTER TABLE {$table} ALTER COLUMN {$column} DROP DEFAULT");
                DB::statement("ALTER TABLE {$table} ALTER COLUMN {$column} TYPE json USING json_build_object('en', COALESCE({$column}, ''))");
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'projects' => ['title', 'description', 'content'],
            'skills' => ['name'],
            'profiles' => ['name', 'title', 'status_badge', 'location'],
            'abouts' => ['headline', 'bio', 'story'],
            'categories' => ['name', 'description'],
        ];

        foreach ($tables as $table => $columns) {
            foreach ($columns as $column) {
                DB::statement("ALTER TABLE {$table} ALTER COLUMN {$column} TYPE text USING {$column}->>'en'");
            }
        }
    }
};
