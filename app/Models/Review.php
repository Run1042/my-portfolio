<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasFrontendTranslations;

class Review extends Model
{
    use HasFactory, HasFrontendTranslations;

    public $translatable = ['role', 'message'];
    protected $fillable = [
        'name', 'role', 'rating', 'message', 'is_published', 'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'rating'       => 'integer',
        'sort_order'   => 'integer',
    ];

}
