"use client";

import React from 'react';

type Cell = [number, number];

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
  grid: Cell[][];
  gridWidth: number;
  onCellClick?: (y: number, x: number) => void;
}

/**
 * A constant representing the value of a forbidden or inaccessible cell.
 */
const FORBIDDEN_CELL: Cell = [-1, -1];

/**
 * A React component that renders a 2D grid.
 * It displays a specific PNG image based on the cell's patternID.
 *
 * @param {MatrixDisplayProps} props - The component's properties.
 * @returns {JSX.Element} The rendered grid display.
 */
const MatrixDisplay: React.FC<MatrixDisplayProps> = ({ grid, gridWidth, onCellClick }) => {
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

              // Dynamically construct the path to the image in the public folder.
              const imagePath = `/patterns/Batik${patternID}.png`;

              return (
                <div
                  key={`cell-${y}-${x}`}
                  className="w-12 h-12 bg-gray-200 border border-gray-700 rounded-md relative cursor-pointer hover:border-blue-500 transition-colors"
                  title={`Coords: (${y}, ${x})\nPattern: ${patternID}\nColor: ${colorID}`}
                  onClick={() => onCellClick?.(y, x)}
                  style={{
                    backgroundImage: `url(${imagePath})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: `hue-rotate(${colorID * 60}deg) saturate(1.2)`, // Apply color variation based on colorID
                  }}
                >
                  {/* Optional overlay for color tinting */}
                  <div 
                    className="absolute inset-0 rounded-md opacity-30 mix-blend-multiply"
                    style={{
                      backgroundColor: `#${getColorHex(colorID)}`,
                    }}
                  />
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