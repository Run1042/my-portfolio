<html lang="en" class="h-full dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Portfolio OS - React Admin Dashboard</title>

    <!-- Initialize theme before render to avoid flash -->
    <script>
        try {
            const savedTheme = localStorage.getItem('admin_theme');
            if (savedTheme === 'light') {
                document.documentElement.classList.remove('dark');
            } else {
                document.documentElement.classList.add('dark');
            }
        } catch (e) {}
    </script>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Kantumruy+Pro:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

    <!-- Tailwind CSS (Vite + Standalone fallback) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', '"Kantumruy Pro"', 'sans-serif'],
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
        body { font-family: 'Plus Jakarta Sans', 'Kantumruy Pro', sans-serif; }
        code, pre { font-family: 'JetBrains Mono', monospace; }
    </style>

    <script>
        @php
            $adminUser = auth()->user();
            if ($adminUser) {
                $prof = \App\Models\Profile::first();
                if ($prof) {
                    $adminUser->avatar_url = $prof->avatar_url;
                    $adminUser->profile_title = $prof->title;
                }
            }
        @endphp
        window.__ADMIN_USER__ = @json($adminUser);
    </script>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/admin/App.jsx'])
</head>
<body class="h-full overflow-hidden bg-slate-100 text-slate-800 dark:bg-[#0b0f19] dark:text-slate-200 antialiased selection:bg-indigo-500 selection:text-white">
    <div id="admin-root" class="h-full">
        <!-- Loading state before React loads -->
        <div class="min-h-screen flex items-center justify-center p-6 text-center">
            <div class="space-y-4">
                <div class="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center mx-auto animate-pulse text-indigo-400 font-bold text-lg">
                    &lt;/&gt;
                </div>
                <p class="text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading Admin Dashboard...</p>
            </div>
        </div>
    </div>
</body>
</html>
