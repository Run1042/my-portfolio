@extends('layouts.admin')

@section('title', 'Manage Projects')
@section('page-title', 'Projects')

@section('header-actions')
    <a href="{{ route('admin.projects.create') }}"
       class="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Project
    </a>
@endsection

@section('content')
<div class="space-y-6">
    <!-- Filter & Search Bar -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form method="GET" action="{{ route('admin.projects.index') }}" class="flex-1 w-full flex flex-col sm:flex-row items-center gap-3">
            <div class="relative w-full sm:w-72">
                <svg class="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input type="text" name="search" value="{{ $search ?? '' }}" placeholder="Search title, tech, description..."
                       class="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>

            <select name="category" onchange="this.form.submit()"
                    class="w-full sm:w-auto px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="">All Categories</option>
                @foreach($categories as $cat)
                    <option value="{{ $cat }}" {{ ($category ?? '') === $cat ? 'selected' : '' }}>{{ $cat }}</option>
                @endforeach
            </select>

            <button type="submit" class="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition">
                Filter
            </button>

            @if(!empty($search) || !empty($category))
                <a href="{{ route('admin.projects.index') }}" class="text-xs text-slate-400 hover:text-white underline">
                    Clear
                </a>
            @endif
        </form>
    </div>

    <!-- Projects Table -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        @if($projects->isEmpty())
            <div class="text-center py-16 px-4">
                <div class="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                </div>
                <h3 class="text-sm font-semibold text-white">No projects found</h3>
                <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Get started by adding your first project showcase to your portfolio.</p>
                <a href="{{ route('admin.projects.create') }}" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition">
                    + Add New Project
                </a>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-slate-950/60 border-b border-slate-800/80 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                        <tr>
                            <th class="py-3.5 px-6">Project</th>
                            <th class="py-3.5 px-6">Category</th>
                            <th class="py-3.5 px-6">Tech Stack</th>
                            <th class="py-3.5 px-6">Featured</th>
                            <th class="py-3.5 px-6">Order</th>
                            <th class="py-3.5 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/80">
                        @foreach($projects as $project)
                            <tr class="hover:bg-slate-800/30 transition">
                                <td class="py-4 px-6">
                                    <div class="flex items-center gap-3.5">
                                        @if($project->image_url)
                                            <img src="{{ $project->image_url }}" alt="{{ $project->title }}" class="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700/80 shrink-0 shadow-sm">
                                        @else
                                            <div class="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-500 shrink-0 text-xs font-mono">
                                                &lt;/&gt;
                                            </div>
                                        @endif
                                        <div class="min-w-0">
                                            <h4 class="font-bold text-white tracking-tight truncate max-w-xs">{{ $project->title }}</h4>
                                            <p class="text-xs text-slate-400 truncate max-w-xs mt-0.5">{{ Str::limit($project->description, 60) }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-4 px-6 text-xs text-slate-300 whitespace-nowrap">
                                    <span class="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300">
                                        {{ $project->category }}
                                    </span>
                                </td>
                                <td class="py-4 px-6 text-xs text-slate-400">
                                    <div class="flex flex-wrap gap-1 max-w-xs">
                                        @forelse($project->tags_list as $tag)
                                            <span class="text-[11px] px-2 py-0.5 bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 rounded-md">
                                                {{ $tag }}
                                            </span>
                                        @empty
                                            <span class="text-slate-600">-</span>
                                        @endforelse
                                    </div>
                                </td>
                                <td class="py-4 px-6 whitespace-nowrap">
                                    @if($project->is_featured)
                                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Featured
                                        </span>
                                    @else
                                        <span class="text-slate-500 text-xs">Standard</span>
                                    @endif
                                </td>
                                <td class="py-4 px-6 text-xs text-slate-300 whitespace-nowrap">
                                    {{ $project->order }}
                                </td>
                                <td class="py-4 px-6 text-right whitespace-nowrap">
                                    <div class="flex items-center justify-end gap-2">
                                        @if($project->demo_url)
                                            <a href="{{ $project->demo_url }}" target="_blank" title="Demo preview"
                                               class="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition">
                                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                </svg>
                                            </a>
                                        @endif

                                        <a href="{{ route('admin.projects.edit', $project) }}" title="Edit project"
                                           class="p-2 text-slate-300 hover:text-indigo-400 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition">
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </a>

                                        <form action="{{ route('admin.projects.destroy', $project) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this project?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" title="Delete project"
                                                    class="p-2 text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10 rounded-lg transition">
                                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            @if($projects->hasPages())
                <div class="p-4 border-t border-slate-800/80">
                    {{ $projects->links() }}
                </div>
            @endif
        @endif
    </div>
</div>
@endsection
