<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request)
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

        if ($category) {
            $query->where('category', $category);
        }

        $projects = $query->orderBy('order', 'asc')->latest()->paginate(10)->withQueryString();
        $categories = Project::select('category')->distinct()->pluck('category');

        return view('admin.projects.index', compact('projects', 'categories', 'search', 'category'));
    }

    public function create()
    {
        return view('admin.projects.create');
    }

    public function store(Request $request)
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
        // Ensure uniqueness if slug generated from title conflicts
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

        Project::create([
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

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project created successfully!');
    }

    public function edit(Project $project)
    {
        return view('admin.projects.edit', compact('project'));
    }

    public function update(Request $request, Project $project)
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

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project updated successfully!');
    }

    public function destroy(Project $project)
    {
        if ($project->image && !str_starts_with($project->image, 'http') && Storage::disk('public')->exists($project->image)) {
            Storage::disk('public')->delete($project->image);
        }

        $project->delete();

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
