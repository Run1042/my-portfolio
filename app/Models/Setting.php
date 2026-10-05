<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
    ];

    /**
     * Default system settings dictionary.
     */
    public static function defaults(): array
    {
        return [
            // General
            'site_title' => ['value' => 'Alex Rivera | Senior Full-Stack Engineer', 'group' => 'general', 'type' => 'string'],
            'site_tagline' => ['value' => 'Architecting high-scale web platforms with precision & craft', 'group' => 'general', 'type' => 'string'],
            'brand_name' => ['value' => 'Alex.dev', 'group' => 'general', 'type' => 'string'],
            'footer_copyright' => ['value' => 'Alex Rivera. All rights reserved.', 'group' => 'general', 'type' => 'string'],
            'maintenance_mode' => ['value' => '0', 'group' => 'general', 'type' => 'boolean'],
            'maintenance_message' => ['value' => 'Portfolio is undergoing scheduled enhancements. Please check back shortly.', 'group' => 'general', 'type' => 'string'],

            // SEO & Social
            'site_description' => ['value' => 'Portfolio showcasing production-grade Laravel & React web applications, scalable APIs, and cloud architecture.', 'group' => 'seo', 'type' => 'string'],
            'site_keywords' => ['value' => 'Laravel 12, React 19, PHP 8.2, Full-Stack, Tailwind CSS, PostgreSQL, Cloud Architecture, APIs', 'group' => 'seo', 'type' => 'string'],
            'allow_search_indexing' => ['value' => '1', 'group' => 'seo', 'type' => 'boolean'],
            'canonical_url' => ['value' => 'https://alexrivera.dev', 'group' => 'seo', 'type' => 'string'],
            'google_analytics_id' => ['value' => '', 'group' => 'seo', 'type' => 'string'],
            'og_image_url' => ['value' => '', 'group' => 'seo', 'type' => 'string'],

            // Contact & Inquiries
            'notification_email' => ['value' => 'alex.rivera@devmail.test', 'group' => 'contact', 'type' => 'string'],
            'enable_email_alerts' => ['value' => '1', 'group' => 'contact', 'type' => 'boolean'],
            'enable_contact_form' => ['value' => '1', 'group' => 'contact', 'type' => 'boolean'],
            'enable_honeypot' => ['value' => '1', 'group' => 'contact', 'type' => 'boolean'],
            'max_message_length' => ['value' => '3000', 'group' => 'contact', 'type' => 'integer'],

            // Appearance & Localization
            'default_theme' => ['value' => 'dark', 'group' => 'appearance', 'type' => 'string'],
            'accent_color' => ['value' => 'indigo', 'group' => 'appearance', 'type' => 'string'],
            'default_language' => ['value' => 'en', 'group' => 'appearance', 'type' => 'string'],
            'date_format' => ['value' => 'YYYY-MM-DD', 'group' => 'appearance', 'type' => 'string'],
        ];
    }

    /**
     * Retrieve casted setting value.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        return static::castValue($setting->value, $setting->type);
    }

    /**
     * Set a setting value.
     */
    public static function set(string $key, mixed $value, string $group = 'general', string $type = 'string'): static
    {
        $raw = is_bool($value) ? ($value ? '1' : '0') : (is_array($value) ? json_encode($value) : (string) $value);

        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $raw, 'group' => $group, 'type' => $type]
        );
    }

    /**
     * Get all settings as a key-value associative dictionary, seeding defaults if table is empty.
     */
    public static function getAllSettings(): array
    {
        if (static::count() === 0) {
            static::seedDefaults();
        }

        $all = static::all();
        $result = [];
        foreach ($all as $item) {
            $result[$item->key] = static::castValue($item->value, $item->type);
        }

        return $result;
    }

    /**
     * Seed defaults if not present.
     */
    public static function seedDefaults(): void
    {
        foreach (static::defaults() as $key => $meta) {
            static::firstOrCreate(
                ['key' => $key],
                [
                    'value' => $meta['value'],
                    'group' => $meta['group'],
                    'type' => $meta['type'],
                ]
            );
        }
    }

    /**
     * Cast raw string value based on type definition.
     */
    protected static function castValue(?string $value, string $type): mixed
    {
        if ($value === null) {
            return null;
        }

        return match ($type) {
            'boolean', 'bool' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer', 'int' => (int) $value,
            'json', 'array' => json_decode($value, true) ?: [],
            default => $value,
        };
    }
}
