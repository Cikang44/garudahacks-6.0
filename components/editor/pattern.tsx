import { allPatterns } from "@/app/editor/page";
import Image from "next/image";
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
    <div>
      <Image
        onClick={() => {
          onPatternSelect(selectPattern);
        }}
        src={`${patternLocation}/${allPatterns[selectPattern]}`}
        className="cursor-pointer"
        alt=""
        width={size}
        height={size}
      ></Image>
    </div>
  );
}
