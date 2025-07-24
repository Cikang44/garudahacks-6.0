"use client";


import React, { useState } from 'react';
import MatrixDisplay from '../../../lib/matrixRenderer';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;

/**
 * Creates an initial grid (2D array) filled with a default value.
 * @returns A 2D array of a tuple of numbers.
 */
const createInitialGrid = (): [number, number][][] => {
  const defaultCell: [number, number] = [0, 0]; // e.g., pattern 0, colorId 0 (White)
  return Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(defaultCell));
};

export default function Matrix() {

  const [grid, setGrid] = useState<[number,number][][]>(createInitialGrid);

  const [rowInput, setRowInput] = useState<string>('0');
  const [colInput, setColInput] = useState<string>('0');
  const [colorInput, setColorInput] = useState<string>('0');
  const [patternInput, setPatternInput] = useState<string>('0');
  const [message, setMessage] = useState<string>('');


  const handleUpdateTile = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from reloading the page.

    const row = parseInt(rowInput);
    const col = parseInt(colInput);
    const patternId = parseInt(patternInput);
    const color = parseInt(colorInput);

    if (isNaN(row) || isNaN(col) || isNaN(patternId)) {
      setMessage('Please enter valid numbers for all fields.');
      return;
    }
    if (row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH) {
      setMessage(`Coordinates out of bounds. Row must be 0-${GRID_HEIGHT - 1}, Col must be 0-${GRID_WIDTH - 1}.`);
      return;
    }

    const newGrid = [];
    for (const row of grid) {
        const newRow = [...row];
        newGrid.push(newRow);
    }
    
    newGrid[row][col] = [patternId,color];
    setGrid(newGrid);
    setMessage(`Successfully updated tile at (${row}, ${col}) to pattern ${patternId} with the color ${colorInput}.`);
  };


  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex flex-col md:flex-row gap-8">
          {/* --- Control Panel --- */}
          <aside className="md:w-1/3 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Update a Tile</h2>
            <form onSubmit={handleUpdateTile} className="space-y-4">
              <div>
                <label htmlFor="row-input" className="block text-sm font-medium text-gray-600">Row (0-{GRID_HEIGHT - 1})</label>
                <input
                  id="row-input"
                  type="number"
                  value={rowInput}
                  onChange={(e) => setRowInput(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="col-input" className="block text-sm font-medium text-gray-600">Column (0-{GRID_WIDTH - 1})</label>
                <input
                  id="col-input"
                  type="number"
                  value={colInput}
                  onChange={(e) => setColInput(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="pattern-input" className="block text-sm font-medium text-gray-600">Pattern ID</label>
                <input
                  id="pattern-input"
                  type="number"
                  value={patternInput}
                  onChange={(e) => setPatternInput(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="color-input" className="block text-sm font-medium text-gray-600">Color</label>
                <input
                  id="color-input"
                  type="number"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Update Tile
              </button>
            </form>
            {message && (
              <p className="mt-4 text-sm text-center text-gray-600 bg-gray-50 p-3 rounded-lg">{message}</p>
            )}
          </aside>

          <MatrixDisplay grid={grid} gridWidth={GRID_WIDTH} />

        </div>
      </div>
    </div>
  );
}
