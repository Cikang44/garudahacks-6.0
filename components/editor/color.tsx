"use client";
import { allColors } from "@/app/editor/page";
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
    <button
      onClick={() => {
        onColorSelect(previewColor);
      }}
      className={` cursor-pointer rounded-lg`}
      style={{
        backgroundColor: `#${allColors[previewColor]}`,
        width: size,
        height: size,
      }}
    ></button>
  );
}
