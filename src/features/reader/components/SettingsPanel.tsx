'use client';

import { usePreferencesStore } from '@/store/usePreferencesStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Settings2, Volume2, Type, Moon, Sun, MonitorSmartphone, Activity, MousePointerClick } from 'lucide-react';
import type { ReaderTheme, AnimationStyle } from '@/types';
import { Slider } from '@/components/ui/slider';

const THEMES: { id: ReaderTheme; label: string; bg: string }[] = [
  { id: 'light', label: 'Light', bg: 'bg-[#fafbfc] border-gray-200' },
  { id: 'dark', label: 'Dark', bg: 'bg-[#1e293b] border-gray-700' },
  { id: 'sepia', label: 'Sepia', bg: 'bg-[#f4ede0] border-[#d4c3a3]' },
  { id: 'paper', label: 'Paper', bg: 'bg-[#f8f5f0] border-[#e2d5c1]' },
  { id: 'amoled', label: 'AMOLED', bg: 'bg-black border-gray-800' },
  { id: 'high-contrast', label: 'High Contrast', bg: 'bg-black border-yellow-500' },
];

const ANIMATION_STYLES: { id: AnimationStyle; label: string; desc: string }[] = [
  { id: 'book', label: 'Classic Book', desc: 'Standard page turn with slight curve' },
  { id: 'magazine', label: 'Magazine', desc: 'Glossy, soft page turn' },
  { id: 'hardcover', label: 'Hardcover', desc: 'Stiff, thick page turn' },
  { id: 'notebook', label: 'Notebook', desc: 'Springy, bouncy pages' },
  { id: 'softCurl', label: 'Soft Curl', desc: 'Deep curling corner pull' },
  { id: 'fastFlip', label: 'Fast Flip', desc: 'Quick, snappy transition' },
  { id: 'elasticFlip', label: 'Elastic', desc: 'Playful overshooting turn' },
  { id: 'vintagePaper', label: 'Vintage Paper', desc: 'Slow, heavy, delicate' },
  { id: 'luxuryMagazine', label: 'Luxury Magazine', desc: 'Smooth, heavy gloss feel' },
  { id: 'minimal', label: 'Minimal', desc: 'Flat slide without 3D curl' },
];

export function SettingsPanel() {
  const {
    readerTheme, setReaderTheme,
    animationStyle, setAnimationStyle,
    animationSpeed, setAnimationSpeed,
    soundEnabled, setSoundEnabled,
    reducedMotion, setReducedMotion,
    autoHideToolbar, setAutoHideToolbar
  } = usePreferencesStore();

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="h-9 w-9 text-pf-text-secondary hover:bg-pf-bg-subtle hover:text-pf-text-primary rounded-md" />}>
        <Settings2 size={18} />
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-pf-bg-elevated border-l border-pf-border p-0">
        <SheetHeader className="p-6 pb-4 border-b border-pf-border sticky top-0 bg-pf-bg-elevated z-10">
          <SheetTitle className="flex items-center gap-2">
            <Settings2 size={20} className="text-pf-accent" />
            Reader Settings
          </SheetTitle>
        </SheetHeader>

        <div className="p-6 space-y-10">
          {/* Theme */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-pf-text-primary font-medium">
              <Sun size={18} />
              <h3>Appearance Theme</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setReaderTheme(theme.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    readerTheme === theme.id 
                      ? 'border-pf-accent bg-pf-accent/5' 
                      : 'border-pf-border bg-pf-bg-card hover:border-pf-border-strong'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border ${theme.bg}`} />
                  <span className="text-xs font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Animation Style */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-pf-text-primary font-medium">
              <Activity size={18} />
              <h3>Page Turn Animation</h3>
            </div>
            <RadioGroup 
              value={animationStyle} 
              onValueChange={(val) => setAnimationStyle(val as AnimationStyle)}
              className="grid grid-cols-2 gap-3"
            >
              {ANIMATION_STYLES.map((style) => (
                <Label
                  key={style.id}
                  className={`flex flex-col items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    animationStyle === style.id 
                      ? 'border-pf-accent bg-pf-accent/5' 
                      : 'border-pf-border bg-pf-bg-card hover:border-pf-border-strong'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <RadioGroupItem value={style.id} id={style.id} className="sr-only" />
                    <span className="font-medium text-sm">{style.label}</span>
                  </div>
                  <span className="text-xs text-pf-text-tertiary">{style.desc}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>

          {/* Animation Speed */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-pf-text-primary font-medium">
                <MousePointerClick size={18} />
                <h3>Animation Speed</h3>
              </div>
              <span className="text-xs font-medium text-pf-accent">{animationSpeed}x</span>
            </div>
            <Slider
              value={[animationSpeed]}
              min={0.25}
              max={2}
              step={0.25}
              onValueChange={(val) => {
                const nextVal = Array.isArray(val) ? val[0] : (val as unknown as number);
                setAnimationSpeed(nextVal);
              }}
            />
            <div className="flex justify-between text-xs text-pf-text-tertiary">
              <span>Slower (0.25x)</span>
              <span>Faster (2x)</span>
            </div>
          </section>

          {/* Toggles */}
          <section className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-pf-border bg-pf-bg-card">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Volume2 size={16} /> Page Turn Sounds
                </Label>
                <p className="text-xs text-pf-text-tertiary">Play a sound effect when flipping pages</p>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-pf-border bg-pf-bg-card">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MonitorSmartphone size={16} /> Auto-hide Toolbar
                </Label>
                <p className="text-xs text-pf-text-tertiary">Hide toolbar automatically when reading</p>
              </div>
              <Switch checked={autoHideToolbar} onCheckedChange={setAutoHideToolbar} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-pf-border bg-pf-bg-card">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Activity size={16} /> Reduced Motion
                </Label>
                <p className="text-xs text-pf-text-tertiary">Simplify animations for accessibility</p>
              </div>
              <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
