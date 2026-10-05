<?php

use App\Http\Controllers\Admin\ApiController as AdminApiController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

// Public Portfolio Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/api/portfolio-data', [HomeController::class, 'apiData'])->name('api.portfolio');
Route::get('/api/reviews', [HomeController::class, 'getReviews'])->name('api.reviews');
Route::post('/contact', [HomeController::class, 'contact'])->name('contact.send');

Route::get('lang/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'km'])) {
        session()->put('locale', $locale);
    }
    return redirect()->back();
})->name('lang.switch');

// Admin API Routes (JSON for React Admin SPA)
Route::prefix('admin/api')->group(function () {
    Route::post('/login', [AdminApiController::class, 'login']);

    Route::middleware('auth')->group(function () {
        Route::get('/dashboard', [AdminApiController::class, 'dashboard']);
        Route::post('/logout', [AdminApiController::class, 'logout']);

        // About & Profile
        Route::get('/about', [AdminApiController::class, 'getAbout']);
        Route::post('/about', [AdminApiController::class, 'updateAbout']);

        // Projects
        Route::get('/projects', [AdminApiController::class, 'getProjects']);
        Route::post('/projects', [AdminApiController::class, 'storeProject']);
        Route::put('/projects/{project}', [AdminApiController::class, 'updateProject']);
        Route::delete('/projects/{project}', [AdminApiController::class, 'destroyProject']);

        // Skills
        Route::get('/skills', [AdminApiController::class, 'getSkills']);
        Route::post('/skills', [AdminApiController::class, 'storeSkill']);
        Route::put('/skills/{skill}', [AdminApiController::class, 'updateSkill']);
        Route::delete('/skills/{skill}', [AdminApiController::class, 'destroySkill']);

        // Messages
        Route::get('/messages', [AdminApiController::class, 'getMessages']);
        Route::patch('/messages/{message}/toggle-read', [AdminApiController::class, 'toggleReadMessage']);
        Route::delete('/messages/{message}', [AdminApiController::class, 'destroyMessage']);

        // Reviews
        Route::get('/reviews', [AdminApiController::class, 'getReviews']);
        Route::post('/reviews', [AdminApiController::class, 'storeReview']);
        Route::put('/reviews/{review}', [AdminApiController::class, 'updateReview']);
        Route::patch('/reviews/{review}/toggle-publish', [AdminApiController::class, 'togglePublishReview']);
        Route::delete('/reviews/{review}', [AdminApiController::class, 'destroyReview']);

        // Categories
        Route::get('/categories', [AdminApiController::class, 'getCategories']);
        Route::post('/categories', [AdminApiController::class, 'storeCategory']);
        Route::put('/categories/{category}', [AdminApiController::class, 'updateCategory']);
        Route::delete('/categories/{category}', [AdminApiController::class, 'destroyCategory']);

        // Roles & Permissions
        Route::get('/roles', [AdminApiController::class, 'getRoles']);
        Route::get('/permissions', [AdminApiController::class, 'getPermissions']);
        Route::post('/roles', [AdminApiController::class, 'storeRole']);
        Route::put('/roles/{role}', [AdminApiController::class, 'updateRole']);
        Route::delete('/roles/{role}', [AdminApiController::class, 'destroyRole']);

        // Users
        Route::get('/users', [AdminApiController::class, 'getUsers']);
        Route::post('/users', [AdminApiController::class, 'storeUser']);
        Route::put('/users/{user}', [AdminApiController::class, 'updateUser']);
        Route::delete('/users/{user}', [AdminApiController::class, 'destroyUser']);

        // System Settings & Maintenance
        Route::get('/settings', [AdminApiController::class, 'getSettings']);
        Route::post('/settings', [AdminApiController::class, 'updateSettings']);
        Route::post('/settings/clear-cache', [AdminApiController::class, 'clearCache']);
        Route::get('/settings/export', [AdminApiController::class, 'exportData']);
    });
});

// Admin Web Routes & React SPA Container
Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('admin.login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('admin.login.submit');

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

        // All admin page requests render the React Admin SPA
        Route::get('/{any?}', function () {
            return view('admin.spa');
        })->where('any', '.*')->name('admin.dashboard');
    });
});