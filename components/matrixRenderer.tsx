"use client";

import React, { useState, useEffect } from "react";
import { useImageProcessor } from "../lib/hooks/useImageProcessor"; // Assuming hook is in this path

// --- Corrected and Expanded Types and Constants ---

type Cell = [number, number];

/**
 * A mapping from a color ID number to a hex color string.
 * NOTE: Hex colors must start with '#' and be 6 characters long.
 */
const allColors: Record<number, string> = {
  0: "#FFFFFF", // White
  1: "#FF5733", // Orange
  2: "#33FF57", // Green
  // ...add all your other color mappings here
};

/**
 * The properties accepted by the main MatrixDisplay component.
 */
interface MatrixDisplayProps {
  grid: Cell[][];
  gridWidth: number;
}

/**
 * A constant representing a forbidden or inaccessible cell.
 */
const FORBIDDEN_CELL: Cell = [-1, -1];

// --- New CellDisplay Component ---

/**
 * The properties for a single cell component.
 */
interface CellDisplayProps {
  patternID: number;
  colorID: number;
  processImage: (imageUrl: string, colorHex: string) => Promise<string>;
}

/**
 * Renders a single cell. It fetches a pattern image, processes it with
 * the specified color, and displays it. Manages its own loading state.
 */
const CellDisplay = React.memo(
  ({ patternID, colorID, processImage }: CellDisplayProps) => {
    const [processedSrc, setProcessedSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      let isMounted = true; // Flag to prevent state updates on unmounted component

      const runProcessing = async () => {
        setIsLoading(true);
        const imageUrl = `/patterns/${patternID}.png`;
        const hexColor = allColors[colorID] || "#000000"; // Fallback to black

        try {
          const newSrc = await processImage(imageUrl, hexColor);
          if (isMounted) {
            setProcessedSrc(newSrc);
          }
        } catch (error) {
          console.error(
            `Failed to process image for pattern ${patternID}`,
            error
          );
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      runProcessing();

      // Cleanup function runs when component unmounts
      return () => {
        isMounted = false;
      };
    }, [patternID, colorID, processImage]); // Re-run if props change

    // While processing, show a placeholder
    if (isLoading) {
      return <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-md" />;
    }

    // Render the final processed image
    return (
      <img
        src={processedSrc || ""}
        alt={`Pattern ID ${patternID}`}
        className="w-full h-full object-cover rounded-md"
      />
    );
  }
);
CellDisplay.displayName = "CellDisplay"; // For better debugging

// --- Modified MatrixDisplay Component ---

/**
 * The main component that renders the entire 2D grid by arranging
 * multiple CellDisplay components.
 */
function MatrixDisplay({ grid, gridWidth }: MatrixDisplayProps) {
  // Hook is called once in the parent and the function is passed down.
  const { processImage } = useImageProcessor();

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
              const isForbidden =
                patternID === FORBIDDEN_CELL[0] &&
                colorID === FORBIDDEN_CELL[1];

              const cellKey = `cell-${y}-${x}`;

              if (isForbidden) {
                return <div key={cellKey} className="w-12 h-12" />;
              }

              console.log(`processing [${x}, ${y}]`);
              // The outer div provides a consistent border and background
              return (
                <div
                  key={cellKey}
                  className="w-12 h-12 bg-gray-100 border border-gray-300 rounded-md relative"
                  title={`Coords: (${y}, ${x})\nPattern: ${patternID}\nColor: ${allColors[colorID]}`}
                >
                  <CellDisplay
                    patternID={patternID}
                    colorID={colorID}
                    processImage={processImage}
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </main>
  );
}

export default MatrixDisplay;
