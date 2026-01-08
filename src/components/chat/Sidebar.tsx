'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Plus,
  Trash2,
  ChevronDown,
  LogOut,
  Settings,
} from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  model: string;
  updatedAt: string;
}

interface Model {
  id: string;
  name: string;
  provider: string;
}

interface SidebarProps {
  currentConversationId?: string;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onNewChat: () => void;
}

export function Sidebar({
  currentConversationId,
  selectedModel,
  onModelChange,
  onNewChat,
}: SidebarProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    fetchModels();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models');
      if (res.ok) {
        const data = await res.json();
        setModels(data);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/conversations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
        if (currentConversationId === conversationId) {
          router.push('/chat');
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const selectedModelInfo = models.find((m) => m.id === selectedModel);

  return (
    <div className="flex flex-col h-full bg-card border-r border-border w-64">
      {/* New Chat Button */}
      <div className="p-3 border-b border-border">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Model Selector */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
          >
            <span className="truncate">
              {selectedModelInfo?.name || 'Select Model'}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 ml-2" />
          </button>

          {showModelDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-64 overflow-auto">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setShowModelDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors ${
                    selectedModel === model.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.provider}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="text-center text-muted-foreground text-sm py-4">
              Loading...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-4">
              No conversations yet
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => router.push(`/chat/${conv.id}`)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    currentConversationId === conv.id
                      ? 'bg-accent'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate text-sm">{conv.title}</span>
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-opacity"
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="p-3 border-t border-border">
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
