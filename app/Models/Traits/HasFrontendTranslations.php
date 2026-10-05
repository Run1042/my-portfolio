<?php

namespace App\Models\Traits;

use Spatie\Translatable\HasTranslations;

trait HasFrontendTranslations
{
    use HasTranslations;

    public function toArray()
    {
        $attributes = parent::toArray();

        // Always return the localized string so React doesn't crash.
        // Admin API will also receive strings. 
        // We can send X-Locale header from Admin SPA to edit different languages.
        foreach ($this->getTranslatableAttributes() as $field) {
            $rawValue = $this->getRawOriginal($field);
            if (!is_string($rawValue) || !str_starts_with(trim($rawValue), '{')) {
                $attributes[$field] = $rawValue;
                continue;
            }

            $attributes[$field] = $this->getTranslation($field, app()->getLocale(), false) 
                ?: $this->getTranslation($field, config('app.fallback_locale', 'en'), false)
                ?: '';
        }

        return $attributes;
    }
}
