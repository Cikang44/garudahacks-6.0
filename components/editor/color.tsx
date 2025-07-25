"use client";
import { allColors } from "@/app/editor/page";
import { Button } from "@/components/ui/button";
export type colorId = number;
const size = "80px";

export default function ColorElement({
  previewColor,
  onColorSelect,
  isSelected = false,
}: {
  previewColor: colorId;
  onColorSelect: (colorId: colorId) => void;
  isSelected?: boolean;
}) {
  return (
    <Button
      onClick={() => {
        onColorSelect(previewColor);
      }}
      variant="outline"
      size="icon"
      className={`rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
        isSelected 
          ? 'border-yellow-400 border-4 shadow-lg shadow-yellow-400/50 ring-2 ring-yellow-300' 
          : 'border-amber-600 hover:border-amber-400'
      }`}
      style={{
        backgroundColor: `#${allColors[previewColor]}`,
        width: size,
        height: size,
      }}
    />
  );
}
