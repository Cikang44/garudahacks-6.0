"use client";
import ColorElement from "@/components/editor/color";
import ApparelPreview from "@/components/editor/preview";
import { colorId } from "@/components/editor/color";
import { patternId } from "@/components/editor/pattern";
import { useState } from "react";
import PatternElement from "@/components/editor/pattern";
import MatrixDisplay from "@/lib/matrixRenderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type cell = {
  selectedPatternId: number;
  selectedColorId: number;
};

type patternFile = string;
type patternDictionary = { [key: patternId]: patternFile; };
type hexColor = string;
type colorDictionary = { [key: colorId]: hexColor; };

export const allPatterns: patternDictionary = {
  // ID : FileName
  1: "Batik1.png",
  2: "Batik2.png",
  3: "Batik3.png",
}
export const allColors: colorDictionary = {
  // ID : hex
  1: "d2691e", // saddle brown
  2: "cd5c5c", // indian red
  3: "b22222", // fire brick
};

export default function Editor() {
  const [selectedCell, setSelectedCell] = useState<cell>({
    selectedColorId: 0,
    selectedPatternId: 0,
  });

  const gridWidth = 19;
  const gridHeight = 13;

  // Create a simple shirt pattern grid for demonstration
  const [shirtGrid, setShirtGrid] = useState(() => {
    const grid: [number, number][][] = [];
    for (let y = 0; y < gridHeight; y++) {
      const row: [number, number][] = [];
      for (let x = 0; x < gridWidth; x++) {
        if (
          ((x < 4 && y > 3 && y < 13) || (x > 7 && x < 11 && y > -1 && y < 3) || (x > 14 && x < 19 && y > 3 && y < 13))
        ) {
          row.push([-1, -1]);
        } else {
          row.push([0, 0]);
        }
      }
      grid.push(row);
    }
    return grid;
  });


  function selectColor(colorSelect: colorId) {
    if (!selectedCell) return;
    setSelectedCell((prev) => {
      if (!prev) return prev;
      else {
        return { ...prev, selectedColorId: colorSelect };
      }
    });
  }

  function selectPattern(patternSelect: patternId) {
    if (!selectedCell) return;
    setSelectedCell((prev) => {
      if (!prev) return prev;
      else {
        console.log(patternSelect);
        return { ...prev, selectedPatternId: patternSelect + 1 };
      }
    });
  }

  function handleCellClick(y: number, x: number) {
    const newGrid = [...shirtGrid];
    if (newGrid[y] && newGrid[y][x] && newGrid[y][x][0] !== -1) {
      newGrid[y][x] = [selectedCell.selectedPatternId, selectedCell.selectedColorId];
      setShirtGrid(newGrid);
    }
  }

  const currentPattern = allPatterns[selectedCell.selectedPatternId];
  const patternNames: { [key: number]: string; } = {
    1: "Tangerang",
    2: "Jawa",
    3: "STI"
  };

  const patternDescs: { [key: number]: string; } = {
    1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    2: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    3: "Ut enim ad minim veniam, quis nostrud exercitation ullamco."
  };
  return (
    <div className="flex flex-row bg-amber-900 text-white">
      {/* Color */}
      <Card className="w-32 bg-amber-800 border-amber-700 rounded-none flex flex-col justify-center items-center">
        <CardContent className="flex flex-col gap-4 p-10">
          {Object.keys(allColors).map((color) => (
            <ColorElement
              onColorSelect={selectColor}
              key={color}
              previewColor={parseInt(color)}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex-1 flex flex-col">
        {/* Matrix */}
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="bg-amber-700 border-amber-600 shadow-xl">
            <CardContent className="p-8">
              <MatrixDisplay
                grid={shirtGrid}
                gridWidth={gridWidth}
                onCellClick={handleCellClick}
              />
            </CardContent>
          </Card>
        </div>

        {/* Patterns */}
        <Card className="h-32 flex items-center justify-center bg-amber-800 border-amber-700 rounded-none">
          <CardContent className="flex flex-row gap-6 p-0">
            {Object.keys(allPatterns).map((pattern) => (
              <PatternElement
                key={pattern}
                selectPattern={parseInt(pattern) - 1}
                onPatternSelect={selectPattern}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pattern info */}
      <Card className="w-80 bg-amber-800 border-amber-700 rounded-none flex flex-col">
        <CardContent className="p-6 flex flex-col items-center">
          <Card className="w-64 h-64 bg-amber-700 border-amber-600 mb-4 overflow-hidden">
            <CardContent className="p-0 w-full h-full">
              <img
                src={`/patterns/${currentPattern}`}
                alt={patternNames[selectedCell.selectedPatternId]}
                className="w-full h-full object-cover"
              />
            </CardContent>
          </Card>
          <CardHeader className="text-center w-full">
            <CardTitle className="text-2xl font-bold mb-2 text-white">
              {patternNames[selectedCell.selectedPatternId]}
            </CardTitle>
            <CardDescription className="text-sm text-amber-200 text-justify mb-6 leading-relaxed">
              {patternDescs[selectedCell.selectedPatternId]}
            </CardDescription>
          </CardHeader>
          <Button
            className="bg-amber-600 hover:bg-amber-500 text-white"
            size="lg"
          >
            Save Design
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
