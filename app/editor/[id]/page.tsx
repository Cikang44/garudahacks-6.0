"use client";
import { use } from "react";
import ColorElement from "@/components/editor/color";
import { colorId } from "@/components/editor/color";
import { useState } from "react";
import PatternElement from "@/components/editor/pattern";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MatrixDisplay from "@/lib/matrixRenderer";
import useSWR from "swr";

type cell = {
  selectedPatternId: string;
  selectedColorId: number;
};

type patternFile = any;
type patternDictionary = { [key: string]: patternFile };
type colorTable = colorId[];
type patternTable = string[];
type hexColor = string;
type colorDictionary = { [key: colorId]: hexColor };

// export const allPatterns: patternDictionary = {
//   // ID : FileName
//   1: "Batik1.png",
//   2: "Batik2.png",
//   3: "Batik3.png",
// };

export const allColors: colorDictionary = {
  // ID : hex
  1: "0c0c0d",
  2: "0386cc",
  3: "345a1e",
};

const apparelColors: colorTable = [0, 1, 2];
const userPatterns: patternTable = ["0", "1", "2"];

const fetcher = (url: string) => fetch(url).then((v) => v.json());

export default function Editor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [selectedCell, setSelectedCell] = useState<cell>({
    selectedColorId: 0,
    selectedPatternId: "0",
  });
  const [message, setMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const gridWidth = 19;
  const gridHeight = 13;

  // Create a simple shirt pattern grid for demonstration
  const [shirtGrid, setShirtGrid] = useState(() => {
    const grid: [string, number][][] = [];
    for (let y = 0; y < gridHeight; y++) {
      const row: [string, number][] = [];
      for (let x = 0; x < gridWidth; x++) {
        if (
          (x < 4 && y > 3 && y < 13) ||
          (x > 7 && x < 11 && y > -1 && y < 3) ||
          (x > 14 && x < 19 && y > 3 && y < 13)
        ) {
          row.push(["-1", -1]);
        } else {
          row.push(["0", 0]);
        }
      }
      grid.push(row);
    }
    return grid;
  });

  const handleSaveData = async () => {
    setIsSaving(true);
    setMessage("Saving...");

    try {
      const payload = {
        id: id,
        data: shirtGrid,
      };
      const response = await fetch("/api/save-grid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save the grid.");
      }

      const result = await response.json();
      setMessage(`Grid saved successfully!`);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  function selectColor(colorSelect: colorId) {
    if (!selectedCell) return;
    setSelectedCell((prev) => {
      if (!prev) return prev;
      else {
        return { ...prev, selectedColorId: colorSelect };
      }
    });
  }
  
  function selectPattern(patternSelect: string) {
    if (!selectedCell) return;
    setSelectedCell((prev) => {
      if (!prev) return prev;
      else {
        console.log(patternSelect);
        return { ...prev, selectedPatternId: patternSelect };
      }
    });
  }

  function handleCellClick(y: number, x: number) {
    const newGrid = [...shirtGrid];
    if (newGrid[y] && newGrid[y][x] && newGrid[y][x][0] !== "-1") {
      newGrid[y][x] = [selectedCell.selectedPatternId, selectedCell.selectedColorId];
      setShirtGrid(newGrid);
    }
  }

  const { data, isLoading, error } = useSWR('/api/pattern', fetcher);

  if (!data) return <div>Error</div>;

  const allPatterns: patternDictionary = Object.fromEntries(data.map((v: any) => [v.id.toString(), v]));
  const patternNames: {[key: string]:string;} = Object.fromEntries(data.map((v: any) => [v.id.toString(), v.names]));
  const patternDescs: { [key: string]: string; } = Object.fromEntries(data.map((v: any) => [v.id.toString(), v.description]));
  const currentPattern = allPatterns[selectedCell.selectedPatternId];
  // const patternNames: { [key: number]: string; } = {
  //   1: "Tangerang",
  //   2: "Jawa",
  //   3: "STI"
  // };

  // const patternDescs: { [key: number]: string; } = {
  //   1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   2: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  //   3: "Ut enim ad minim veniam, quis nostrud exercitation ullamco."
  // };
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
              isSelected={selectedCell.selectedColorId === parseInt(color)}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex-1 flex flex-col">
        {/* Matrix */}
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="bg-secondary shadow-xl">
            <CardContent className="p-8">
              <MatrixDisplay
                grid={shirtGrid}
                gridWidth={gridWidth}
                onCellClick={handleCellClick}
                allPatterns={allPatterns}
                allColors={allColors}
              />
            </CardContent>
          </Card>
        </div>

        {/* Patterns */}
        <Card className="h-32 flex items-center justify-center bg-secondary rounded-md">
          <CardContent className="flex flex-row gap-6 p-0">
            {Object.entries(allPatterns).map(([id, pattern]) => (
              <PatternElement
                key={id}
                selectPattern={id}
                onPatternSelect={selectPattern}
                allPatterns={allPatterns}
                isSelected={selectedCell.selectedPatternId === id}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pattern info */}
      <Card className="w-80 rounded-none flex flex-col">
        <CardContent className="p-6 flex flex-col items-center">
          <Card className="w-64 h-64 bg-secondary mb-4 overflow-hidden">
            <CardContent className="p-0 w-full h-full">
              {allPatterns[selectedCell.selectedPatternId]?.imageUrl ? (
              <img
                src={allPatterns[selectedCell.selectedPatternId]?.imageUrl}
                alt={patternNames[selectedCell.selectedPatternId]}
                className="w-full h-full object-cover"
              />
              ) : (
              <div className="w-full h-full flex items-center justify-center text-amber-300">
                No image available
              </div>
              )}
            </CardContent>
          </Card>
          <CardHeader className="text-center w-full">
            <CardTitle className="text-2xl font-bold mb-2 text-white">
              {patternNames[selectedCell.selectedPatternId]}
            </CardTitle>
            <CardDescription className="text-sm text-amber-200 text-justify mb-6 leading-relaxed">
              {patternDescs[selectedCell.selectedPatternId]}
            </CardDescription>
            
            {/* Current Selection Display */}
            <div className="bg-amber-700 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-2 text-yellow-300">Current Selection</h3>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-amber-200">Pattern:</span>
                  <span className="bg-amber-600 px-2 py-1 rounded text-white font-medium">
                    {patternNames[selectedCell.selectedPatternId] || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-200">Color:</span>
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-4 h-4 rounded border border-amber-400"
                      style={{ backgroundColor: `#${allColors[selectedCell.selectedColorId]}` }}
                    />
                    <span className="bg-amber-600 px-2 py-1 rounded text-white font-medium">
                      #{allColors[selectedCell.selectedColorId]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <Button
            className="bg-amber-600 hover:bg-amber-500 text-white"
            size="lg"
            onClick={handleSaveData}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Design'}
          </Button>
          
          {/* Status Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
              message.includes('successfully') 
                ? 'bg-green-800 text-green-200 border border-green-600' 
                : message.includes('error') 
                ? 'bg-red-800 text-red-200 border border-red-600'
                : 'bg-amber-600 text-amber-200 border border-amber-500'
            }`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
