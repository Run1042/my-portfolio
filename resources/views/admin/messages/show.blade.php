@extends('layouts.admin')

@section('title', 'Message from ' . $message->name)
@section('page-title', 'Message Details')

@section('breadcrumbs')
    <div class="flex items-center gap-2 text-xs text-slate-500">
        <span>/</span>
        <a href="{{ route('admin.messages.index') }}" class="hover:text-slate-300">Messages</a>
        <span>/</span>
        <span class="text-slate-300 truncate max-w-xs">{{ $message->subject ?: 'Message' }}</span>
    </div>
@endsection

@section('header-actions')
    <a href="{{ route('admin.messages.index') }}"
       class="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition">
        &larr; Back to Inbox
    </a>
@endsection

@section('content')
<div class="max-w-3xl">
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <!-- Message Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                    {{ substr($message->name, 0, 1) }}
                </div>
                <div>
                    <h3 class="text-base font-bold text-white">{{ $message->name }}</h3>
                    <p class="text-xs text-indigo-400 font-mono">{{ $message->email }}</p>
                </div>
            </div>

            <div class="text-right sm:text-right">
                <span class="text-xs text-slate-400 block">{{ $message->created_at->format('l, F j, Y \a\t g:i A') }}</span>
                <span class="text-[11px] text-slate-500">({{ $message->created_at->diffForHumans() }})</span>
            </div>
        </div>

        <!-- Subject Line -->
        <div>
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Subject</span>
            <h2 class="text-lg font-bold text-white">{{ $message->subject ?: '(No Subject Provided)' }}</h2>
        </div>

        <!-- Message Content -->
        <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 text-sm text-slate-200 whitespace-pre-line leading-relaxed shadow-inner font-sans">
            {{ $message->message }}
        </div>

        <!-- Action Buttons -->
        <div class="border-t border-slate-800/80 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <a href="mailto:{{ $message->email }}?subject={{ urlencode('Re: ' . ($message->subject ?: 'Your Portfolio Inquiry')) }}"
                   class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                    Reply via Email
                </a>

                <form action="{{ route('admin.messages.toggle-read', $message) }}" method="POST">
                    @csrf
                    @method('PATCH')
                    <button type="submit" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition">
                        {{ $message->is_read ? 'Mark as Unread' : 'Mark as Read' }}
                    </button>
                </form>
            </div>

            <form action="{{ route('admin.messages.destroy', $message) }}" method="POST" onsubmit="return confirm('Delete this message permanently?');">
                @csrf
                @method('DELETE')
                <button type="submit" class="text-xs text-rose-400 hover:text-rose-300 hover:underline">
                    Delete Message
                </button>
            </form>
        </div>
    </div>
</div>
@endsection
