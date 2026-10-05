<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Project;
use App\Models\Skill;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProjects = Project::count();
        $featuredProjects = Project::where('is_featured', true)->count();
        $totalSkills = Skill::count();
        $totalMessages = Message::count();
        $unreadMessages = Message::where('is_read', false)->count();

        $recentProjects = Project::latest()->take(5)->get();
        $recentMessages = Message::latest()->take(5)->get();

        return view('admin.dashboard', compact(
            'totalProjects',
            'featuredProjects',
            'totalSkills',
            'totalMessages',
            'unreadMessages',
            'recentProjects',
            'recentMessages'
        ));
    }
}
