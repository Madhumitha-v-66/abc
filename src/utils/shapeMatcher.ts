export interface Point {
  x: number;
  y: number;
}

export type Stroke = Point[];

export interface DrawingData {
  strokes: Stroke[];
  timestamp: number;
}

/**
 * Resamples an array of points to exactly N evenly-spaced points.
 * Non-mutating and resilient to sparse inputs.
 */
function resamplePoints(rawPoints: Point[], n: number = 32): Point[] {
  if (rawPoints.length === 0) return [];
  if (rawPoints.length === 1) {
    return Array(n).fill(rawPoints[0]);
  }

  // Work with a safe copy
  const points = rawPoints.map(p => ({ x: p.x, y: p.y }));

  // Calculate cumulative distances along the polyline
  const cumDists: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    cumDists.push(cumDists[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }

  const totalLength = cumDists[cumDists.length - 1];
  if (totalLength === 0) {
    return Array(n).fill(points[0]);
  }

  const step = totalLength / (n - 1);
  const resampled: Point[] = [points[0]];

  for (let i = 1; i < n - 1; i++) {
    const targetDist = i * step;
    // Find segment containing targetDist
    let segIdx = 0;
    while (segIdx < cumDists.length - 1 && cumDists[segIdx + 1] < targetDist) {
      segIdx++;
    }
    const d0 = cumDists[segIdx];
    const d1 = cumDists[segIdx + 1];
    const segLen = d1 - d0;
    const t = segLen === 0 ? 0 : (targetDist - d0) / segLen;

    const p0 = points[segIdx];
    const p1 = points[segIdx + 1];
    resampled.push({
      x: p0.x + t * (p1.x - p0.x),
      y: p0.y + t * (p1.y - p0.y),
    });
  }

  resampled.push(points[points.length - 1]);
  return resampled;
}

/**
 * Normalizes points into a [0, 1] x [0, 1] bounding box.
 */
function normalizePoints(points: Point[]): { normalized: Point[]; aspectRatio: number } {
  if (points.length === 0) return { normalized: [], aspectRatio: 1 };

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const width = Math.max(maxX - minX, 2);
  const height = Math.max(maxY - minY, 2);
  const aspectRatio = width / height;

  const normalized = points.map(p => ({
    x: (p.x - minX) / width,
    y: (p.y - minY) / height,
  }));

  return { normalized, aspectRatio };
}

/**
 * Compares two drawings with generous tolerance.
 * Ensures a redrawn shape (triangle, circle, line, initial) reliably matches.
 */
export function compareDrawings(
  stored: DrawingData | null,
  candidate: DrawingData | null,
  minConfidence: number = 35
): { isMatch: boolean; confidence: number; reason?: string } {
  if (!stored || !stored.strokes || stored.strokes.length === 0) {
    return { isMatch: false, confidence: 0, reason: 'No registered security drawing exists.' };
  }
  if (!candidate || !candidate.strokes || candidate.strokes.length === 0) {
    return { isMatch: false, confidence: 0, reason: 'Please draw something on the canvas.' };
  }

  const storedFlat = stored.strokes.flat();
  const candidateFlat = candidate.strokes.flat();

  if (storedFlat.length < 3 || candidateFlat.length < 3) {
    return { isMatch: false, confidence: 10, reason: 'Drawing is too simple. Please draw a recognizable shape.' };
  }

  // Resample both paths to 32 evenly distributed points
  const storedResampled = resamplePoints(storedFlat, 32);
  const candidateResampled = resamplePoints(candidateFlat, 32);

  const { normalized: normStored, aspectRatio: arStored } = normalizePoints(storedResampled);
  const { normalized: normCandidate, aspectRatio: arCandidate } = normalizePoints(candidateResampled);

  // 1. Forward point-to-point average Euclidean distance
  let distForward = 0;
  for (let i = 0; i < 32; i++) {
    const dx = normStored[i].x - normCandidate[i].x;
    const dy = normStored[i].y - normCandidate[i].y;
    distForward += Math.sqrt(dx * dx + dy * dy);
  }
  distForward /= 32;

  // 2. Reverse direction distance (in case user drew the shape in reverse order)
  let distReverse = 0;
  for (let i = 0; i < 32; i++) {
    const dx = normStored[i].x - normCandidate[31 - i].x;
    const dy = normStored[i].y - normCandidate[31 - i].y;
    distReverse += Math.sqrt(dx * dx + dy * dy);
  }
  distReverse /= 32;

  const bestDist = Math.min(distForward, distReverse);

  // 3. Aspect ratio similarity
  const arRatio = Math.max(arStored, arCandidate) / Math.max(Math.min(arStored, arCandidate), 0.01);
  const arScore = Math.max(0, 1 - (arRatio - 1) * 0.4);

  // 4. Stroke count similarity (tolerant up to 3 strokes difference)
  const strokeDiff = Math.abs(stored.strokes.length - candidate.strokes.length);
  const strokeScore = strokeDiff === 0 ? 1.0 : strokeDiff <= 2 ? 0.85 : 0.6;

  // Combined score: distance is weighted highest
  const distanceScore = Math.max(0, 1 - bestDist * 1.25);
  const composite = (distanceScore * 0.65 + arScore * 0.20 + strokeScore * 0.15) * 100;
  const finalConfidence = Math.round(Math.min(100, Math.max(0, composite)));

  const isMatch = finalConfidence >= minConfidence || bestDist <= 0.48;

  return {
    isMatch,
    confidence: finalConfidence,
    reason: isMatch ? 'Shape verified within geometric tolerance' : 'Geometric similarity below threshold',
  };
}
