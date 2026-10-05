<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Traits\HasFrontendTranslations;

class Profile extends Model
{
    use HasFactory, HasFrontendTranslations;

    public $translatable = ['name', 'title', 'status_badge', 'location'];

    protected $table = 'profiles';

    protected $guarded = ['id'];

    protected $casts = [
        'status_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function about(): HasOne
    {
        return $this->hasOne(About::class);
    }

    public static function defaultData(): array
    {
        return [
            'name' => 'Alex Rivera',
            'title' => 'Full-Stack Engineer & Cloud Architect',
            'status_badge' => 'Available for full-time & high-impact contracts',
            'status_active' => true,
            'email' => 'alex.rivera@devmail.test',
            'phone' => '+855 12 345 678',
            'location' => 'Phnom Penh, Cambodia',
            'avatar_url' => '',
            'resume_url' => '',
            'github_url' => 'https://github.com',
            'linkedin_url' => 'https://linkedin.com',
            'twitter_url' => 'https://x.com',
            'telegram_url' => 'https://t.me/alexdev',
            'website_url' => 'https://alexrivera.dev',
        ];
    }

    public static function getOrCreateCurrent(): self
    {
        $profile = self::with('about')->first();

        if (!$profile) {
            $user = User::first();
            $profile = self::create(array_merge(self::defaultData(), [
                'user_id' => $user?->id,
            ]));
        }

        if (!$profile->about) {
            About::create(array_merge(About::defaultData(), [
                'profile_id' => $profile->id,
            ]));
            $profile->load('about');
        }

        return $profile;
    }
}
