<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="{{ $settings['site_description'] ?? Str::limit($about->bio ?? 'Portfolio of a Full-Stack Engineer showcasing scalable web applications.', 160) }}">
    <title>{{ $settings['site_title'] ?? (($profile->name ?? 'Alex Rivera') . ' - ' . ($profile->title ?? 'Full-Stack Engineer')) }}</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Kantumruy+Pro:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">


    <style>
        body { font-family: 'Plus Jakarta Sans', 'Kantumruy Pro', sans-serif; background-color: #fcfcfd; color: #1e293b; }
        code, pre { font-family: 'JetBrains Mono', monospace; }
        .gradient-text {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero-glow {
            background: radial-gradient(circle at 90% 10%, rgba(224, 187, 255, 0.4), rgba(243, 232, 255, 0.1), transparent 50%);
        }
    </style>

    <!-- Inject initial data for zero-latency React mount -->
    <script>
        window.__INITIAL_DATA__ = {
            profile: @json($profile ?? null),
            about: @json($about ?? null),
            settings: @json($settings ?? null),
            projects: @json($allProjects),
            skills: @json($skills),
            locale: '{{ app()->getLocale() }}',
            translations: {
                en: {
                    about: 'About',
                    projects: 'Projects',
                    skills: 'Skills',
                    contact: 'Contact',
                    admin: 'Admin',
                    letsTalk: "Let's Talk",
                    viewWork: 'View Featured Work',
                    getInTouch: 'Get In Touch',
                    home: 'Home',
                    services: 'Services',
                    reviews: 'Reviews',
                    sendMsg: 'Send Message',
                    name: 'Name',
                    email: 'Email',
                    message: 'Message'
                },
                km: {
                    about: 'អំពីខ្ញុំ',
                    projects: 'គម្រោង',
                    skills: 'ជំនាញ',
                    contact: 'ទំនាក់ទំនង',
                    admin: 'អ្នកគ្រប់គ្រង',
                    letsTalk: "តោះជជែកគ្នា",
                    viewWork: 'មើលគម្រោងលេចធ្លោ',
                    getInTouch: 'ទំនាក់ទំនងមកខ្ញុំ',
                    home: 'ទំព័រដើម',
                    services: 'សេវាកម្ម',
                    reviews: 'មតិអតិថិជន',
                    sendMsg: 'ផ្ញើសារ',
                    name: 'ឈ្មោះ',
                    email: 'អ៊ីមែល',
                    message: 'សារ'
                }
            }
        };
    </script>

    <!-- Vite Assets -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/frontend/App.jsx'])
</head>
<body class="bg-[#fcfcfd] text-slate-800 antialiased selection:bg-purple-600 selection:text-white min-h-screen relative overflow-x-hidden">
    <!-- React Root Mount -->
    <div id="frontend-root">
        <!-- Background Glow Elements (SSR Fallback) -->
        <div class="fixed inset-0 hero-glow pointer-events-none z-0"></div>
        <div class="fixed top-1/4 -right-48 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div class="fixed bottom-1/4 -left-48 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl pointer-events-none z-0"></div>

        <!-- Navigation Header -->
        <header class="sticky top-0 z-40 backdrop-blur-xl bg-[#080b14]/80 border-b border-slate-800/80">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <a href="{{ route('home') }}" class="flex items-center gap-3 group">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition duration-200">
                        &lt;/&gt;
                    </div>
                    <div>
                        <span class="font-bold text-white tracking-tight text-lg block leading-none">{{ explode(' ', $profile->name ?? 'Alex')[0] }}<span class="text-indigo-400">.dev</span></span>
                        <span class="text-[11px] text-slate-400 font-medium tracking-wide">{{ $profile->title ?? 'Full-Stack Engineer' }}</span>
                    </div>
                </a>

                <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <a href="#about" class="hover:text-indigo-400 transition">About</a>
                    <a href="#projects" class="hover:text-indigo-400 transition">Projects</a>
                    <a href="#skills" class="hover:text-indigo-400 transition">Skills</a>
                    <a href="#contact" class="hover:text-indigo-400 transition">Contact</a>
                </nav>

                <div class="flex items-center gap-3">
                    <a href="#contact" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition">
                        Let's Talk
                    </a>
                    <a href="{{ route('lang.switch', app()->getLocale() == 'en' ? 'km' : 'en') }}" class="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl transition hover:bg-slate-700">
                        {{ app()->getLocale() == 'en' ? 'ភាសាខ្មែរ' : 'English' }}
                    </a>
                    <a href="{{ route('admin.dashboard') }}"
                       class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl text-xs font-semibold transition">
                        <span>Admin</span>
                    </a>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section id="about" class="relative z-10 pt-20 pb-24 md:pt-32 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
            @if(!empty($profile->avatar_url))
                <div class="mb-6 flex justify-center">
                    <div class="relative group">
                        <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-indigo-500/40 p-1 bg-indigo-950/40 shadow-2xl shadow-indigo-500/20">
                            <img src="{{ $profile->avatar_url }}" alt="{{ $profile->name ?? 'Avatar' }}" class="w-full h-full object-cover rounded-2xl">
                        </div>
                    </div>
                </div>
            @endif

            @if($profile->status_active ?? true)
                <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md shadow-inner">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{{ $profile->status_badge ?? 'Available for full-time & high-impact contracts' }}</span>
                </div>
            @endif

            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
                {{ $about->headline ?? 'Architecting high-scale web platforms with precision & craft' }}
            </h1>

            <p class="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                {{ $profile->bio ?? $about->bio ?? 'Full-Stack Engineer building robust, fault-tolerant web applications. Focused on Laravel, React, Tailwind CSS, and scalable cloud APIs.' }}
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#projects" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5">
                    View Featured Work &darr;
                </a>
                <a href="#contact" class="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm rounded-2xl transition">
                    Get In Touch
                </a>
            </div>
        </section>
    </div>
</body>
</html>
