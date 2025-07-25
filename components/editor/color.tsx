"use client";
import { allColors } from "@/app/editor/page";
import { Button } from "@/components/ui/button";
export type colorId = number;
const size = "80px";

export default function ColorElement({
  previewColor,
  onColorSelect,
}: {
  previewColor: colorId;
  onColorSelect: (colorId: colorId) => void;
}) {
  return (
    <Button
      onClick={() => {
        onColorSelect(previewColor);
      }}
      variant="outline"
      size="icon"
      className="rounded-lg border-2 border-amber-600 hover:border-amber-400 transition-all duration-200 hover:scale-105"
      style={{
        backgroundColor: `#${allColors[previewColor]}`,
        width: size,
        height: size,
      }}
    />
  );
}
