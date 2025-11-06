'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface FilterState {
  levels: Set<string>;
  countries: Set<string>;
  coverage: Set<string>;
  showExpired: boolean;
}

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  state: FilterState;
  onUpdate: (updater: (prev: FilterState) => FilterState) => void;
  levelOptions: string[];
  countryOptions: string[];
  coverageOptions: string[];
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
  coverageOptions
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

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="flex h-full w-full max-w-[min(520px,66vw)] sm:max-w-[40vw] md:max-w-[33vw] flex-col overflow-y-auto border-l border-black/10 bg-gradient-to-b from-white/95 via-white/90 to-white/80 p-8 shadow-aurora dark:border-white/10 dark:from-luxe-charcoal/95 dark:via-luxe-ebony/95 dark:to-black/95">
                <div className="mb-8 flex items-center justify-between">
                  <Dialog.Title className="font-serif text-2xl text-luxe-ebony dark:text-luxe-ivory">Refine Scholarships</Dialog.Title>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-black/10 bg-white/70 p-2 text-luxe-ebony transition hover:border-luxe-gold/50 hover:text-luxe-gold dark:border-white/10 dark:bg-white/5 dark:text-luxe-ivory"
                    aria-label="Close filters"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-10">
                  <section>
                    <h3 className="mb-4 text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">Academic Level</h3>
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
                    <h3 className="mb-4 text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">Destination</h3>
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
                    <h3 className="mb-4 text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/70">Coverage</h3>
                    <div className="flex flex-wrap gap-2">
                      {coverageOptions.map((item) => (
                        <ToggleChip
                          key={item}
                          label={item}
                          active={state.coverage.has(item)}
                          onToggle={() => toggleValue('coverage', item)}
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
