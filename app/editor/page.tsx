"use client";
import ColorElement from "@/components/editor/color";
import ApparelPreview from "@/components/editor/preview";
import { colorId } from "@/components/editor/color";
import { useState } from "react";
const apparelId = 0;

type cell = {
  selectedPatternId: number;
  selectedColorId: number;
};

type patternId = number;
type patternFile = string;
type patternDictionary = { [key: patternId]: patternFile };
type colorTable = colorId[];
type hexColor = string;
type colorDictionary = { [key: colorId]: hexColor };
export const allPatterns: patternDictionary = {
  // ID : FileName
  198474: "Batik.png",
};
export const allColors: colorDictionary = {
  // ID : hex
  0: "0c0c0d",
  1: "0386cc",
  2: "345a1e",
};

const apparelColors: colorTable = [0, 1, 2];

export default function Editor() {
  const [selectedCell, setSelectedCell] = useState<cell>({
    selectedColorId: 0,
    selectedPatternId: 0,
  });

  function selectColor(colorSelect: colorId) {
    if (!selectedCell) return;
    setSelectedCell((prev) => {
      if (!prev) return prev;
      else {
        console.log(colorSelect);
        return { ...prev, selectedColorId: colorSelect };
      }
    });
  }

  function selectPattern() {}
  return (
    <div className="w-screen h-screen flex flex-row justify-center items-center py-10 gap-10">
      <div
        id="apparel-editor"
        className="w-[70%] items-center justify-center flex flex-row bg-black h-full"
      >
        <div id="pattern-palette"></div>
        <div id="apparel-preview">
          <ApparelPreview></ApparelPreview>
        </div>
        <div id="color-palette" className="flex flex-row gap-5">
          {apparelColors.map((color) => (
            <ColorElement
              onColorSelect={selectColor}
              key={color}
              previewColor={color}
            ></ColorElement>
          ))}
        </div>
      </div>
      <div id="info" className="w-[20%] bg-black h-full">
        <h2 id="pattern-name"></h2>
        <div id="pattern-preview"></div>
        <div id="pattern-desc"></div>
        <button id="summary-button"></button>
      </div>
    </div>
  );
}
