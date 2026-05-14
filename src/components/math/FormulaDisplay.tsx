'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';

interface FormulaDisplayProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export default function FormulaDisplay({
  formula,
  displayMode = false,
  className = '',
}: FormulaDisplayProps) {
  const html = katex.renderToString(formula, {
    displayMode,
    throwOnError: false,
    trust: true,
  });

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
