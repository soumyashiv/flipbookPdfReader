'use client';

import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ZoomControlsProps {
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitWidth: () => void;
  zoomTo: (level: number) => void;
  ZOOM_PRESETS: number[];
}

export function ZoomControls({
  zoomLevel,
  zoomIn,
  zoomOut,
  resetZoom,
  fitWidth,
  zoomTo,
  ZOOM_PRESETS
}: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-1 bg-pf-bg-elevated border border-pf-border rounded-xl p-1 shadow-sm">
      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-pf-text-secondary hover:text-pf-text-primary" onClick={zoomOut}>
        <ZoomOut size={16} />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 px-2 rounded-lg text-xs font-medium text-pf-text-primary min-w-[60px]" />}>
          {Math.round(zoomLevel * 100)}%
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="min-w-[120px] bg-pf-bg-elevated border-pf-border rounded-xl">
          {ZOOM_PRESETS.map((preset) => (
            <DropdownMenuItem 
              key={preset} 
              onClick={() => zoomTo(preset)}
              className={zoomLevel === preset ? 'text-pf-accent bg-pf-accent/10' : ''}
            >
              {preset * 100}%
            </DropdownMenuItem>
          ))}
          <div className="h-px bg-pf-border my-1" />
          <DropdownMenuItem onClick={fitWidth} className="gap-2">
            <Maximize size={14} /> Fit Width
          </DropdownMenuItem>
          <DropdownMenuItem onClick={resetZoom} className="gap-2">
            <RotateCcw size={14} /> Reset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-pf-text-secondary hover:text-pf-text-primary" onClick={zoomIn}>
        <ZoomIn size={16} />
      </Button>
    </div>
  );
}
