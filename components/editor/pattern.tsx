import { allPatterns } from "@/app/editor/page";
import Image from "next/image";
import { Button } from "@/components/ui/button";
export type patternId = number;
const patternLocation = "/patterns";
const size = 80;

export default function PatternElement({
  onPatternSelect,
  selectPattern,
}: {
  onPatternSelect: (patternId: patternId) => void;
  selectPattern: patternId;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        onPatternSelect(selectPattern);
      }}
      className="p-0 border-2 border-amber-600 hover:border-amber-400 transition-all duration-200 hover:scale-105 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Image
        src={`${patternLocation}/${allPatterns[selectPattern+1]}`}
        alt=""
        width={size}
        height={size}
        className="object-cover w-full h-full"
      />
    </Button>
  );
}
