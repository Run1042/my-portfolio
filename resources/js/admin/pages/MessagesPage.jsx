import React, { useState, useEffect } from 'react';
import {
    Mail,
    Trash2,
    CheckCircle,
    Circle,
    X,
    ExternalLink,
    Send,
} from 'lucide-react';
import {
    getMessages,
    toggleMessageRead,
    deleteMessage,
} from '../libs/api';

export default function MessagesPage({ onNotify, onUpdateUnread, theme = 'dark', locale = 'en' }) {
    const t = {
        en: {
            all: 'All', unread: 'Unread', read: 'Read', loading: 'Loading inquiries...',
            noMessages: 'No messages found in this folder.', noSubj: '(No Subject)',
            markRead: 'Mark Read', markUnread: 'Mark Unread', del: 'Delete',
            subject: 'Subject', reply: 'Reply via Email', delNote: 'Delete Note'
        },
        kh: {
            all: 'ទាំងអស់', unread: 'មិនទាន់អាន', read: 'បានអាន', loading: 'កំពុងទាញទិន្នន័យ...',
            noMessages: 'មិនមានសារក្នុងថតនេះទេ', noSubj: '(គ្មានចំណងជើង)',
            markRead: 'ចំណាំថាបានអាន', markUnread: 'ចំណាំថាមិនទាន់អាន', del: 'លុប',
            subject: 'ចំណងជើង', reply: 'ឆ្លើយតបតាមអ៊ីមែល', delNote: 'លុបសារនេះ'
        }
    }[locale] || {};

    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState(''); // '' (all), 'unread', 'read'
    const [loading, setLoading] = useState(true);
    const [activeMessage, setActiveMessage] = useState(null);

    const isDark = theme === 'dark';
    const cardBg = isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200/90 shadow-sm';
    const tabsBg = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200';
    const titleColor = isDark ? 'text-white' : 'text-slate-900';
    const subColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const dividerColor = isDark ? 'divide-slate-800/80' : 'divide-slate-100';
    const rowHover = isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/80';
    const modalBg = isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl';

    const fetchMessagesList = async () => {
        setLoading(true);
        try {
            const data = await getMessages({ status: statusFilter });
            setMessages(data.messages || []);
            setUnreadCount(data.unread_count || 0);
            setTotalCount(data.total_count || 0);
            if (onUpdateUnread) onUpdateUnread(data.unread_count || 0);
        } catch (e) {
            onNotify('error', 'Failed to load messages.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessagesList();
    }, [statusFilter]);

    const handleOpenMessage = async (msg) => {
        setActiveMessage(msg);
        if (!msg.is_read) {
            try {
                await toggleMessageRead(msg.id);
                msg.is_read = true;
                setUnreadCount((c) => Math.max(0, c - 1));
                if (onUpdateUnread) onUpdateUnread(Math.max(0, unreadCount - 1));
            } catch (e) {}
        }
    };

    const handleToggleRead = async (msg, e) => {
        if (e) e.stopPropagation();
        try {
            await toggleMessageRead(msg.id);
            onNotify('success', 'Message status updated.');
            fetchMessagesList();
        } catch (err) {
            onNotify('error', 'Failed to update status.');
        }
    };

    const handleDelete = async (msg, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm(`Delete message from "${msg.name}"?`)) return;

        try {
            await deleteMessage(msg.id);
            onNotify('success', 'Message deleted.');
            if (activeMessage && activeMessage.id === msg.id) {
                setActiveMessage(null);
            }
            fetchMessagesList();
        } catch (err) {
            onNotify('error', 'Failed to delete message.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border w-fit ${tabsBg}`}>
                <button
                    onClick={() => setStatusFilter('')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                        statusFilter === ''
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    {t.all || 'All'} ({totalCount})
                </button>
                <button
                    onClick={() => setStatusFilter('unread')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                        statusFilter === 'unread'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <span>{t.unread || 'Unread'}</span>
                    {unreadCount > 0 && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-1.5 py-0.2 rounded-full border border-rose-500/30">
                            {unreadCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setStatusFilter('read')}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                        statusFilter === 'read'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    {t.read || 'Read'}
                </button>
            </div>

            {/* Messages Inbox Table */}
            <div className={`${cardBg} border rounded-2xl overflow-hidden transition duration-150`}>
                {loading ? (
                    <div className={`py-20 text-center text-xs ${subColor}`}>
                        {t.loading || 'Loading inquiries...'}
                    </div>
                ) : messages.length === 0 ? (
                    <div className={`py-20 text-center text-sm ${subColor}`}>
                        {t.noMessages || 'No messages found in this folder.'}
                    </div>
                ) : (
                    <div className={`divide-y ${dividerColor}`}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => handleOpenMessage(msg)}
                                className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition ${rowHover} ${
                                    !msg.is_read ? (isDark ? 'bg-indigo-950/20' : 'bg-indigo-50/50') : ''
                                }`}
                            >
                                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                    <div className="pt-1 shrink-0">
                                        {!msg.is_read ? (
                                            <span
                                                className="w-2.5 h-2.5 rounded-full bg-rose-500 block shadow-sm shadow-rose-500/50"
                                                title="Unread"
                                            />
                                        ) : (
                                            <span
                                                className={`w-2.5 h-2.5 rounded-full block ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}
                                                title="Read"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className={`text-sm font-bold ${titleColor}`}>
                                                {msg.name}
                                            </span>
                                            <span className={`text-xs font-mono ${subColor}`}>
                                                &lt;{msg.email}&gt;
                                            </span>
                                        </div>
                                        <h4
                                            className={`text-xs truncate mb-1 ${
                                                !msg.is_read
                                                    ? 'text-indigo-500 font-bold'
                                                    : titleColor
                                            }`}
                                        >
                                            {msg.subject || (t.noSubj || '(No Subject)')}
                                        </h4>
                                        <p className={`text-xs line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                    <button
                                        onClick={(e) => handleToggleRead(msg, e)}
                                        className={`p-1.5 rounded-lg transition ${
                                            isDark
                                                ? 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800'
                                                : 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                                        }`}
                                        title={msg.is_read ? (t.markUnread || 'Mark Unread') : (t.markRead || 'Mark Read')}
                                    >
                                        {msg.is_read ? (
                                            <Circle className="w-4 h-4" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        )}
                                    </button>

                                    <button
                                        onClick={(e) => handleDelete(msg, e)}
                                        className={`p-1.5 rounded-lg transition ${
                                            isDark
                                                ? 'text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10'
                                                : 'text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50'
                                        }`}
                                        title={t.del || "Delete"}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Reader Modal */}
            {activeMessage && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        className={`${modalBg} border rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`flex items-start justify-between pb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                            <div>
                                <h3 className={`text-xl font-bold ${titleColor}`}>
                                    {activeMessage.name}
                                </h3>
                                <p className="text-xs text-indigo-500 font-mono mt-0.5">
                                    {activeMessage.email}
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveMessage(null)}
                                className={`p-2 rounded-xl transition ${
                                    isDark
                                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>
                            <span className={`text-[11px] font-semibold uppercase tracking-wider block mb-1 ${subColor}`}>
                                {t.subject || 'Subject'}
                            </span>
                            <h4 className={`text-base font-bold ${titleColor}`}>
                                {activeMessage.subject || (t.noSubj || '(No Subject)')}
                            </h4>
                        </div>

                        <div className={`${isDark ? 'bg-slate-950/70 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-2xl p-5 text-sm whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto`}>
                            {activeMessage.message}
                        </div>

                        <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                <a
                                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                                        activeMessage.subject || 'Portfolio Inquiry'
                                    )}`}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{t.reply || 'Reply via Email'}</span>
                                </a>
                            </div>

                            <button
                                onClick={() => handleDelete(activeMessage)}
                                className="text-xs text-rose-500 hover:text-rose-600 hover:underline"
                            >
                                {t.delNote || 'Delete Note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
