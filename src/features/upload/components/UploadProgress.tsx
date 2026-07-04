'use client';

import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  value: number;
}

export function UploadProgress({ value }: UploadProgressProps) {
  return (
    <div className="w-full relative h-2 overflow-hidden rounded-full bg-pf-bg-subtle">
      <Progress
        value={value}
        className="h-full bg-pf-accent transition-all duration-300 ease-out"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </div>
  );
}
