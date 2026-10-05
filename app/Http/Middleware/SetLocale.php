<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->hasHeader('X-Locale')) {
            app()->setLocale($request->header('X-Locale'));
        } elseif ($request->has('locale')) {
            app()->setLocale($request->get('locale'));
        } elseif (session()->has('locale')) {
            app()->setLocale(session()->get('locale'));
        }

        return $next($request);
    }
}
