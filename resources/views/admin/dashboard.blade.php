@extends('layouts.admin')

@section('title', 'Admin Dashboard')
@section('page-title', 'Portfolio Control Center')

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
<div class="space-y-8">
    <!-- Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <!-- Total Projects -->
        <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700/80 transition">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Projects</span>
                <span class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                </span>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
                <span class="text-3xl font-bold text-white">{{ $totalProjects }}</span>
                <a href="{{ route('admin.projects.index') }}" class="text-xs font-medium text-indigo-400 hover:text-indigo-300">View all &rarr;</a>
            </div>
        </div>

        <!-- Featured Projects -->
        <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700/80 transition">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Featured Projects</span>
                <span class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                </span>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
                <span class="text-3xl font-bold text-white">{{ $featuredProjects }}</span>
                <span class="text-xs text-slate-400">Highlighted on home</span>
            </div>
        </div>

        <!-- Skills & Tech Stack -->
        <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700/80 transition">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills Active</span>
                <span class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                </span>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
                <span class="text-3xl font-bold text-white">{{ $totalSkills }}</span>
                <a href="{{ route('admin.skills.index') }}" class="text-xs font-medium text-purple-400 hover:text-purple-300">Manage &rarr;</a>
            </div>
        </div>

        <!-- Inbox Messages -->
        <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700/80 transition">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inbox Inquiries</span>
                <span class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                </span>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
                <span class="text-3xl font-bold text-white">{{ $totalMessages }}</span>
                @if($unreadMessages > 0)
                    <span class="text-xs bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-500/30">
                        {{ $unreadMessages }} unread
                    </span>
                @else
                    <span class="text-xs text-slate-500">All caught up</span>
                @endif
            </div>
        </div>
    </div>

    <!-- Quick Actions Banner -->
    <div class="bg-gradient-to-r from-indigo-900/30 via-slate-900 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-base font-bold text-white">Quick Management</h2>
            <p class="text-xs text-slate-400 mt-0.5">Seamlessly update your portfolio showcase, adjust skills, or respond to clients.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
            <a href="{{ route('admin.projects.create') }}" class="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition">
                + Add Project
            </a>
            <a href="{{ route('admin.skills.index') }}" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition">
                + Add Skill
            </a>
            <a href="{{ route('home') }}" target="_blank" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition">
                View Site ↗
            </a>
        </div>
    </div>

    <!-- Two-column: Recent Projects & Recent Messages -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Projects -->
        <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-white">Recent Projects</h3>
                <a href="{{ route('admin.projects.index') }}" class="text-xs font-medium text-indigo-400 hover:text-indigo-300">View all &rarr;</a>
            </div>

            @if($recentProjects->isEmpty())
                <div class="text-center py-8 text-slate-500 text-xs">
                    No projects found. Click "New Project" to showcase your first work!
                </div>
            @else
                <div class="divide-y divide-slate-800/80">
                    @foreach($recentProjects as $project)
                        <div class="py-3 flex items-center justify-between group">
                            <div class="flex items-center gap-3.5 min-w-0">
                                @if($project->image_url)
                                    <img src="{{ $project->image_url }}" alt="{{ $project->title }}" class="w-11 h-11 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0">
                                @else
                                    <div class="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0 text-xs font-mono">
                                        &lt;/&gt;
                                    </div>
                                @endif
                                <div class="min-w-0">
                                    <p class="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition">{{ $project->title }}</p>
                                    <p class="text-xs text-slate-400 truncate">{{ $project->category }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 shrink-0 ml-4">
                                @if($project->is_featured)
                                    <span class="text-[10px] bg-amber-500/10 text-amber-400 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">Featured</span>
                                @endif
                                <a href="{{ route('admin.projects.edit', $project) }}" class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        <!-- Recent Contact Messages -->
        <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-white">Recent Messages</h3>
                <a href="{{ route('admin.messages.index') }}" class="text-xs font-medium text-indigo-400 hover:text-indigo-300">View inbox &rarr;</a>
            </div>

            @if($recentMessages->isEmpty())
                <div class="text-center py-8 text-slate-500 text-xs">
                    No messages received yet. Messages sent via the portfolio contact form will appear here!
                </div>
            @else
                <div class="divide-y divide-slate-800/80">
                    @foreach($recentMessages as $msg)
                        <div class="py-3 flex items-start justify-between group">
                            <div class="min-w-0 pr-3">
                                <div class="flex items-center gap-2">
                                    @if(!$msg->is_read)
                                        <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                                    @endif
                                    <p class="text-sm font-semibold text-white truncate">{{ $msg->name }}</p>
                                    <span class="text-[11px] text-slate-500">{{ $msg->created_at->diffForHumans() }}</span>
                                </div>
                                <p class="text-xs font-medium text-slate-300 truncate mt-0.5">{{ $msg->subject }}</p>
                                <p class="text-xs text-slate-400 truncate mt-0.5">{{ Str::limit($msg->message, 80) }}</p>
                            </div>
                            <a href="{{ route('admin.messages.show', $msg) }}"
                               class="shrink-0 text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 rounded-lg transition">
                                Read
                            </a>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
