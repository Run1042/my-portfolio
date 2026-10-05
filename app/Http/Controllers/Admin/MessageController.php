<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $query = Message::latest();

        if ($status === 'unread') {
            $query->where('is_read', false);
        } elseif ($status === 'read') {
            $query->where('is_read', true);
        }

        $messages = $query->paginate(15)->withQueryString();
        $unreadCount = Message::where('is_read', false)->count();

        return view('admin.messages.index', compact('messages', 'unreadCount', 'status'));
    }

    public function show(Message $message)
    {
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return view('admin.messages.show', compact('message'));
    }

    public function toggleRead(Message $message)
    {
        $message->update(['is_read' => !$message->is_read]);

        return back()->with('success', 'Message status updated.');
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return redirect()->route('admin.messages.index')
            ->with('success', 'Message deleted.');
    }
}
