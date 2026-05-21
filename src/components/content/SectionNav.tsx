'use client';

import { useState, useEffect, useCallback } from 'react';

interface Section {
  id: string;
  label: string;
  icon?: string;
}

interface SectionNavProps {
  sections: Section[];
}

export default function SectionNav({ sections }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || ''
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(section.id);
            }
          });
        },
        {
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsExpanded(false);
    }
  }, []);

  if (sections.length === 0) return null;

  return (
    <>
      {/* Desktop sidebar navigation */}
      <nav className="hidden xl:block fixed left-8 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-2">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="group flex items-center gap-3 text-left transition-all duration-300"
                title={section.label}
              >
                {/* Dot indicator */}
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/50'
                      : 'bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500'
                  }`}
                />
                {/* Label (shows on hover or active) */}
                <span
                  className={`text-xs whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'opacity-100 text-blue-600 dark:text-blue-400 font-medium translate-x-0'
                      : 'opacity-0 group-hover:opacity-70 text-stone-500 dark:text-stone-400 -translate-x-1 group-hover:translate-x-0'
                  }`}
                >
                  {section.icon && <span className="mr-1">{section.icon}</span>}
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile floating button */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center hover:bg-blue-500 transition-all duration-200 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Expanded menu */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 w-48 backdrop-blur-xl bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl p-2">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-white/5'
                  }`}
                >
                  {section.icon && (
                    <span className="mr-2">{section.icon}</span>
                  )}
                  {section.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
