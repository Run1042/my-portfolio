<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasFrontendTranslations;

class Skill extends Model
{
    use HasFactory, HasFrontendTranslations;

    public $translatable = ['name'];

    protected $fillable = [
        'name',
        'type',
        'category',
        'proficiency',
        'icon',
        'order',
    ];

    protected $casts = [
        'proficiency' => 'integer',
        'order' => 'integer',
    ];

    protected $appends = ['icon_url'];

    public function getIconUrlAttribute(): ?string
    {
        if (!$this->icon) {
            return null;
        }

        if (str_starts_with($this->icon, 'http://') || str_starts_with($this->icon, 'https://') || str_starts_with($this->icon, 'data:')) {
            return $this->icon;
        }

        // Only return asset URL if it's an uploaded file path or has an image extension
        if (str_contains($this->icon, '/') || preg_match('/\.(png|jpe?g|svg|webp|gif|ico)$/i', $this->icon)) {
            return asset('storage/' . $this->icon);
        }

        return null;
    }
}
