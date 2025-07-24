"use client";

import React from 'react';

type Cell = [number, number];

/**
 * The properties accepted by the MatrixDisplay component.
 */
interface MatrixDisplayProps {
  grid: Cell[][];
  gridWidth: number;
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
const MatrixDisplay: React.FC<MatrixDisplayProps> = ({ grid, gridWidth }) => {
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
              const imagePath = `/patterns/${patternID}.png`;

              return (
                <div
                  key={`cell-${y}-${x}`}
                  className="w-12 h-12 bg-gray-200 border border-gray-700 rounded-md relative"
                  title={`Coords: (${y}, ${x})\nPattern: ${patternID}\nColor: ${colorID}`}
                >
                  <img
                    src={imagePath}
                    alt={`Pattern ID ${patternID}`}
                    className="w-full h-full object-cover rounded-md"
                    // Optional: Add an error handler for missing images
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none'; // Hide broken image icon
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