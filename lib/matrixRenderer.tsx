import React from 'react';


interface MatrixDisplayProps {
  grid: [number, number][][];
  gridWidth: number;
}

/**
 * A dedicated component to render the matrix grid.
 * @param grid The 2D array representing the matrix data.
 * @param gridWidth The number of columns in the grid.
 * @returns JSX element representing the visual grid.
 */
const MatrixDisplay: React.FC<MatrixDisplayProps> = ({ grid, gridWidth }) => {
  if (!grid || grid.length === 0) {
    return <div>Loading Grid...</div>;
  }

  return (
    <main className="flex-1 flex justify-center items-center bg-white p-4 rounded-xl shadow-lg">
      <div
        className="grid gap-1 bg-gray-200 p-2"
        style={{ gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))` }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const [patternId, colorId] = cell;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-full aspect-square flex items-center justify-center bg-white border border-gray-300"
                title={`Tile (${rowIndex}, ${colIndex}) - Pattern: ${patternId}, Color: ${colorId}`}
              >
                <span className="text-xs text-black mix-blend-difference">
                  {patternId}
                </span>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};

export default MatrixDisplay;
