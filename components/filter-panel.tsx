'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconXMark } from './icons';

export interface FilterState {
  levels: Set<string>;
  countries: Set<string>;
  fundingTypes: Set<string>;
  modalities: Set<string>;
  eligibilities: Set<string>;
  showExpired: boolean;
}

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  state: FilterState;
  onUpdate: (updater: (prev: FilterState) => FilterState) => void;
  levelOptions: string[];
  countryOptions: string[];
  fundingTypeOptions: string[];
  modalityOptions: string[];
  eligibilityOptions: string[];
}

function ToggleChip({
  label,
  active,
  onToggle
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
        active
          ? 'border-luxe-gold/80 bg-gradient-to-r from-luxe-gold/30 to-luxe-gold/10 text-luxe-ebony shadow-sm dark:text-luxe-ivory'
          : 'border-black/10 bg-white/70 text-luxe-ash hover:border-luxe-gold/40 hover:text-luxe-gold dark:border-white/10 dark:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}

export function FilterPanel({
  open,
  onClose,
  state,
  onUpdate,
  levelOptions,
  countryOptions,
  fundingTypeOptions,
  modalityOptions,
  eligibilityOptions
}: FilterPanelProps) {
  const toggleValue = (key: keyof FilterState, value: string) => {
    onUpdate((prev) => {
      const next = new Set(prev[key] as Set<string>);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return { ...prev, [key]: next } as FilterState;
    });
  };

  const clearFilter = (key: keyof FilterState) => {
    onUpdate((prev) => ({ ...prev, [key]: new Set<string>() } as FilterState));
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.body.classList.add('dialog-open');
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('dialog-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40" role="presentation">
          <motion.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Scholarship filters"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[min(520px,66vw)] flex-col overflow-y-auto border-l border-black/10 bg-gradient-to-b from-white/95 via-white/90 to-white/80 p-8 shadow-aurora focus:outline-none dark:border-white/10 dark:from-luxe-charcoal/95 dark:via-luxe-ebony/95 dark:to-black/95 sm:max-w-[40vw] md:max-w-[33vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-luxe-ebony dark:text-luxe-ivory">Refine Scholarships</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/10 bg-white/70 p-2 text-luxe-ebony transition hover:border-luxe-gold/50 hover:text-luxe-gold focus:outline-none focus:ring-2 focus:ring-luxe-gold/30 dark:border-white/10 dark:bg-white/5 dark:text-luxe-ivory"
                aria-label="Close filters"
              >
                <IconXMark className="h-7 w-7" />
              </button>
            </div>
            <div className="space-y-10">
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">Academic Level</h3>
                  {state.levels.size > 0 && (
                    <button
                      type="button"
                      onClick={() => clearFilter('levels')}
                      className="text-[10px] uppercase tracking-[0.3em] text-luxe-gold/70 hover:text-luxe-gold transition"
                    >
                      All
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {levelOptions.map((level) => (
                    <ToggleChip
                      key={level}
                      label={level}
                      active={state.levels.has(level)}
                      onToggle={() => toggleValue('levels', level)}
                    />
                  ))}
                </div>
              </section>
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">Destination</h3>
                  {state.countries.size > 0 && (
                    <button
                      type="button"
                      onClick={() => clearFilter('countries')}
                      className="text-[10px] uppercase tracking-[0.3em] text-luxe-gold/70 hover:text-luxe-gold transition"
                    >
                      All
                    </button>
                  )}
                </div>
                <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto pr-1">
                  {countryOptions.map((country) => (
                    <ToggleChip
                      key={country}
                      label={country}
                      active={state.countries.has(country)}
                      onToggle={() => toggleValue('countries', country)}
                    />
                  ))}
                </div>
              </section>
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">Type of Funding</h3>
                  {state.fundingTypes.size > 0 && (
                    <button
                      type="button"
                      onClick={() => clearFilter('fundingTypes')}
                      className="text-[10px] uppercase tracking-[0.3em] text-luxe-gold/70 hover:text-luxe-gold transition"
                    >
                      All
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {fundingTypeOptions.map((item) => (
                    <ToggleChip
                      key={item}
                      label={item}
                      active={state.fundingTypes.has(item)}
                      onToggle={() => toggleValue('fundingTypes', item)}
                    />
                  ))}
                </div>
              </section>
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">On-Campus or Remote</h3>
                  {state.modalities.size > 0 && (
                    <button
                      type="button"
                      onClick={() => clearFilter('modalities')}
                      className="text-[10px] uppercase tracking-[0.3em] text-luxe-gold/70 hover:text-luxe-gold transition"
                    >
                      All
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {modalityOptions.map((item) => (
                    <ToggleChip
                      key={item}
                      label={item}
                      active={state.modalities.has(item)}
                      onToggle={() => toggleValue('modalities', item)}
                    />
                  ))}
                </div>
              </section>
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">Eligibility Criteria</h3>
                  {state.eligibilities.size > 0 && (
                    <button
                      type="button"
                      onClick={() => clearFilter('eligibilities')}
                      className="text-[10px] uppercase tracking-[0.3em] text-luxe-gold/70 hover:text-luxe-gold transition"
                    >
                      All
                    </button>
                  )}
                </div>
                <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto pr-1">
                  {eligibilityOptions.map((item) => (
                    <ToggleChip
                      key={item}
                      label={item}
                      active={state.eligibilities.has(item)}
                      onToggle={() => toggleValue('eligibilities', item)}
                    />
                  ))}
                </div>
              </section>
              <section>
                <h3 className="mb-4 text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">Deadline</h3>
                <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-xs uppercase tracking-[0.3em] text-luxe-ash dark:border-white/10 dark:bg-white/5 dark:text-luxe-ash/80">
                  <span>Include expired deadlines</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-luxe-ash bg-transparent"
                    checked={state.showExpired}
                    onChange={(event) =>
                      onUpdate((prev) => ({ ...prev, showExpired: event.target.checked }))
                    }
                  />
                </label>
              </section>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
