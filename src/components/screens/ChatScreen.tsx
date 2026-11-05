import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageCircle, 
  Search, 
  Send, 
  Image, 
  Palette, 
  ArrowLeft
} from 'lucide-react';

export const ChatScreen: React.FC = () => {
  const { 
    chats, 
    activeChatId, 
    setActiveChatId, 
    sendMessage, 
    setChatWallpaper, 
    currentUser,
    showToast
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const [selectedTempWallpaper, setSelectedTempWallpaper] = useState<'stars' | 'stamps1' | 'stamps2'>('stars');
  const [showMobileChatList, setShowMobileChatList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const filteredChats = chats.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(activeChat.id, messageText.trim());
    setMessageText('');
  };

  const handleSendSampleImage = () => {
    sendMessage(
      activeChat.id, 
      'Throwback from our farewell!', 
      '/src/assets/images/xcircle_memory_school_1793604165373.jpg'
    );
  };

  const getWallpaperClass = (wallpaper: string) => {
    switch (wallpaper) {
      case 'stars':
        return 'chat-wallpaper-stars';
      case 'stamps1':
        return 'chat-wallpaper-stamps1';
      case 'stamps2':
        return 'chat-wallpaper-stamps2';
      default:
        return 'bg-[#101827]';
    }
  };

  const handleApplyWallpaper = () => {
    setChatWallpaper(activeChat.id, selectedTempWallpaper);
    setShowWallpaperPicker(false);
    showToast(`Wallpaper applied`);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Wallpaper Picker */}
      {showWallpaperPicker && (
        <div className="p-5 sm:p-6 bg-[#142238] border border-[#242831] rounded-xl space-y-4 shadow-2xl animate-in slide-in-from-top-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#F5F6F8] font-display">
                Chat Atmosphere
              </h2>
              <p className="text-xs text-[#A7AFBC]">
                Choose an ambient background for your circle conversations
              </p>
            </div>
            <button
              onClick={() => setShowWallpaperPicker(false)}
              className="text-xs text-[#A7AFBC] hover:text-[#F5F6F8]"
            >
              Close
            </button>
          </div>

          {/* Wallpaper Selection */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'stars', label: 'Constellation' },
              { id: 'stamps1', label: 'Archive Grid' },
              { id: 'stamps2', label: 'Vintage Mesh' },
            ].map(wp => (
              <button
                key={wp.id}
                type="button"
                onClick={() => setSelectedTempWallpaper(wp.id as any)}
                className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-colors ${
                  selectedTempWallpaper === wp.id
                    ? 'bg-[#1B1E24] border-[#344B6B]'
                    : 'bg-[#1B1E24]/60 border-[#242831] hover:border-[#344B6B]'
                }`}
              >
                <div className="w-full h-10 rounded bg-[#101827] border border-[#242831]" />
                <span className="text-xs font-medium text-[#F5F6F8]">{wp.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleApplyWallpaper}
            className="w-full py-2.5 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg font-medium text-xs uppercase tracking-wider transition-colors"
          >
            Apply Wallpaper
          </button>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="bg-[#142238] rounded-xl border border-[#242831] shadow-2xl overflow-hidden h-[76vh] flex flex-col md:flex-row">
        {/* Left Directory */}
        <div className={`w-full md:w-80 border-r border-[#242831] flex flex-col bg-[#142238] ${
          !showMobileChatList ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-3.5 border-b border-[#242831] bg-[#142238]">
            <h2 className="text-sm font-semibold text-[#F5F6F8] font-display flex items-center gap-1.5 mb-2">
              <MessageCircle className="w-4 h-4 text-[#344B6B]" />
              <span>Conversations</span>
            </h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A7AFBC] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#1B1E24] border border-[#242831] rounded-lg text-xs text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
              />
            </div>
          </div>

          <div className="p-2 overflow-y-auto space-y-1 flex-1">
            {filteredChats.map((chat) => {
              const isSelected = chat.id === activeChat.id;
              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setShowMobileChatList(false);
                  }}
                  className={`p-2.5 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#1B1E24] border-[#344B6B]'
                      : 'bg-transparent border-transparent hover:bg-[#1B1E24]/60'
                  }`}
                >
                  <img
                    src={chat.avatar}
                    alt={chat.title}
                    className="w-9 h-9 rounded-lg object-cover border border-[#242831] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-[#F5F6F8] truncate">{chat.title}</h3>
                    <p className="text-[11px] text-[#A7AFBC] truncate mt-0.5">{chat.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Conversation Stream */}
        <div className={`flex-1 flex flex-col h-full bg-[#101827] ${
          showMobileChatList ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="p-3.5 bg-[#142238] border-b border-[#242831] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setShowMobileChatList(true)}
                className="md:hidden p-1 text-[#A7AFBC] rounded hover:text-[#F5F6F8]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img
                src={activeChat.avatar}
                alt={activeChat.title}
                className="w-9 h-9 rounded-lg object-cover border border-[#242831]"
              />
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-[#F5F6F8] font-display truncate">
                  {activeChat.title}
                </h2>
                <span className="text-[10px] font-mono text-[#A7AFBC]">
                  {activeChat.circleBadge || 'Active Circle'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowWallpaperPicker(!showWallpaperPicker)}
              className="px-3 py-1.5 rounded-lg border border-[#242831] bg-[#1B1E24] hover:bg-[#242831] text-[#F5F6F8] text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className={`flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 ${getWallpaperClass(activeChat.wallpaper)}`}>
            {activeChat.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-md object-cover border border-[#242831] mb-1"
                    />
                  )}
                  <div className={`max-w-sm sm:max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && (
                      <span className="text-[10px] font-medium text-[#A7AFBC] block ml-1 mb-0.5">
                        {msg.senderName}
                      </span>
                    )}
                    <div
                      className={`p-3 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                        isMe 
                          ? 'bg-[#344B6B] text-[#F5F6F8] border-[#344B6B]' 
                          : 'bg-[#142238] text-[#F5F6F8] border-[#242831]'
                      }`}
                    >
                      {msg.image && (
                        <img src={msg.image} alt="Attachment" className="w-full rounded-lg border border-black/20 mb-2" />
                      )}
                      <p>{msg.text}</p>
                      <span className={`text-[9px] block text-right mt-1 font-mono ${isMe ? 'text-white/60' : 'text-[#A7AFBC]'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.reaction && (
                      <div className="mt-1 bg-[#142238] border border-[#242831] rounded-md px-2 py-0.5 text-xs w-fit">
                        {msg.reaction}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#142238] border-t border-[#242831]">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSendSampleImage}
                className="p-2 text-[#A7AFBC] hover:text-[#F5F6F8] rounded-lg hover:bg-[#1B1E24]"
                title="Attach photo"
              >
                <Image className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message to your circle..."
                className="flex-1 px-3 py-2 bg-[#1B1E24] border border-[#242831] rounded-lg text-xs sm:text-sm text-[#F5F6F8] placeholder-[#A7AFBC]/50 focus:outline-none focus:border-[#344B6B]"
              />

              <button
                type="submit"
                disabled={!messageText.trim()}
                className="p-2 bg-[#344B6B] hover:bg-[#3d587c] text-[#F5F6F8] rounded-lg disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
