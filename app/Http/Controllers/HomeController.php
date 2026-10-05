<?php

namespace App\Http\Controllers;

use App\Models\About;
use App\Models\Message;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Review;
use App\Models\Setting;
use App\Models\Skill;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $profile = Profile::getOrCreateCurrent();
        $about = $profile->about ?: About::first();
        $settings = Setting::getAllSettings();

        $featuredProjects = Project::where('is_featured', true)
            ->orderBy('order')
            ->latest()
            ->get();

        $allProjects = Project::orderBy('order')
            ->latest()
            ->get()
            ->map(function ($project) {
                // Ensure image_url is appended for frontend consumption
                $project->image_url = $project->image_url;
                $project->tags_list = $project->tags_list;
                return $project;
            });

        $skills = Skill::orderBy('order')->get();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'profile' => $profile,
                'about' => $about,
                'settings' => $settings,
                'featured_projects' => $featuredProjects,
                'projects' => $allProjects,
                'skills' => $skills,
            ]);
        }

        return view('portfolio', compact('profile', 'about', 'settings', 'featuredProjects', 'allProjects', 'skills'));
    }

    public function apiData()
    {
        $profile = Profile::getOrCreateCurrent();
        $about = $profile->about ?: About::first();
        $settings = Setting::getAllSettings();

        $projects = Project::orderBy('order')->latest()->get()->map(function ($project) {
            $project->image_url = $project->image_url;
            $project->tags_list = $project->tags_list;
            return $project;
        });

        $skills = Skill::orderBy('order')->get();

        return response()->json([
            'profile' => $profile,
            'about' => $about,
            'settings' => $settings,
            'projects' => $projects,
            'skills' => $skills,
        ]);
    }

    public function contact(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['nullable', 'string', 'max:200'],
            'message' => ['required', 'string', 'max:3000'],
        ]);

        $msg = Message::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'] ?? 'Website Inquiry',
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Thank you! Your message has been received. I will get back to you shortly.',
                'data' => $msg,
            ]);
        }

        return back()->with('contact_success', 'Thank you! Your message has been received. I will get back to you shortly.');
    }

    public function getReviews()
    {
        $reviews = Review::where('is_published', true)
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }
}
