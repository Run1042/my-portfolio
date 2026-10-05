<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\Traits\HasFrontendTranslations;

class Category extends Model
{
    use HasFactory, HasFrontendTranslations;

    public $translatable = ['name', 'description'];

    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'icon',
        'color',
        'order',
        'is_active',
    ];

    protected $casts = [
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Skills belonging to this category by name
     */
    public function skills()
    {
        return $this->hasMany(Skill::class, 'category', 'name');
    }

    /**
     * Projects belonging to this category by name
     */
    public function projects()
    {
        return $this->hasMany(Project::class, 'category', 'name');
    }
}
