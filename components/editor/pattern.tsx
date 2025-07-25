import Image from "next/image";
import { Button } from "@/components/ui/button";
export type patternId = string;
const patternLocation = "/patterns";
const size = 80;

export default function PatternElement({
  onPatternSelect,
  selectPattern,
  allPatterns,
  isSelected = false,
}: {
  onPatternSelect: (patternId: patternId) => void;
  selectPattern: patternId;
  allPatterns: any;
  isSelected?: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        onPatternSelect(selectPattern);
      }}
      className={`p-0 border-2 transition-all duration-200 hover:scale-105 overflow-hidden ${
        isSelected 
          ? 'border-yellow-400 border-4 shadow-lg shadow-yellow-400/50 ring-2 ring-yellow-300' 
          : 'border-amber-600 hover:border-amber-400'
      }`}
      style={{ width: size, height: size }}
    >
      <Image
        src={allPatterns[selectPattern].imageUrl}
        alt=""
        width={size}
        height={size}
        className="object-cover w-full h-full"
      />
    </Button>
  );
}
