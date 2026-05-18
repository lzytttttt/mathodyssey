const NUMERIC_RE = /-?\d+(?:\.\d+)?/g;

function normalizeAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/，/g, ',')
    .replace(/。/g, '.');
}

function extractNumbers(s: string): number[] {
  const matches = s.match(NUMERIC_RE);
  if (!matches) return [];
  return matches.map(Number);
}

function parseNumericToken(token: string): number | null {
  const trimmed = token.replace(/^约\s*/, '');
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function isNumericLikeAnswer(s: string): boolean {
  const trimmed = s.replace(/^约\s*/, '').replace(/[\s%°]+$/, '');
  if (trimmed.includes(':')) return false;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return true;
  if (/^-?\d+\/\d+$/.test(trimmed)) return true;
  return false;
}

function parseNumericValue(s: string): number | null {
  const trimmed = s.replace(/^约\s*/, '').replace(/[\s%°]+$/, '');
  if (/^-?\d+\/\d+$/.test(trimmed)) {
    const [num, den] = trimmed.split('/').map(Number);
    return den !== 0 ? num / den : null;
  }
  return parseNumericToken(trimmed);
}

export function validateAnswer(
  userAnswer: string,
  correctAnswer: string,
): boolean {
  if (!userAnswer.trim()) return false;

  const normUser = normalizeAnswer(userAnswer);
  const normCorrect = normalizeAnswer(correctAnswer);

  // Path 1: normalized exact match
  if (normUser === normCorrect) return true;

  // Guard: if answer contains ':', don't extract first number
  // (time/ratio formats like "2:05" must match as text)
  if (correctAnswer.includes(':')) return false;

  // Path 2: single numeric-like value in correctAnswer
  if (isNumericLikeAnswer(correctAnswer)) {
    const correctNum = parseNumericValue(correctAnswer);
    if (correctNum !== null) {
      // Try to parse user answer as single numeric value
      if (isNumericLikeAnswer(userAnswer)) {
        const userNum = parseNumericValue(userAnswer);
        if (userNum !== null) {
          const tolerance = Math.max(Math.abs(correctNum) * 0.01, 0.01);
          return Math.abs(userNum - correctNum) < tolerance;
        }
      }
      // Fallback: extract first number from user answer
      const userNums = extractNumbers(userAnswer);
      if (userNums.length === 1) {
        const tolerance = Math.max(Math.abs(correctNum) * 0.01, 0.01);
        return Math.abs(userNums[0] - correctNum) < tolerance;
      }
      return false;
    }
  }

  // Path 3: multiple numbers in correctAnswer — all must match
  const correctNums = extractNumbers(correctAnswer);
  if (correctNums.length > 1) {
    const userNums = extractNumbers(userAnswer);
    if (userNums.length !== correctNums.length) return false;
    return correctNums.every((cn, i) => {
      const tolerance = Math.max(Math.abs(cn) * 0.01, 0.01);
      return Math.abs(userNums[i] - cn) < tolerance;
    });
  }

  // Path 4: conservative text fallback
  // Only match if user answer is a meaningful substring (>= 4 chars)
  // or if it matches a complete segment of the correct answer
  if (normUser.length >= 4 && normCorrect.includes(normUser)) return true;

  return false;
}
