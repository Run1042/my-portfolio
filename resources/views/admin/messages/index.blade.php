@extends('layouts.admin')

@section('title', 'Inbox Messages')
@section('page-title', 'Client Inquiries & Messages')

@section('content')
<div class="space-y-6">
    <!-- Filters & Stats Bar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <!-- Status Tabs -->
        <div class="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <a href="{{ route('admin.messages.index') }}"
               class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition {{ empty($status) ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white' }}">
                All ({{ \App\Models\Message::count() }})
            </a>
            <a href="{{ route('admin.messages.index', ['status' => 'unread']) }}"
               class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 {{ ($status ?? '') === 'unread' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white' }}">
                <span>Unread</span>
                @if($unreadCount > 0)
                    <span class="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span class="text-[10px] {{ ($status ?? '') === 'unread' ? 'text-white' : 'text-rose-400' }}">({{ $unreadCount }})</span>
                @endif
            </a>
            <a href="{{ route('admin.messages.index', ['status' => 'read']) }}"
               class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition {{ ($status ?? '') === 'read' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white' }}">
                Read ({{ \App\Models\Message::where('is_read', true)->count() }})
            </a>
        </div>
    </div>

    <!-- Messages List -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        @if($messages->isEmpty())
            <div class="text-center py-16 px-4">
                <div class="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                </div>
                <h3 class="text-sm font-semibold text-white">No messages in this folder</h3>
                <p class="text-xs text-slate-400 mt-1">When someone fills out the contact form on your portfolio, inquiries appear here.</p>
            </div>
        @else
            <div class="divide-y divide-slate-800/80">
                @foreach($messages as $msg)
                    <div class="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition {{ !$msg->is_read ? 'bg-indigo-950/20' : '' }}">
                        <div class="flex items-start gap-4 min-w-0 flex-1">
                            <!-- Read status indicator -->
                            <div class="pt-1 shrink-0">
                                @if(!$msg->is_read)
                                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500 block shadow-sm shadow-rose-500/50" title="Unread"></span>
                                @else
                                    <span class="w-2.5 h-2.5 rounded-full bg-slate-700 block" title="Read"></span>
                                @endif
                            </div>

                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-2 mb-1">
                                    <span class="text-sm font-bold text-white">{{ $msg->name }}</span>
                                    <span class="text-xs text-slate-400">&lt;{{ $msg->email }}&gt;</span>
                                    <span class="text-[11px] text-slate-500 ml-auto sm:ml-2">{{ $msg->created_at->format('M j, Y • g:i A') }}</span>
                                </div>
                                <h4 class="text-xs font-semibold {{ !$msg->is_read ? 'text-indigo-300 font-bold' : 'text-slate-300' }} truncate mb-1">
                                    {{ $msg->subject ?: '(No Subject)' }}
                                </h4>
                                <p class="text-xs text-slate-400 line-clamp-2">
                                    {{ Str::limit($msg->message, 140) }}
                                </p>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <a href="{{ route('admin.messages.show', $msg) }}"
                               class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition shadow-sm">
                                Open Message
                            </a>

                            <form action="{{ route('admin.messages.toggle-read', $msg) }}" method="POST">
                                @csrf
                                @method('PATCH')
                                <button type="submit" class="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                                        title="{{ $msg->is_read ? 'Mark as Unread' : 'Mark as Read' }}">
                                    @if($msg->is_read)
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m4.179 2.51-4.179-2.51" />
                                        </svg>
                                    @else
                                        <svg class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                    @endif
                                </button>
                            </form>

                            <form action="{{ route('admin.messages.destroy', $msg) }}" method="POST" onsubmit="return confirm('Delete this message?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-500/10 rounded-lg transition" title="Delete">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                @endforeach
            </div>

            @if($messages->hasPages())
                <div class="p-4 border-t border-slate-800/80">
                    {{ $messages->links() }}
                </div>
            @endif
        @endif
    </div>
</div>
@endsection
