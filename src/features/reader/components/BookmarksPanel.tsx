'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SidebarPanel } from './SidebarPanel';
import { useReaderStore } from '@/store/useReaderStore';
import { getBookmarks, toggleBookmark, deleteBookmark } from '@/lib/actions/bookmarks';
import { Bookmark, Trash2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function BookmarksPanel() {
  const { bookId, isBookmarksOpen, setIsBookmarksOpen, currentPage, setCurrentPage } = useReaderStore();
  const queryClient = useQueryClient();
  const [newLabel, setNewLabel] = useState('');

  const { data: response, isLoading } = useQuery({
    queryKey: ['bookmarks', bookId],
    queryFn: () => getBookmarks(bookId!),
    enabled: !!bookId && isBookmarksOpen,
  });

  const bookmarks = response?.data || [];
  const hasCurrentPageBookmark = bookmarks.some(b => b.pageNumber === currentPage);

  const toggleMutation = useMutation({
    mutationFn: (label?: string) => toggleBookmark(bookId!, currentPage, label),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['bookmarks', bookId] });
        if (res.data?.added) {
          setNewLabel('');
          toast.success('Bookmark added');
        } else {
          toast.success('Bookmark removed');
        }
      } else {
        toast.error(res.error);
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBookmark(id, bookId!),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['bookmarks', bookId] });
        toast.success('Bookmark deleted');
      } else {
        toast.error(res.error);
      }
    }
  });

  const handleToggle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId) return;
    toggleMutation.mutate(newLabel || undefined);
  };

  return (
    <SidebarPanel 
      title="Bookmarks" 
      isOpen={isBookmarksOpen} 
      onClose={() => setIsBookmarksOpen(false)}
    >
      <form onSubmit={handleToggle} className="mb-6 flex items-center gap-2">
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder={hasCurrentPageBookmark ? "Current page bookmarked" : `Bookmark Page ${currentPage}...`}
          disabled={hasCurrentPageBookmark || toggleMutation.isPending}
          className="h-9 bg-pf-bg-card border-pf-border text-sm"
        />
        <Button 
          type="submit"
          variant="outline" 
          size="icon" 
          disabled={toggleMutation.isPending}
          className={`h-9 w-9 shrink-0 ${hasCurrentPageBookmark ? 'text-pf-accent border-pf-accent bg-pf-accent/10 hover:bg-pf-accent/20' : ''}`}
        >
          {toggleMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Bookmark size={16} className={hasCurrentPageBookmark ? "fill-current" : ""} />}
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center p-8 text-pf-text-tertiary">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center p-8">
          <Bookmark size={32} className="mx-auto text-pf-text-disabled mb-3" />
          <p className="text-sm text-pf-text-secondary">No bookmarks yet.</p>
          <p className="text-xs text-pf-text-tertiary mt-1">Add one for the current page above.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {bookmarks.map((bm) => (
            <li 
              key={bm.id}
              className="flex items-center justify-between p-3 rounded-xl border border-pf-border bg-pf-bg-card hover:border-pf-accent/40 group transition-colors cursor-pointer"
              onClick={() => setCurrentPage(bm.pageNumber)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pf-accent/10 text-pf-accent flex items-center justify-center font-semibold text-xs">
                  {bm.pageNumber}
                </div>
                <span className="text-sm font-medium text-pf-text-primary line-clamp-1">
                  {bm.label || `Page ${bm.pageNumber}`}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(bm.id);
                }}
                className="p-1.5 rounded-md text-pf-text-tertiary hover:text-pf-error hover:bg-pf-error/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </SidebarPanel>
  );
}
