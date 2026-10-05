<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-950 text-slate-100">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title', 'Admin Dashboard') - Portfolio Manager</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

    <!-- Tailwind CSS (Vite + Standalone fallback for guaranteed styling) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    },
                    colors: {
                        brand: {
                            50: '#eef2ff',
                            100: '#e0e7ff',
                            400: '#818cf8',
                            500: '#6366f1',
                            600: '#4f46e5',
                            700: '#4338ca',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        code, pre { font-family: 'JetBrains Mono', monospace; }
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="h-screen overflow-hidden bg-[#0b0f19] text-slate-200 antialiased selection:bg-indigo-500 selection:text-white">
    <div class="h-screen flex flex-col md:flex-row overflow-hidden">
        <!-- Sidebar Navigation -->
        <aside class="w-full md:w-64 md:h-screen bg-slate-900/90 border-b md:border-b-0 md:border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between shrink-0 overflow-y-auto">
            <div>
                <!-- Brand Header -->
                <div class="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
                    <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3 group">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition duration-200">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                            </svg>
                        </div>
                        <div>
                            <span class="font-bold text-white tracking-tight text-base block leading-none">Portfolio<span class="text-indigo-400">OS</span></span>
                            <span class="text-[11px] text-slate-400 font-medium tracking-wide">Admin Control</span>
                        </div>
                    </a>
                </div>

                <!-- Navigation Links -->
                <nav class="p-4 space-y-1.5">
                    <a href="{{ route('admin.dashboard') }}"
                       class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 {{ request()->routeIs('admin.dashboard') ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60' }}">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        Dashboard
                    </a>

                    <a href="{{ route('admin.projects.index') }}"
                       class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 {{ request()->routeIs('admin.projects.*') ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60' }}">
                        <span class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                            </svg>
                            Projects
                        </span>
                        <span class="text-xs bg-slate-800 border border-slate-700/60 px-2 py-0.5 rounded-full text-slate-300">
                            {{ \App\Models\Project::count() }}
                        </span>
                    </a>

                    <a href="{{ route('admin.skills.index') }}"
                       class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 {{ request()->routeIs('admin.skills.*') ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60' }}">
                        <span class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                            Skills & Stack
                        </span>
                        <span class="text-xs bg-slate-800 border border-slate-700/60 px-2 py-0.5 rounded-full text-slate-300">
                            {{ \App\Models\Skill::count() }}
                        </span>
                    </a>

                    <a href="{{ route('admin.messages.index') }}"
                       class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 {{ request()->routeIs('admin.messages.*') ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60' }}">
                        <span class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            Messages
                        </span>
                        @php $unread = \App\Models\Message::where('is_read', false)->count(); @endphp
                        @if($unread > 0)
                            <span class="text-xs bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold px-2 py-0.5 rounded-full">
                                {{ $unread }} new
                            </span>
                        @endif
                    </a>
                </nav>
            </div>

            <!-- Footer / User Menu -->
            <div class="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3">
                <a href="{{ route('home') }}" target="_blank"
                   class="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition duration-150 group">
                    <span>View Public Portfolio</span>
                    <svg class="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                </a>

                <div class="flex items-center justify-between pt-2">
                    <div class="flex items-center gap-2.5 overflow-hidden">
                        <div class="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                            {{ substr(auth()->user()->name ?? 'A', 0, 1) }}
                        </div>
                        <div class="truncate">
                            <p class="text-xs font-semibold text-white truncate">{{ auth()->user()->name ?? 'Admin' }}</p>
                            <p class="text-[11px] text-slate-400 truncate">{{ auth()->user()->email ?? '' }}</p>
                        </div>
                    </div>

                    <form action="{{ route('admin.logout') }}" method="POST">
                        @csrf
                        <button type="submit" title="Sign out"
                                class="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition duration-150">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <!-- Top Bar (Permanently fixed at top) -->
            <header class="h-16 shrink-0 bg-slate-900/40 border-b border-slate-800/80 px-6 sm:px-8 flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
                <div class="flex items-center gap-3">
                    <h1 class="text-lg font-bold text-white tracking-tight">@yield('page-title', 'Overview')</h1>
                    @yield('breadcrumbs')
                </div>

                <div class="flex items-center gap-3">
                    @yield('header-actions')
                </div>
            </header>

            <!-- Scrollable Content Area -->
            <div class="flex-1 overflow-y-auto min-w-0">
                <!-- Alerts Banner -->
                <div class="px-6 sm:px-8 pt-6">
                    @if(session('success'))
                        <div class="flex items-center justify-between p-4 mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-sm">
                            <div class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                <span>{{ session('success') }}</span>
                            </div>
                            <button onclick="this.parentElement.remove()" class="text-emerald-400 hover:text-emerald-200">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    @endif

                    @if(session('error'))
                        <div class="flex items-center justify-between p-4 mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-sm">
                            <div class="flex items-center gap-3">
                                <svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                                <span>{{ session('error') }}</span>
                            </div>
                            <button onclick="this.parentElement.remove()" class="text-rose-400 hover:text-rose-200">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    @endif

                    @if($errors->any())
                        <div class="p-4 mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-sm space-y-1">
                            <p class="font-semibold">Please check the form for errors:</p>
                            <ul class="list-disc list-inside space-y-0.5 text-xs text-rose-200">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif
                </div>

                <!-- Page Body -->
                <main class="flex-1 p-6 sm:p-8 pt-0">
                    @yield('content')
                </main>
            </div>
        </div>
    </div>

    @stack('scripts')
</body>
</html>
