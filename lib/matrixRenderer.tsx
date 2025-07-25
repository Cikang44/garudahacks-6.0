"use client";

import React from 'react';

type Cell = [string, number];

// Color dictionary for color mapping
const colorDictionary: { [key: number]: string } = {
  0: "d2691e", // saddle brown
  1: "cd5c5c", // indian red
  2: "b22222", // fire brick
};

// Helper function to get color hex
const getColorHex = (colorID: number): string => {
  return colorDictionary[colorID] || "ffffff";
};

/**
 * The properties accepted by the MatrixDisplay component.
 */
interface MatrixDisplayProps {
  /** The grid matrix to display. */
  grid: Cell[][];
  /** The width of the grid. */
  gridWidth: number;
  /** Optional callback function called when a cell is clicked. */
  onCellClick?: (y: number, x: number) => void;
  /** Pattern dictionary to resolve pattern IDs to image paths */
  allPatterns?: { [key: string]: any };
  /** Color dictionary to resolve color IDs to hex values */
  allColors?: { [key: number]: string };
}

/**
 * A constant representing the value of a forbidden or inaccessible cell.
 */
const FORBIDDEN_CELL: Cell = ["-1", -1];

/**
 * A React component that renders a 2D grid.
 * It displays a specific PNG image based on the cell's patternID.
 *
 * @param {MatrixDisplayProps} props - The component's properties.
 * @returns {JSX.Element} The rendered grid display.
 */
const MatrixDisplay: React.FC<MatrixDisplayProps> = ({ grid, gridWidth, onCellClick, allPatterns, allColors }) => {
  return (
    <main className="flex-grow bg-white p-4 rounded-xl shadow-md overflow-auto">
      <div
        className="grid gap-1 justify-start"
        style={{ gridTemplateColumns: `repeat(${gridWidth}, max-content)` }}
      >
        {grid.map((row, y) => (
          <React.Fragment key={`row-${y}`}>
            {row.map((cell, x) => {
              const [patternID, colorID] = cell;
              const isForbidden = patternID === FORBIDDEN_CELL[0] && colorID === FORBIDDEN_CELL[1];

              if (isForbidden) {
                return <div key={`cell-${y}-${x}`} className="w-12 h-12" />;
              }

              // Get the pattern image path from the pattern dictionary
              // If no allPatterns provided, fallback to old logic
              let imagePath: string;
              if (allPatterns && allPatterns[patternID] && allPatterns[patternID].imageUrl) {
                imagePath = allPatterns[patternID].imageUrl;
              } else {
                // Fallback to old path construction
                imagePath = `/patterns/Batik${patternID}.png`;
              }

              // Helper function to convert hex to HSL for better color blending
              const hexToHsl = (hex: string) => {
                const r = parseInt(hex.slice(0, 2), 16) / 255;
                const g = parseInt(hex.slice(2, 4), 16) / 255;
                const b = parseInt(hex.slice(4, 6), 16) / 255;
                
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                let h = 0, s = 0, l = (max + min) / 2;
                
                if (max !== min) {
                  const d = max - min;
                  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                  switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                  }
                  h /= 6;
                }
                
                return { h: h * 360, s: s * 100, l: l * 100 };
              };

              // Get color for this cell
              const colorHex = allColors && allColors[colorID] ? allColors[colorID] : getColorHex(colorID);
              const shouldApplyColor = colorID !== 0; // Don't apply color for ID 0 (default)
              
              let filterStyle = '';
              let overlayOpacity = 0;
              
              if (shouldApplyColor) {
                const { h, s, l } = hexToHsl(colorHex);
                filterStyle = `hue-rotate(${h - 180}deg) saturate(${Math.max(50, s)}%) brightness(${Math.max(80, l)}%)`;
                overlayOpacity = 0.25;
              }

              return (
                <div
                  key={`cell-${y}-${x}`}
                  className="w-12 h-12 bg-gray-200 border border-gray-700 rounded-md relative cursor-pointer hover:border-blue-500 transition-colors overflow-hidden"
                  title={`Coords: (${y}, ${x})\nPattern: ${patternID}\nColor: ${colorID}`}
                  onClick={() => onCellClick?.(y, x)}
                >
                  {/* Pattern background */}
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backgroundImage: `url(${imagePath})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      filter: filterStyle,
                    }}
                  />
                  
                  {/* Color overlay for better color blending (only if color is applied) */}
                  {shouldApplyColor && (
                    <div 
                      className="absolute inset-0 rounded-md mix-blend-overlay"
                      style={{
                        backgroundColor: `#${colorHex}`,
                        opacity: overlayOpacity,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </main>
  );
};

export default MatrixDisplay;