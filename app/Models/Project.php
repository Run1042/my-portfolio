<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasFrontendTranslations;

class Project extends Model
{
    use HasFactory, HasFrontendTranslations;

    public $translatable = ['title', 'description', 'content'];

    protected $fillable = [
        'title',
        'slug',
        'category',
        'description',
        'content',
        'image',
        'demo_url',
        'github_url',
        'tags',
        'is_featured',
        'order',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'order' => 'integer',
    ];

    public function getTagsListAttribute(): array
    {
        if (empty($this->tags)) {
            return [];
        }
        return array_filter(array_map('trim', explode(',', $this->tags)));
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        return asset('storage/' . $this->image);
    }
}
