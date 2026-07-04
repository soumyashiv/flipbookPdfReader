'use client';

import { useLibraryStore } from '@/store/useLibraryStore';
import { UploadDropzone } from '@/features/upload/components/UploadDropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, LayoutGrid, List, SortDesc, Heart, UploadCloud
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function LibraryHeader() {
  const {
    view,
    sortBy,
    searchQuery,
    showFavoritesOnly,
    isUploadOpen,
    setView,
    setSortBy,
    setSearchQuery,
    setShowFavoritesOnly,
    setIsUploadOpen
  } = useLibraryStore();

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pf-text-primary to-pf-text-secondary">
            My Library
          </h1>
          <p className="text-pf-text-tertiary text-sm mt-1">
            All your uploaded flipbooks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:min-w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-pf-text-tertiary" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className="pl-9 bg-pf-bg-elevated border-pf-border focus-visible:ring-pf-accent h-10 rounded-xl"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`h-10 w-10 rounded-xl border-pf-border ${showFavoritesOnly ? 'bg-pf-accent/10 border-pf-accent text-pf-accent' : 'bg-pf-bg-elevated text-pf-text-secondary'}`}
          >
            <Heart size={18} className={showFavoritesOnly ? 'fill-pf-accent' : ''} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 w-10 rounded-xl bg-pf-bg-elevated border border-pf-border text-pf-text-secondary">
              <SortDesc size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-pf-bg-elevated border-pf-border rounded-xl">
              <DropdownMenuItem onClick={() => setSortBy('recent')} className={sortBy === 'recent' ? 'text-pf-accent bg-pf-accent/10' : ''}>
                Recently Added
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')} className={sortBy === 'name' ? 'text-pf-accent bg-pf-accent/10' : ''}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('favorites')} className={sortBy === 'favorites' ? 'text-pf-accent bg-pf-accent/10' : ''}>
                Favorites First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center bg-pf-bg-elevated border border-pf-border rounded-xl p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-pf-bg-subtle text-pf-text-primary shadow-sm' : 'text-pf-text-tertiary hover:text-pf-text-secondary'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-pf-bg-subtle text-pf-text-primary shadow-sm' : 'text-pf-text-tertiary hover:text-pf-text-secondary'}`}
            >
              <List size={16} />
            </button>
          </div>

          <Button
            onClick={() => setIsUploadOpen(true)}
            className="h-10 px-5 rounded-xl bg-pf-accent hover:bg-pf-accent-from text-white shadow-accent gap-2 font-medium"
          >
            <UploadCloud size={18} />
            Upload
          </Button>
        </div>
      </div>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-xl bg-pf-bg-card border-pf-border-strong rounded-2xl p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-semibold">Upload Book</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <UploadDropzone />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
