import ColorElement from "@/components/editor/color";
import ApparelPreview from "@/components/editor/preview";
import { colorId } from "@/components/editor/color";
const apparelId = 0;

type cell = {
  selectedPatternId: number;
  selectedColorId: number;
};

const selectedCell: cell = {
  selectedColorId: 2,
  selectedPatternId: 3,
};

type patternId = number;
type patternFile = string;
type patternDictionary = { [key: patternId]: patternFile };
type colorTable = colorId[];
type hexColor = string;
type colorDictionary = { [key: colorId]: hexColor };
const allPatterns: patternDictionary = {
  // ID : FileName
  198474: "Batik.png",
};
const allColors: colorDictionary = {
  // ID : hex
  234567: "123f4",
};

const apparelColors: colorTable = [];

export default function Editor() {
  return (
    <div>
      <div id="apparel-editor">
        <div id="pattern-palette"></div>
        <div id="apparel-preview">
          <ApparelPreview></ApparelPreview>
        </div>
        <div id="color-palette"></div>
      </div>
      <div id="info">
        <h2 id="pattern-name"></h2>
        <div id="pattern-preview"></div>
        <div id="pattern-desc"></div>
        <button id="summary-button"></button>
      </div>
    </div>
  );
}
