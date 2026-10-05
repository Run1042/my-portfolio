<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\Category;
use App\Models\Message;
use App\Models\Permission;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Review;
use App\Models\Role;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ApiController extends Controller
{
    public function dashboard()
    {
        $totalProjects = Project::count();
        $featuredProjects = Project::where('is_featured', true)->count();
        $totalSkills = Skill::count();
        $totalMessages = Message::count();
        $unreadMessages = Message::where('is_read', false)->count();
        $totalRoles = Role::count();
        $totalUsers = User::count();
        $totalReviews = Review::count();
        $totalCategories = Category::count();

        $recentProjects = Project::latest()->take(5)->get()->map(function ($p) {
            $p->image_url = $p->image_url;
            $p->tags_list = $p->tags_list;
            return $p;
        });

        $recentMessages = Message::latest()->take(5)->get();

        // Projects by Category for Donut Chart
        $projectsByCategory = Project::selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'count' => (int) $item->count,
                ];
            });

        // Skills Stack by Category
        $skillsByCategory = Skill::selectRaw('category, count(*) as count, round(avg(proficiency)) as avg_proficiency')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'count' => (int) $item->count,
                    'avg_proficiency' => (int) $item->avg_proficiency,
                ];
            });

        // Real projects created per day (last 14 days)
        $projectsPerDay = Project::selectRaw('DATE(created_at) as date, count(*) as count')
            ->where('created_at', '>=', now()->subDays(13)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date')
            ->toArray();

        // Real messages per day (last 14 days)
        $messagesPerDay = Message::selectRaw('DATE(created_at) as date, count(*) as count')
            ->where('created_at', '>=', now()->subDays(13)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date')
            ->toArray();

        // Build 14-day activity chart from real data
        $traffic7d = [];
        for ($i = 13; $i >= 0; $i--) {
            $dateStr = now()->subDays($i)->format('Y-m-d');
            $label   = now()->subDays($i)->format('M d');
            $traffic7d[] = [
                'date'     => $label,
                'projects' => (int) ($projectsPerDay[$dateStr] ?? 0),
                'messages' => (int) ($messagesPerDay[$dateStr] ?? 0),
            ];
        }

        // Real monthly inquiries from DB (last 6 months)
        $monthlyInquiries = [];
        for ($m = 5; $m >= 0; $m--) {
            $monthStart = now()->subMonths($m)->startOfMonth();
            $monthEnd   = now()->subMonths($m)->endOfMonth();
            $total      = Message::whereBetween('created_at', [$monthStart, $monthEnd])->count();
            $resolved   = Message::whereBetween('created_at', [$monthStart, $monthEnd])->where('is_read', true)->count();
            $monthlyInquiries[] = [
                'month'    => $monthStart->format('M'),
                'year'     => $monthStart->format('Y'),
                'total'    => $total,
                'resolved' => $resolved,
            ];
        }

        // Real activity feed: latest events across projects, messages, reviews
        $activityFeed = collect();
        Project::latest()->take(4)->get()->each(function ($p) use (&$activityFeed) {
            $activityFeed->push(['type' => 'project', 'title' => 'Project added: ' . $p->title, 'subtitle' => $p->category, 'created_at' => $p->created_at]);
        });
        Message::latest()->take(4)->get()->each(function ($msg) use (&$activityFeed) {
            $activityFeed->push(['type' => 'message', 'title' => 'New inquiry from ' . $msg->name, 'subtitle' => $msg->email, 'created_at' => $msg->created_at]);
        });
        Review::latest()->take(3)->get()->each(function ($r) use (&$activityFeed) {
            $activityFeed->push(['type' => 'review', 'title' => 'Review received', 'subtitle' => $r->name ?? 'Anonymous', 'created_at' => $r->created_at]);
        });
        $activityFeed = $activityFeed->sortByDesc('created_at')->take(8)->values()->map(function ($item) {
            $item['time_ago'] = \Carbon\Carbon::parse($item['created_at'])->diffForHumans();
            return $item;
        });

        $user = Auth::user() ? Auth::user()->load('roles') : null;
        if ($user) {
            $profile = Profile::first();
            if ($profile) {
                $user->avatar_url = $profile->avatar_url;
                $user->profile_title = $profile->title;
            }
        }

        return response()->json([
            'user' => $user,
            'stats' => [
                'total_projects'    => $totalProjects,
                'featured_projects' => $featuredProjects,
                'total_skills'      => $totalSkills,
                'total_messages'    => $totalMessages,
                'unread_messages'   => $unreadMessages,
                'total_roles'       => $totalRoles,
                'total_users'       => $totalUsers,
                'total_reviews'     => $totalReviews,
                'total_categories'  => $totalCategories,
            ],
            'recent_projects' => $recentProjects,
            'recent_messages' => $recentMessages,
            'activity_feed'   => $activityFeed,
            'charts' => [
                'traffic_7d'           => $traffic7d,
                'projects_by_category' => $projectsByCategory,
                'skills_by_category'   => $skillsByCategory,
                'monthly_inquiries'    => $monthlyInquiries,
            ],
        ]);
    }

    // Projects CRUD
    public function getProjects(Request $request)
    {
        $search = $request->query('search');
        $category = $request->query('category');

        $query = Project::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%");
            });
        }

        if ($category && $category !== 'All') {
            $query->where('category', $category);
        }

        $projects = $query->orderBy('order', 'asc')->latest()->get()->map(function ($p) {
            $p->image_url = $p->image_url;
            $p->tags_list = $p->tags_list;
            return $p;
        });

        $categories = Project::select('category')->distinct()->pluck('category');

        return response()->json([
            'projects' => $projects,
            'categories' => $categories,
        ]);
    }

    public function storeProject(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'content' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'url', 'max:500'],
            'demo_url' => ['nullable', 'url', 'max:500'],
            'github_url' => ['nullable', 'url', 'max:500'],
            'tags' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer'],
        ]);

        $slug = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);
        $originalSlug = $slug;
        $counter = 1;
        while (Project::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $imagePath = $validated['image_url'] ?? null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('projects', 'public');
        }

        $project = Project::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'category' => $validated['category'],
            'description' => $validated['description'],
            'content' => $validated['content'] ?? null,
            'image' => $imagePath,
            'demo_url' => $validated['demo_url'] ?? null,
            'github_url' => $validated['github_url'] ?? null,
            'tags' => $validated['tags'] ?? null,
            'is_featured' => $request->boolean('is_featured'),
            'order' => $validated['order'] ?? 0,
        ]);

        $project->image_url = $project->image_url;
        $project->tags_list = $project->tags_list;

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully!',
            'project' => $project,
        ]);
    }

    public function updateProject(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:projects,slug,' . $project->id],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'content' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'url', 'max:500'],
            'demo_url' => ['nullable', 'url', 'max:500'],
            'github_url' => ['nullable', 'url', 'max:500'],
            'tags' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer'],
        ]);

        $imagePath = $project->image;
        if ($request->filled('image_url')) {
            $imagePath = $request->input('image_url');
        } elseif ($request->hasFile('image')) {
            if ($project->image && !str_starts_with($project->image, 'http') && Storage::disk('public')->exists($project->image)) {
                Storage::disk('public')->delete($project->image);
            }
            $imagePath = $request->file('image')->store('projects', 'public');
        }

        $project->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['slug']),
            'category' => $validated['category'],
            'description' => $validated['description'],
            'content' => $validated['content'] ?? null,
            'image' => $imagePath,
            'demo_url' => $validated['demo_url'] ?? null,
            'github_url' => $validated['github_url'] ?? null,
            'tags' => $validated['tags'] ?? null,
            'is_featured' => $request->boolean('is_featured'),
            'order' => $validated['order'] ?? 0,
        ]);

        $project->image_url = $project->image_url;
        $project->tags_list = $project->tags_list;

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully!',
            'project' => $project,
        ]);
    }

    public function destroyProject(Project $project)
    {
        if ($project->image && !str_starts_with($project->image, 'http') && Storage::disk('public')->exists($project->image)) {
            Storage::disk('public')->delete($project->image);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
        ]);
    }

    // Skills CRUD
    public function getSkills()
    {
        $skills = Skill::orderBy('category')->orderBy('order', 'asc')->get();
        $skillsByCategory = $skills->groupBy('category');

        return response()->json([
            'skills' => $skills,
            'grouped' => $skillsByCategory,
        ]);
    }

    public function storeSkill(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'type' => ['nullable', 'string', 'in:hard,soft'],
            'category' => ['required', 'string', 'max:50'],
            'proficiency' => ['required', 'integer', 'min:1', 'max:100'],
            'icon' => ['nullable', 'string', 'max:255'],
            'icon_file' => ['nullable', 'image', 'max:2048'],
            'order' => ['nullable', 'integer'],
        ]);

        $iconPath = $validated['icon'] ?? null;
        if ($request->hasFile('icon_file')) {
            $iconPath = $request->file('icon_file')->store('skills', 'public');
        }

        $skill = Skill::create([
            'name' => $validated['name'],
            'type' => $validated['type'] ?? 'hard',
            'category' => $validated['category'],
            'proficiency' => $validated['proficiency'],
            'icon' => $iconPath,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Skill added successfully!',
            'skill' => $skill,
        ]);
    }

    public function updateSkill(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'type' => ['nullable', 'string', 'in:hard,soft'],
            'category' => ['required', 'string', 'max:50'],
            'proficiency' => ['required', 'integer', 'min:1', 'max:100'],
            'icon' => ['nullable', 'string', 'max:255'],
            'icon_file' => ['nullable', 'image', 'max:2048'],
            'order' => ['nullable', 'integer'],
        ]);

        $iconPath = $skill->icon;
        if ($request->hasFile('icon_file')) {
            if ($skill->icon && Storage::disk('public')->exists($skill->icon)) {
                Storage::disk('public')->delete($skill->icon);
            }
            $iconPath = $request->file('icon_file')->store('skills', 'public');
        } elseif ($request->filled('icon')) {
            $iconPath = $request->input('icon');
        }

        $skill->update([
            'name' => $validated['name'],
            'type' => $validated['type'] ?? 'hard',
            'category' => $validated['category'],
            'proficiency' => $validated['proficiency'],
            'icon' => $iconPath,
            'order' => $validated['order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Skill updated successfully!',
            'skill' => $skill,
        ]);
    }

    public function destroySkill(Skill $skill)
    {
        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill removed.',
        ]);
    }

    // Messages
    public function getMessages(Request $request)
    {
        $status = $request->query('status');
        $query = Message::latest();

        if ($status === 'unread') {
            $query->where('is_read', false);
        } elseif ($status === 'read') {
            $query->where('is_read', true);
        }

        $messages = $query->get();
        $unreadCount = Message::where('is_read', false)->count();

        return response()->json([
            'messages' => $messages,
            'unread_count' => $unreadCount,
            'total_count' => Message::count(),
        ]);
    }

    public function toggleReadMessage(Message $message)
    {
        $message->update(['is_read' => !$message->is_read]);

        return response()->json([
            'success' => true,
            'message' => 'Message status updated.',
            'data' => $message,
        ]);
    }

    public function destroyMessage(Message $message)
    {
        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted.',
        ]);
    }

    // -------------------------------------------------------------------------
    // Roles & Permissions Management
    // -------------------------------------------------------------------------
    public function getRoles()
    {
        $roles = Role::with('permissions')->withCount('users')->get();
        $permissions = Permission::all();

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions,
            'permissions_by_category' => $permissions->groupBy('category'),
        ]);
    }

    public function getPermissions()
    {
        return response()->json([
            'permissions' => Permission::all(),
            'grouped' => Permission::all()->groupBy('category'),
        ]);
    }

    public function storeRole(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', 'unique:roles,slug'],
            'description' => ['nullable', 'string', 'max:255'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['slug']),
            'description' => $validated['description'] ?? null,
            'is_system' => false,
        ]);

        if (!empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role created successfully!',
            'role' => $role->load('permissions'),
        ]);
    }

    public function updateRole(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:255'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully!',
            'role' => $role->load('permissions'),
        ]);
    }

    public function destroyRole(Role $role)
    {
        if ($role->is_system) {
            return response()->json([
                'success' => false,
                'message' => 'System roles cannot be deleted.',
            ], 422);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role removed successfully.',
        ]);
    }

    // -------------------------------------------------------------------------
    // Users Management
    // -------------------------------------------------------------------------
    public function getUsers()
    {
        $users = User::with('roles')->get();
        $roles = Role::select('id', 'name', 'slug')->get();

        return response()->json([
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['nullable', 'string', 'exists:roles,slug'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (!empty($validated['role'])) {
            $user->assignRole($validated['role']);
        }

        return response()->json([
            'success' => true,
            'message' => 'User created successfully!',
            'user' => $user->load('roles'),
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['nullable', 'string', 'exists:roles,slug'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        if (isset($validated['role'])) {
            $role = Role::where('slug', $validated['role'])->first();
            if ($role) {
                $user->roles()->sync([$role->id]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully!',
            'user' => $user->load('roles'),
        ]);
    }

    public function destroyUser(User $user)
    {
        if ($user->id === Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User account deleted.',
        ]);
    }

    // About & Profile (backed by profiles & abouts tables)
    public function getAbout()
    {
        $profile = Profile::getOrCreateCurrent();
        $about = $profile->about ?: About::create(array_merge(About::defaultData(), ['profile_id' => $profile->id]));

        return response()->json([
            'success' => true,
            'data' => [
                'profile' => $profile,
                'about' => $about,

                // Profile table data
                'name' => $profile->name,
                'title' => $profile->title,
                'status_badge' => $profile->status_badge,
                'status_active' => (bool) $profile->status_active,
                'email' => $profile->email,
                'phone' => $profile->phone,
                'location' => $profile->location,
                'avatar_url' => $profile->avatar_url,
                'resume_url' => $profile->resume_url,
                'github_url' => $profile->github_url,
                'linkedin_url' => $profile->linkedin_url,
                'twitter_url' => $profile->twitter_url,
                'telegram_url' => $profile->telegram_url,
                'website_url' => $profile->website_url,

                // Abouts table data
                'headline' => $about->headline,
                'bio' => $about->bio,
                'about_text' => $about->story,
                'story' => $about->story,
                'experience_years' => $about->experience_years,
                'projects_count' => $about->projects_count,
                'uptime_stat' => $about->uptime_stat,
                'satisfaction_stat' => $about->satisfaction_stat,
                'code_class_name' => $about->code_class_name,
                'code_framework' => $about->code_framework,
                'code_frontend' => $about->code_frontend,
                'code_database' => $about->code_database,
            ],
        ]);
    }

    public function updateAbout(Request $request)
    {
        $profile = Profile::getOrCreateCurrent();
        $about = $profile->about ?: About::create(array_merge(About::defaultData(), ['profile_id' => $profile->id]));

        $validated = $request->validate([
            // Profile fields
            'name' => ['nullable', 'string', 'max:150'],
            'title' => ['nullable', 'string', 'max:200'],
            'status_badge' => ['nullable', 'string', 'max:255'],
            'status_active' => ['nullable'],
            'email' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'avatar_url' => ['nullable', 'string', 'max:500'],
            'resume_url' => ['nullable', 'string', 'max:500'],
            'github_url' => ['nullable', 'string', 'max:300'],
            'linkedin_url' => ['nullable', 'string', 'max:300'],
            'twitter_url' => ['nullable', 'string', 'max:300'],
            'telegram_url' => ['nullable', 'string', 'max:300'],
            'website_url' => ['nullable', 'string', 'max:300'],

            // About fields
            'headline' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'about_text' => ['nullable', 'string'],
            'story' => ['nullable', 'string'],
            'experience_years' => ['nullable', 'string', 'max:50'],
            'projects_count' => ['nullable', 'string', 'max:50'],
            'uptime_stat' => ['nullable', 'string', 'max:50'],
            'satisfaction_stat' => ['nullable', 'string', 'max:50'],
            'code_class_name' => ['nullable', 'string', 'max:100'],
            'code_framework' => ['nullable', 'string', 'max:100'],
            'code_frontend' => ['nullable', 'string', 'max:100'],
            'code_database' => ['nullable', 'string', 'max:200'],
            'hero_image_url' => ['nullable', 'string', 'max:500'],
            'about_image_url' => ['nullable', 'string', 'max:500'],
        ]);

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = 'avatar_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('avatars', $filename, 'public');
            $validated['avatar_url'] = '/storage/' . $path;
        }

        if ($request->hasFile('hero_image')) {
            $file = $request->file('hero_image');
            $filename = 'hero_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('hero', $filename, 'public');
            $validated['hero_image_url'] = '/storage/' . $path;
        }

        if ($request->hasFile('about_image')) {
            $file = $request->file('about_image');
            $filename = 'about_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('about', $filename, 'public');
            $validated['about_image_url'] = '/storage/' . $path;
        }

        // 1. Update Profile table
        $profileFields = [
            'name', 'title', 'status_badge', 'email', 'phone', 'location',
            'avatar_url', 'resume_url', 'github_url', 'linkedin_url',
            'twitter_url', 'telegram_url', 'website_url',
        ];
        $profileData = [];
        foreach ($profileFields as $f) {
            if (array_key_exists($f, $validated)) {
                $profileData[$f] = $validated[$f];
            }
        }
        if (isset($validated['status_active'])) {
            $profileData['status_active'] = filter_var($validated['status_active'], FILTER_VALIDATE_BOOLEAN);
        }
        if (!empty($profileData)) {
            $profile->update($profileData);
        }

        // Keep current Auth user name in sync if updated
        if (Auth::check() && !empty($validated['name'])) {
            $authUser = Auth::user();
            $authUser->name = $validated['name'];
            $authUser->save();
        }

        // 2. Update About table
        $aboutFields = [
            'headline', 'bio', 'experience_years', 'projects_count',
            'uptime_stat', 'satisfaction_stat', 'code_class_name',
            'code_framework', 'code_frontend', 'code_database', 'hero_image_url', 'about_image_url'
        ];
        $aboutData = [];
        foreach ($aboutFields as $f) {
            if (array_key_exists($f, $validated)) {
                $aboutData[$f] = $validated[$f];
            }
        }
        if (isset($validated['about_text'])) {
            $aboutData['story'] = $validated['about_text'];
        } elseif (isset($validated['story'])) {
            $aboutData['story'] = $validated['story'];
        }
        if (!empty($aboutData)) {
            $about->update($aboutData);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile and About data updated successfully in database!',
            'data' => [
                'profile' => $profile->fresh(),
                'about' => $about->fresh(),
                'avatar_url' => $profile->avatar_url,
            ],
        ]);
    }

    // Auth actions
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return response()->json([
                'success' => true,
                'user' => Auth::user(),
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid email or password.',
        ], 422);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
        ]);
    }

    // System Settings
    public function getSettings()
    {
        $settings = Setting::getAllSettings();

        $system = [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'database_driver' => config('database.default', 'pgsql'),
            'server_os' => PHP_OS,
            'environment' => app()->environment(),
            'debug_mode' => (bool) config('app.debug'),
            'timezone' => config('app.timezone', 'UTC'),
            'cache_driver' => config('cache.default', 'database'),
            'server_time' => now()->toIso8601String(),
        ];

        return response()->json([
            'success' => true,
            'settings' => $settings,
            'system' => $system,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $payload = $request->input('settings', $request->all());
        $defaults = Setting::defaults();

        foreach ($payload as $key => $value) {
            if (isset($defaults[$key])) {
                $group = $defaults[$key]['group'];
                $type = $defaults[$key]['type'];
                Setting::set($key, $value, $group, $type);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'System settings saved successfully!',
            'settings' => Setting::getAllSettings(),
        ]);
    }

    public function clearCache()
    {
        try {
            Artisan::call('cache:clear');
            Artisan::call('view:clear');
            Artisan::call('config:clear');

            return response()->json([
                'success' => true,
                'message' => 'Application, configuration, and view cache cleared successfully!',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cache clear error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function exportData()
    {
        $profile = Profile::with('about')->first();
        $projects = Project::orderBy('order')->get();
        $skills = Skill::orderBy('order')->get();
        $messages = Message::latest()->get();
        $settings = Setting::getAllSettings();

        $data = [
            'exported_at' => now()->toIso8601String(),
            'app_version' => '1.0.0',
            'profile' => $profile,
            'projects' => $projects,
            'skills' => $skills,
            'messages_count' => $messages->count(),
            'settings' => $settings,
        ];

        return response()->json($data, 200, [
            'Content-Disposition' => 'attachment; filename="portfolio-backup-' . date('Y-m-d-His') . '.json"',
        ]);
    }
    // ── Reviews ─────────────────────────────────────────────
    public function getReviews()
    {
        return response()->json(
            Review::orderBy('sort_order')->orderBy('created_at', 'desc')->get()
        );
    }

    public function storeReview(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:100',
            'role'         => 'nullable|string|max:100',
            'rating'       => 'required|integer|min:1|max:5',
            'message'      => 'required|string|max:1000',
            'is_published' => 'nullable|boolean',
            'sort_order'   => 'nullable|integer',
        ]);
        $data['is_published'] = $request->boolean('is_published', true);
        $data['sort_order']   = $data['sort_order'] ?? 0;
        $review = Review::create($data);
        return response()->json($review, 201);
    }

    public function updateReview(Request $request, Review $review)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:100',
            'role'         => 'nullable|string|max:100',
            'rating'       => 'required|integer|min:1|max:5',
            'message'      => 'required|string|max:1000',
            'is_published' => 'nullable|boolean',
            'sort_order'   => 'nullable|integer',
        ]);
        $data['is_published'] = $request->boolean('is_published', true);
        $data['sort_order']   = $data['sort_order'] ?? $review->sort_order;
        $review->update($data);
        return response()->json($review);
    }

    public function togglePublishReview(Review $review)
    {
        $review->update(['is_published' => !$review->is_published]);
        return response()->json($review);
    }

    public function destroyReview(Review $review)
    {
        $review->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // ── Categories ──────────────────────────────────────────
    public function getCategories(Request $request)
    {
        $query = Category::orderBy('order');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $categories = $query->get();
        
        $skillCounts = \App\Models\Skill::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category');
        $projectCounts = \App\Models\Project::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category');

        $categories->each(function ($cat) use ($skillCounts, $projectCounts) {
            $rawName = $cat->getRawOriginal('name');
            $nameObj = json_decode($rawName, true);
            $enName = is_array($nameObj) ? ($nameObj['en'] ?? $cat->name) : $rawName;
            
            $cat->skills_count = $skillCounts->get($enName, 0);
            $cat->projects_count = $projectCounts->get($enName, 0);
        });

        return response()->json($categories);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'type' => ['required', 'string', 'in:skill,project,hard_skill,soft_skill'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:50'],
            'order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $slugCandidate = Str::slug($validated['name']);
        $originalSlug = $slugCandidate;
        $count = 1;
        while (Category::where('slug', $slugCandidate)->exists()) {
            $slugCandidate = "{$originalSlug}-{$count}";
            $count++;
        }
        $validated['slug'] = $slugCandidate;
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['order'] = $validated['order'] ?? 0;

        $category = Category::create($validated);
        $category->skills_count = 0;
        $category->projects_count = 0;

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully!',
            'category' => $category,
        ], 201);
    }

    public function updateCategory(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'type' => ['required', 'string', 'in:skill,project,hard_skill,soft_skill'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:50'],
            'order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($category->name !== $validated['name']) {
            $newSlug = Str::slug($validated['name']);
            $count = 1;
            $slugCandidate = $newSlug;
            while (Category::where('slug', $slugCandidate)->where('id', '!=', $category->id)->exists()) {
                $slugCandidate = "{$newSlug}-{$count}";
                $count++;
            }
            $validated['slug'] = $slugCandidate;
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['order'] = $validated['order'] ?? $category->order;

        $category->update($validated);
        
        $rawName = $category->getRawOriginal('name');
        $nameObj = json_decode($rawName, true);
        $enName = is_array($nameObj) ? ($nameObj['en'] ?? $category->name) : $rawName;

        $category->skills_count = \App\Models\Skill::where('category', $enName)->count();
        $category->projects_count = \App\Models\Project::where('category', $enName)->count();

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully!',
            'category' => $category,
        ]);
    }

    public function destroyCategory(Category $category)
    {
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully!',
        ]);
    }
}
