'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import type { Experiment } from '@/types/timeline';
import DraggablePoint from './DraggablePoint';
import FormulaDisplay from '@/components/math/FormulaDisplay';
import ExperimentContainer from '../ExperimentContainer';
import { shadowLength, similarTriangleHeight } from '@/lib/math/geometry';

/** Experiment coordinate space */
const SVG_W = 800;
const SVG_H = 500;
const GROUND_Y = 380;
const STICK_BASE_X = 250;
const BUILDING_BASE_X = 550;

const MIN_SUN_ANGLE = 15;
const MAX_SUN_ANGLE = 75;
const MIN_STICK_H = 40;
const MAX_STICK_H = 140;

interface MeasurementLabProps {
  experiment: Experiment;
}

export default function MeasurementLab({
  experiment,
}: MeasurementLabProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // --- Read initial state from JSON config ---
  const initialState = experiment.scene.initialState;
  const initialSunAngle = typeof initialState.sunAngle === 'number' ? initialState.sunAngle : 45;
  const initialStickHeight = typeof initialState.stickHeight === 'number' ? initialState.stickHeight : 80;
  const buildingHeight = typeof initialState.buildingHeight === 'number' ? initialState.buildingHeight : 200;

  // --- State ---
  const [sunAngle, setSunAngle] = useState(initialSunAngle);
  const [stickHeight, setStickHeight] = useState(initialStickHeight);

  // --- Derived ---
  const stickShadow = shadowLength(stickHeight, sunAngle);
  const buildingShadow = shadowLength(buildingHeight, sunAngle);

  // Sun position (top-left corner of canvas)
  const sunX = 80;
  const sunY = 60;

  // Stick geometry
  const stickTopY = GROUND_Y - stickHeight;

  // Building geometry
  const buildingTopY = GROUND_Y - buildingHeight;
  const buildingW = 60;

  // Shadow end points (on ground)
  const stickShadowEndX = STICK_BASE_X + stickShadow;
  const buildingShadowEndX = BUILDING_BASE_X + buildingShadow;

  // Calculated building height using similar triangles
  const calculatedHeight = similarTriangleHeight(stickHeight, stickShadow, buildingShadow);

  // --- Sun handle position (draggable) ---
  // Map sun angle to a draggable point on a vertical line
  const sunHandleX = sunX;
  const sunHandleMinY = 30;
  const sunHandleMaxY = 200;
  // Higher angle = higher handle (lower Y)
  const sunHandleY =
    sunHandleMaxY -
    ((sunAngle - MIN_SUN_ANGLE) / (MAX_SUN_ANGLE - MIN_SUN_ANGLE)) *
      (sunHandleMaxY - sunHandleMinY);

  const handleSunMove = useCallback((_x: number, y: number) => {
    const clamped = Math.max(sunHandleMinY, Math.min(sunHandleMaxY, y));
    const ratio = (sunHandleMaxY - clamped) / (sunHandleMaxY - sunHandleMinY);
    const angle = MIN_SUN_ANGLE + ratio * (MAX_SUN_ANGLE - MIN_SUN_ANGLE);
    setSunAngle(Math.round(angle));
  }, []);

  const handleStickMove = useCallback((_x: number, y: number) => {
    const h = Math.max(MIN_STICK_H, Math.min(MAX_STICK_H, GROUND_Y - y));
    setStickHeight(Math.round(h));
  }, []);

  // Light ray through stick top
  const stickRayEndX = STICK_BASE_X + stickShadow + 40;
  const stickRayEndY = GROUND_Y;

  // Light ray through building top
  const buildingRayEndX = BUILDING_BASE_X + buildingShadow + 40;
  const buildingRayEndY = GROUND_Y;

  // Sun rays (decorative)
  const sunRays = useMemo(() => {
    const rays = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 8 - Math.PI / 4;
      const len = 20 + i * 3;
      rays.push({
        x1: sunX + Math.cos(angle) * 18,
        y1: sunY + Math.sin(angle) * 18,
        x2: sunX + Math.cos(angle) * (18 + len),
        y2: sunY + Math.sin(angle) * (18 + len),
      });
    }
    return rays;
  }, [sunX, sunY]);

  // --- Result panel ---
  const resultPanel = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">计算结果</h3>

      {/* Data table */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between p-2 bg-stone-50 rounded">
            <span className="text-stone-500">太阳角度</span>
            <span className="font-mono font-medium">{sunAngle}°</span>
          </div>
          <div className="flex justify-between p-2 bg-stone-50 rounded">
            <span className="text-stone-500">标杆高度 (g)</span>
            <span className="font-mono font-medium">{stickHeight}</span>
          </div>
          <div className="flex justify-between p-2 bg-stone-50 rounded">
            <span className="text-stone-500">标杆影长 (l)</span>
            <span className="font-mono font-medium">
              {stickShadow.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between p-2 bg-blue-50 rounded">
            <span className="text-stone-500">建筑影长 (L)</span>
            <span className="font-mono font-medium">
              {buildingShadow.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-green-50 rounded border border-green-200">
            <span className="text-green-700 font-medium">计算高度 (h)</span>
            <span className="font-mono font-bold text-green-800">
              {calculatedHeight.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-stone-50 rounded">
            <span className="text-stone-500">实际高度</span>
            <span className="font-mono font-medium">{buildingHeight}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs font-medium text-amber-700 mb-2">
          相似三角形比例关系
        </p>
        <div className="flex items-center justify-center gap-4 text-lg">
          <FormulaDisplay
            formula="\\frac{h}{g} = \\frac{L}{l}"
            displayMode={false}
          />
          <span className="text-stone-400">→</span>
          <FormulaDisplay
            formula={`h = ${stickHeight} \\times \\frac{${buildingShadow.toFixed(1)}}{${stickShadow.toFixed(1)}} = ${calculatedHeight.toFixed(1)}`}
            displayMode={false}
          />
        </div>
      </div>

      {/* Ratio insight */}
      <p className="text-sm text-stone-500 text-center">
        影子比例 L/l = {stickShadow > 0 ? (buildingShadow / stickShadow).toFixed(2) : '—'}，
        建筑高度是标杆的 {stickShadow > 0 ? (buildingShadow / stickShadow).toFixed(1) : '—'} 倍
      </p>
    </div>
  );

  return (
    <ExperimentContainer
      experiment={experiment}
      resultPanel={resultPanel}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
        style={{ touchAction: 'none' }}
      >
        {/* Sky gradient background */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#eff6ff" />
          </linearGradient>
          <pattern
            id="ground-pattern"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect width="20" height="20" fill="#fef3c7" />
            <circle cx="10" cy="10" r="0.5" fill="#d97706" opacity="0.2" />
          </pattern>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width={SVG_W} height={GROUND_Y} fill="url(#sky)" />
        <rect
          x="0"
          y={GROUND_Y}
          width={SVG_W}
          height={SVG_H - GROUND_Y}
          fill="url(#ground-pattern)"
        />
        {/* Ground line */}
        <line
          x1="0"
          y1={GROUND_Y}
          x2={SVG_W}
          y2={GROUND_Y}
          stroke="#a8a29e"
          strokeWidth="2"
        />

        {/* Sun */}
        <circle cx={sunX} cy={sunY} r="18" fill="#fbbf24" opacity="0.9" />
        {sunRays.map((r, i) => (
          <line
            key={i}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke="#fbbf24"
            strokeWidth="2"
            opacity="0.6"
          />
        ))}

        {/* Light rays (from sun through tops of objects to ground) */}
        {/* Ray through stick top */}
        <line
          x1={sunX}
          y1={sunY}
          x2={STICK_BASE_X}
          y2={stickTopY}
          stroke="#fcd34d"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.5"
        />
        <line
          x1={STICK_BASE_X}
          y1={stickTopY}
          x2={stickRayEndX}
          y2={stickRayEndY}
          stroke="#fcd34d"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.5"
        />
        {/* Ray through building top */}
        <line
          x1={sunX}
          y1={sunY}
          x2={BUILDING_BASE_X}
          y2={buildingTopY}
          stroke="#fcd34d"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.5"
        />
        <line
          x1={BUILDING_BASE_X}
          y1={buildingTopY}
          x2={buildingRayEndX}
          y2={buildingRayEndY}
          stroke="#fcd34d"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.5"
        />

        {/* Stick */}
        <line
          x1={STICK_BASE_X}
          y1={GROUND_Y}
          x2={STICK_BASE_X}
          y2={stickTopY}
          stroke="#78716c"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Stick shadow */}
        <polygon
          points={`
            ${STICK_BASE_X},${GROUND_Y}
            ${STICK_BASE_X + stickShadow},${GROUND_Y}
            ${STICK_BASE_X},${stickTopY}
          `}
          fill="#78716c"
          opacity="0.15"
        />
        <line
          x1={STICK_BASE_X}
          y1={GROUND_Y}
          x2={stickShadowEndX}
          y2={GROUND_Y}
          stroke="#78716c"
          strokeWidth="2"
          strokeDasharray="6,3"
        />

        {/* Building */}
        <rect
          x={BUILDING_BASE_X - buildingW / 2}
          y={buildingTopY}
          width={buildingW}
          height={buildingHeight}
          fill="#d6d3d1"
          stroke="#a8a29e"
          strokeWidth="2"
          rx="2"
        />
        {/* Building windows */}
        {[0, 1, 2, 3].map((row) =>
          [0, 1].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={BUILDING_BASE_X - 15 + col * 22}
              y={buildingTopY + 15 + row * 45}
              width="12"
              height="18"
              fill="#bfdbfe"
              stroke="#a8a29e"
              strokeWidth="1"
              rx="1"
            />
          ))
        )}
        {/* Building shadow */}
        <polygon
          points={`
            ${BUILDING_BASE_X + buildingW / 2},${GROUND_Y}
            ${BUILDING_BASE_X + buildingW / 2 + buildingShadow},${GROUND_Y}
            ${BUILDING_BASE_X},${buildingTopY}
          `}
          fill="#a8a29e"
          opacity="0.12"
        />
        <line
          x1={BUILDING_BASE_X + buildingW / 2}
          y1={GROUND_Y}
          x2={buildingShadowEndX}
          y2={GROUND_Y}
          stroke="#a8a29e"
          strokeWidth="2"
          strokeDasharray="6,3"
        />

        {/* Similar triangle outlines */}
        {/* Stick triangle */}
        <polygon
          points={`
            ${STICK_BASE_X},${stickTopY}
            ${STICK_BASE_X},${GROUND_Y}
            ${stickShadowEndX},${GROUND_Y}
          `}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.6"
        />
        {/* Building triangle */}
        <polygon
          points={`
            ${BUILDING_BASE_X},${buildingTopY}
            ${BUILDING_BASE_X + buildingW / 2},${GROUND_Y}
            ${buildingShadowEndX},${GROUND_Y}
          `}
          fill="none"
          stroke="#16a34a"
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.6"
        />

        {/* Dimension labels */}
        {/* Stick height label */}
        <text
          x={STICK_BASE_X - 12}
          y={(GROUND_Y + stickTopY) / 2}
          textAnchor="end"
          fontSize="13"
          fill="#3b82f6"
          fontWeight="600"
        >
          g={stickHeight}
        </text>
        {/* Stick shadow label */}
        <text
          x={STICK_BASE_X + stickShadow / 2}
          y={GROUND_Y + 18}
          textAnchor="middle"
          fontSize="12"
          fill="#78716c"
        >
          l={stickShadow.toFixed(0)}
        </text>
        {/* Building shadow label */}
        <text
          x={BUILDING_BASE_X + buildingShadow / 2 + 15}
          y={GROUND_Y + 18}
          textAnchor="middle"
          fontSize="12"
          fill="#78716c"
        >
          L={buildingShadow.toFixed(0)}
        </text>
        {/* Building height label */}
        <text
          x={BUILDING_BASE_X + buildingW / 2 + 14}
          y={(GROUND_Y + buildingTopY) / 2}
          textAnchor="start"
          fontSize="13"
          fill="#16a34a"
          fontWeight="600"
        >
          h=?
        </text>
        {/* Angle label */}
        <text
          x={sunX + 30}
          y={sunY + 5}
          fontSize="12"
          fill="#92400e"
          fontWeight="500"
        >
          {sunAngle}°
        </text>

        {/* Draggable sun handle */}
        <DraggablePoint
          x={sunHandleX}
          y={sunHandleY}
          onMove={handleSunMove}
          svgRef={svgRef}
          radius={8}
          color="#f59e0b"
          label="拖动调角度"
          verticalOnly
          minY={sunHandleMinY}
          maxY={sunHandleMaxY}
        />

        {/* Draggable stick height handle */}
        <DraggablePoint
          x={STICK_BASE_X}
          y={stickTopY}
          onMove={handleStickMove}
          svgRef={svgRef}
          radius={8}
          color="#3b82f6"
          label="拖动调标杆"
          verticalOnly
          minY={GROUND_Y - MAX_STICK_H}
          maxY={GROUND_Y - MIN_STICK_H}
        />

        {/* Instructions */}
        <text x={SVG_W / 2} y={SVG_H - 10} textAnchor="middle" fontSize="12" fill="#a8a29e">
          拖动黄色点调整太阳角度 · 拖动蓝色点调整标杆高度
        </text>
      </svg>

      {/* Slider controls for mobile / precise input */}
      <div className="px-6 pb-4 space-y-3 bg-white border-t border-stone-100">
        <div className="flex items-center gap-4">
          <label className="text-sm text-stone-600 w-24 shrink-0">
            太阳角度
          </label>
          <input
            type="range"
            min={MIN_SUN_ANGLE}
            max={MAX_SUN_ANGLE}
            value={sunAngle}
            onChange={(e) => setSunAngle(Number(e.target.value))}
            className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-sm font-mono w-10 text-right">{sunAngle}°</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-stone-600 w-24 shrink-0">
            标杆高度
          </label>
          <input
            type="range"
            min={MIN_STICK_H}
            max={MAX_STICK_H}
            value={stickHeight}
            onChange={(e) => setStickHeight(Number(e.target.value))}
            className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-sm font-mono w-10 text-right">{stickHeight}</span>
        </div>
      </div>
    </ExperimentContainer>
  );
}
