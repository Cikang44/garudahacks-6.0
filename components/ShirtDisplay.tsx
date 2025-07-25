"use client";
import React, { useMemo } from 'react';

type Cell = [number, number];

interface ShirtDisplayProps {
  grid: Cell[][];
  gridWidth: number;
  scale?: number;
  id?: string;
}

// Color dictionary for color mapping
const colorDictionary: { [key: number]: string } = {
  1: "d2691e", // saddle brown
  2: "cd5c5c", // indian red
  3: "b22222", // fire brick
};

// Helper function to get color hex
const getColorHex = (colorID: number): string => {
  return colorDictionary[colorID] || "ffffff";
};

const FORBIDDEN_CELL: Cell = [-1, -1];

// Function to find the most used pattern in the grid
const getMostUsedPattern = (grid: Cell[][]): { patternId: number; colorId: number } => {
  const patternCount: { [key: string]: { count: number; patternId: number; colorId: number } } = {};

  grid.forEach(row => {
    row.forEach(cell => {
      const [patternID, colorID] = cell;
      if (patternID > 0 && colorID > 0) { // Valid pattern
        const key = `${patternID}-${colorID}`;
        if (!patternCount[key]) {
          patternCount[key] = { count: 0, patternId: patternID, colorId: colorID };
        }
        patternCount[key].count++;
      }
    });
  });

  // Find the most used pattern
  let mostUsed = { patternId: 1, colorId: 1 }; // Default fallback
  let maxCount = 0;

  Object.values(patternCount).forEach(pattern => {
    if (pattern.count > maxCount) {
      maxCount = pattern.count;
      mostUsed = { patternId: pattern.patternId, colorId: pattern.colorId };
    }
  });

  return mostUsed;
};

/**
 * ShirtDisplay component that renders a shirt using the most used pattern from the grid
 */
const ShirtDisplay: React.FC<ShirtDisplayProps> = ({ grid, gridWidth, scale = 1, id }) => {
  
  // Get the most used pattern from the grid
  const { patternId, colorId } = useMemo(() => getMostUsedPattern(grid), [grid]);
  
  // Generate a stable mask ID
  const maskId = useMemo(() => {
    if (id) {
      return `shirt-pattern-${id}`;
    }
    const hash = `${gridWidth}-${grid.length}-${scale}`.replace(/\./g, '_');
    return `shirt-pattern-${hash}`;
  }, [id, gridWidth, grid.length, scale]);

  const shirtSize = 200 * scale;
  const patternImage = `/patterns/Batik${patternId}.png`;

  return (
    <div className="relative inline-block" style={{ width: shirtSize, height: shirtSize }}>
      {/* SVG definitions for masking */}
      <svg width="0" height="0" className="absolute">
        <defs>
          {/* Pattern definition */}
          <pattern
            id={`pattern-${maskId}`}
            patternUnits="userSpaceOnUse"
            width="100"
            height="100"
          >
            <image
              href={patternImage}
              width="100"
              height="100"
              style={{
                filter: `hue-rotate(${colorId * 60}deg) saturate(1.2)`,
              }}
            />
            {/* Color overlay */}
            <rect
              width="100"
              height="100"
              fill={`#${getColorHex(colorId)}`}
              opacity="0.3"
              style={{ mixBlendMode: 'multiply' }}
            />
          </pattern>
        </defs>
      </svg>

      {/* Base shirt silhouette */}
      <div className="relative w-full h-full">
        {/* Shirt background - this would be your shirt.png */}
        <div 
          className="absolute inset-0 bg-gray-100 rounded-lg shadow-lg"
          style={{
            clipPath: `polygon(
              42% 8%, 58% 8%, 58% 25%, 88% 25%, 92% 35%, 
              92% 75%, 88% 82%, 75% 82%, 75% 92%, 25% 92%, 
              25% 82%, 12% 82%, 8% 75%, 8% 35%, 12% 25%, 42% 25%
            )`
          }}
        />
        
        {/* Pattern overlay using the most used pattern */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{
            background: `url(${patternImage})`,
            backgroundSize: '50px 50px',
            filter: `hue-rotate(${colorId * 60}deg) saturate(1.2)`,
            clipPath: `polygon(
              42% 8%, 58% 8%, 58% 25%, 88% 25%, 92% 35%, 
              92% 75%, 88% 82%, 75% 82%, 75% 92%, 25% 92%, 
              25% 82%, 12% 82%, 8% 75%, 8% 35%, 12% 25%, 42% 25%
            )`,
            opacity: 0.9
          }}
        />

        {/* Color tint overlay */}
        <div 
          className="absolute inset-0 rounded-lg opacity-30"
          style={{
            backgroundColor: `#${getColorHex(colorId)}`,
            mixBlendMode: 'multiply',
            clipPath: `polygon(
              42% 8%, 58% 8%, 58% 25%, 88% 25%, 92% 35%, 
              92% 75%, 88% 82%, 75% 82%, 75% 92%, 25% 92%, 
              25% 82%, 12% 82%, 8% 75%, 8% 35%, 12% 25%, 42% 25%
            )`
          }}
        />

        {/* Shirt outline for definition */}
        <div 
          className="absolute inset-0 border-2 border-amber-600 rounded-lg"
          style={{
            clipPath: `polygon(
              42% 8%, 58% 8%, 58% 25%, 88% 25%, 92% 35%, 
              92% 75%, 88% 82%, 75% 82%, 75% 92%, 25% 92%, 
              25% 82%, 12% 82%, 8% 75%, 8% 35%, 12% 25%, 42% 25%
            )`
          }}
        />
      </div>
    </div>
  );
};

export default ShirtDisplay;
