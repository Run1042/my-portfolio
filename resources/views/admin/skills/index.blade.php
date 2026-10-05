@extends('layouts.admin')

@section('title', 'Manage Skills & Tech Stack')
@section('page-title', 'Skills & Technologies')

@section('content')
<div class="space-y-8">
    <!-- Add New Skill Form Card -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <h3 class="text-sm font-bold text-white mb-1">Add New Skill</h3>
        <p class="text-xs text-slate-400 mb-5">Expand your portfolio technical proficiency showcase.</p>

        <form action="{{ route('admin.skills.store') }}" method="POST" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            @csrf

            <div>
                <label for="name" class="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Skill Name *</label>
                <input type="text" id="name" name="name" required placeholder="e.g. Next.js, Docker, GraphQL"
                       class="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>

            <div>
                <label for="category" class="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Category *</label>
                <input type="text" id="category" name="category" list="skill-category-list" required placeholder="Frontend, Backend..."
                       class="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <datalist id="skill-category-list">
                    <option value="Frontend">
                    <option value="Backend">
                    <option value="Database">
                    <option value="DevOps & Tools">
                    <option value="Design & Architecture">
                </datalist>
            </div>

            <div>
                <div class="flex items-center justify-between mb-1.5">
                    <label for="proficiency" class="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Proficiency</label>
                    <span id="prof-val" class="text-xs font-mono text-indigo-400 font-bold">85%</span>
                </div>
                <input type="range" id="proficiency" name="proficiency" min="10" max="100" value="85"
                       oninput="document.getElementById('prof-val').innerText = this.value + '%'"
                       class="w-full accent-indigo-500 cursor-pointer">
            </div>

            <div>
                <label for="order" class="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Order</label>
                <input type="number" id="order" name="order" value="0"
                       class="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>

            <div>
                <button type="submit" class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition">
                    + Add Skill
                </button>
            </div>
        </form>
    </div>

    <!-- Grouped Skills List -->
    @if($skillsByCategory->isEmpty())
        <div class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
            <p class="text-sm text-slate-400">No skills added yet. Use the form above to add your first skill.</p>
        </div>
    @else
        <div class="space-y-6">
            @foreach($skillsByCategory as $categoryName => $catSkills)
                <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                    <div class="flex items-center justify-between mb-5 border-b border-slate-800/80 pb-3">
                        <div class="flex items-center gap-2.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                            <h3 class="text-sm font-bold text-white tracking-wide">{{ $categoryName }}</h3>
                        </div>
                        <span class="text-xs text-slate-500">{{ count($catSkills) }} skills</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        @foreach($catSkills as $skill)
                            <div class="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl relative group hover:border-slate-700 transition">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-semibold text-white group-hover:text-indigo-300 transition">{{ $skill->name }}</span>
                                    <span class="text-xs font-mono text-indigo-400 font-bold">{{ $skill->proficiency }}%</span>
                                </div>

                                <!-- Progress Bar -->
                                <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
                                    <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style="width: {{ $skill->proficiency }}%"></div>
                                </div>

                                <!-- Actions row -->
                                <div class="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-900">
                                    <span>Order: {{ $skill->order }}</span>
                                    <div class="flex items-center gap-2">
                                        <!-- Quick Edit Dialog/Toggle -->
                                        <button onclick="editSkill({{ $skill->id }}, '{{ addslashes($skill->name) }}', '{{ addslashes($skill->category) }}', {{ $skill->proficiency }}, {{ $skill->order }})"
                                                class="text-slate-400 hover:text-indigo-400 transition" title="Edit">
                                            Edit
                                        </button>
                                        <span>•</span>
                                        <form action="{{ route('admin.skills.destroy', $skill) }}" method="POST" onsubmit="return confirm('Delete this skill?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-slate-400 hover:text-rose-400 transition" title="Delete">
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</div>

<!-- Edit Skill Modal -->
<div id="edit-modal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-white">Edit Skill</h4>
            <button onclick="closeEditModal()" class="text-slate-400 hover:text-white">&times;</button>
        </div>

        <form id="edit-skill-form" method="POST" class="space-y-4">
            @csrf
            @method('PUT')

            <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Skill Name</label>
                <input type="text" id="edit-name" name="name" required
                       class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Category</label>
                <input type="text" id="edit-category" name="category" required
                       class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
            </div>

            <div>
                <div class="flex items-center justify-between mb-1">
                    <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Proficiency</label>
                    <span id="edit-prof-val" class="text-xs font-mono text-indigo-400 font-bold"></span>
                </div>
                <input type="range" id="edit-proficiency" name="proficiency" min="10" max="100"
                       oninput="document.getElementById('edit-prof-val').innerText = this.value + '%'"
                       class="w-full accent-indigo-500 cursor-pointer">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Order</label>
                <input type="number" id="edit-order" name="order"
                       class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" onclick="closeEditModal()" class="px-4 py-2 border border-slate-800 text-xs font-semibold text-slate-400 rounded-xl hover:text-white">Cancel</button>
                <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl">Save Changes</button>
            </div>
        </form>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function editSkill(id, name, category, proficiency, order) {
        document.getElementById('edit-skill-form').action = '/admin/skills/' + id;
        document.getElementById('edit-name').value = name;
        document.getElementById('edit-category').value = category;
        document.getElementById('edit-proficiency').value = proficiency;
        document.getElementById('edit-prof-val').innerText = proficiency + '%';
        document.getElementById('edit-order').value = order;
        document.getElementById('edit-modal').classList.remove('hidden');
    }

    function closeEditModal() {
        document.getElementById('edit-modal').classList.add('hidden');
    }
</script>
@endpush
