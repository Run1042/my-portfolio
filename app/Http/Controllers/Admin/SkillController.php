<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('category')->orderBy('order', 'asc')->get();
        $skillsByCategory = $skills->groupBy('category');

        return view('admin.skills.index', compact('skills', 'skillsByCategory'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:50'],
            'proficiency' => ['required', 'integer', 'min:1', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'order' => ['nullable', 'integer'],
        ]);

        Skill::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'proficiency' => $validated['proficiency'],
            'icon' => $validated['icon'] ?? null,
            'order' => $validated['order'] ?? 0,
        ]);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill added successfully!');
    }

    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:50'],
            'proficiency' => ['required', 'integer', 'min:1', 'max:100'],
            'icon' => ['nullable', 'string', 'max:50'],
            'order' => ['nullable', 'integer'],
        ]);

        $skill->update([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'proficiency' => $validated['proficiency'],
            'icon' => $validated['icon'] ?? null,
            'order' => $validated['order'] ?? 0,
        ]);

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill updated successfully!');
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();

        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill removed.');
    }
}
