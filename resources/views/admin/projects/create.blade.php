@extends('layouts.admin')

@section('title', 'Add New Project')
@section('page-title', 'Create Project')

@section('breadcrumbs')
    <div class="flex items-center gap-2 text-xs text-slate-500">
        <span>/</span>
        <a href="{{ route('admin.projects.index') }}" class="hover:text-slate-300">Projects</a>
        <span>/</span>
        <span class="text-slate-300">New</span>
    </div>
@endsection

@section('content')
<div class="max-w-4xl">
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form action="{{ route('admin.projects.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
            @csrf

            <!-- Basic Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="title" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Project Title *</label>
                    <input type="text" id="title" name="title" value="{{ old('title') }}" required placeholder="e.g. Nexus SaaS Platform"
                           onkeyup="updateSlug(this.value)"
                           class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                </div>

                <div>
                    <label for="slug" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">URL Slug *</label>
                    <input type="text" id="slug" name="slug" value="{{ old('slug') }}" required placeholder="nexus-saas-platform"
                           class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label for="category" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Category *</label>
                    <input type="text" id="category" name="category" list="category-suggestions" value="{{ old('category', 'Full-Stack Application') }}" required
                           class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <datalist id="category-suggestions">
                        <option value="Full-Stack Application">
                        <option value="Frontend & UI/UX">
                        <option value="AI & Machine Learning">
                        <option value="API & Backend Architecture">
                        <option value="Mobile App">
                        <option value="DevOps & Cloud">
                    </datalist>
                </div>

                <div>
                    <label for="order" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Display Order</label>
                    <input type="number" id="order" name="order" value="{{ old('order', 0) }}"
                           class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                </div>

                <div class="flex items-center pt-6">
                    <label class="relative flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" name="is_featured" value="1" {{ old('is_featured') ? 'checked' : '' }}
                               class="w-5 h-5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500">
                        <div>
                            <span class="text-sm font-semibold text-white">Feature on Home</span>
                            <p class="text-xs text-slate-400">Display in top highlighted showcase</p>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Description -->
            <div>
                <label for="description" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Short Description *</label>
                <textarea id="description" name="description" rows="3" required placeholder="A concise summary highlighting the purpose and core highlights..."
                          class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">{{ old('description') }}</textarea>
            </div>

            <!-- Tags -->
            <div>
                <label for="tags" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tech Stack Tags (Comma-separated)</label>
                <input type="text" id="tags" name="tags" value="{{ old('tags') }}" placeholder="Laravel, React, Tailwind CSS, PostgreSQL"
                       class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>

            <!-- URLs -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="demo_url" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Demo / Product URL</label>
                    <input type="url" id="demo_url" name="demo_url" value="{{ old('demo_url') }}" placeholder="https://myproject.com"
                           class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                </div>

                <div>
                    <label for="github_url" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">GitHub / Repository URL</label>
                    <input type="url" id="github_url" name="github_url" value="{{ old('github_url') }}" placeholder="https://github.com/username/project"
                           class="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                </div>
            </div>

            <!-- Image Upload & Preview -->
            <div class="border-t border-slate-800/80 pt-6">
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Project Showcase Image</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div class="space-y-4">
                        <div>
                            <span class="text-xs text-slate-400 block mb-1">Option A: Upload File</span>
                            <input type="file" id="image" name="image" accept="image/*" onchange="previewUploadedImage(event)"
                                   class="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30 file:cursor-pointer">
                        </div>

                        <div>
                            <span class="text-xs text-slate-400 block mb-1">Option B: Image URL (e.g. Unsplash or Cloud)</span>
                            <input type="url" id="image_url" name="image_url" value="{{ old('image_url') }}" onchange="previewUrlImage(this.value)" placeholder="https://images.unsplash.com/..."
                                   class="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        </div>
                    </div>

                    <!-- Live Preview Box -->
                    <div>
                        <span class="text-xs text-slate-400 block mb-1">Preview</span>
                        <div id="image-preview-wrapper" class="w-full h-40 rounded-xl border border-dashed border-slate-800 bg-slate-950/50 flex items-center justify-center overflow-hidden">
                            <img id="image-preview" src="" alt="Preview" class="w-full h-full object-cover hidden">
                            <span id="preview-placeholder" class="text-xs text-slate-500">No image chosen yet</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="border-t border-slate-800/80 pt-6 flex items-center justify-end gap-3">
                <a href="{{ route('admin.projects.index') }}" class="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition">
                    Cancel
                </a>
                <button type="submit" class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition">
                    Save Project
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function updateSlug(title) {
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/[\s_-]+/g, '-');
        document.getElementById('slug').value = slug;
    }

    function previewUploadedImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.getElementById('image-preview');
                const placeholder = document.getElementById('preview-placeholder');
                img.src = e.target.result;
                img.classList.remove('hidden');
                placeholder.classList.add('hidden');
            }
            reader.readAsDataURL(file);
        }
    }

    function previewUrlImage(url) {
        if (url) {
            const img = document.getElementById('image-preview');
            const placeholder = document.getElementById('preview-placeholder');
            img.src = url;
            img.classList.remove('hidden');
            placeholder.classList.add('hidden');
        }
    }
</script>
@endpush
