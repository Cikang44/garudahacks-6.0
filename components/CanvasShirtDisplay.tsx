"use client";
import React, { useRef, useEffect, useMemo } from 'react';

type Cell = [number, number];

interface CanvasShirtDisplayProps {
  grid: Cell[][];
  gridWidth: number;
  scale?: number;
  id?: string;
}

// Vector points defining the shirt silhouette
interface ShirtVector {
  collar: { x: number; y: number }[];
  leftShoulder: { x: number; y: number }[];
  rightShoulder: { x: number; y: number }[];
  leftSleeve: { x: number; y: number }[];
  rightSleeve: { x: number; y: number }[];
  body: { x: number; y: number }[];
  leftArm: { x: number; y: number }[];
  rightArm: { x: number; y: number }[];
}

// Color dictionary for color mapping
const colorDictionary: { [key: number]: string } = {
  1: "#d2691e", // saddle brown
  2: "#cd5c5c", // indian red
  3: "#b22222", // fire brick
};

// Helper function to get color hex
const getColorHex = (colorID: number): string => {
  return colorDictionary[colorID] || "#ffffff";
};

const FORBIDDEN_CELL: Cell = [-1, -1];

// Function to find the most used pattern in the grid
const getMostUsedPattern = (grid: Cell[][]): { patternId: number; colorId: number } => {
  const patternCount: { [key: string]: { count: number; patternId: number; colorId: number } } = {};

  grid.forEach(row => {
    row.forEach(cell => {
      const [patternID, colorID] = cell;
      if (patternID > 0 && colorID > 0) {
        const key = `${patternID}-${colorID}`;
        if (!patternCount[key]) {
          patternCount[key] = { count: 0, patternId: patternID, colorId: colorID };
        }
        patternCount[key].count++;
      }
    });
  });

  let mostUsed = { patternId: 1, colorId: 1 };
  let maxCount = 0;

  Object.values(patternCount).forEach(pattern => {
    if (pattern.count > maxCount) {
      maxCount = pattern.count;
      mostUsed = { patternId: pattern.patternId, colorId: pattern.colorId };
    }
  });

  return mostUsed;
};

// Generate shirt vector points based on canvas dimensions
const generateShirtVectors = (width: number, height: number): ShirtVector => {
  const centerX = width / 2;
  const neckWidth = width * 0.16;
  const shoulderWidth = width * 0.46;
  const bodyWidth = width * 0.38;
  const sleeveLength = width * 0.2;
  
  return {
    collar: [
      { x: centerX - neckWidth/2, y: height * 0.08 },
      { x: centerX + neckWidth/2, y: height * 0.08 },
      { x: centerX + neckWidth/2, y: height * 0.15 },
      { x: centerX - neckWidth/2, y: height * 0.15 },
    ],
    leftShoulder: [
      { x: centerX - neckWidth/2, y: height * 0.15 },
      { x: centerX - shoulderWidth/2, y: height * 0.25 },
      { x: centerX - bodyWidth/2, y: height * 0.30 },
    ],
    rightShoulder: [
      { x: centerX + neckWidth/2, y: height * 0.15 },
      { x: centerX + shoulderWidth/2, y: height * 0.25 },
      { x: centerX + bodyWidth/2, y: height * 0.30 },
    ],
    body: [
      { x: centerX - bodyWidth/2, y: height * 0.30 },
      { x: centerX + bodyWidth/2, y: height * 0.30 },
      { x: centerX + bodyWidth/2, y: height * 0.85 },
      { x: centerX - bodyWidth/2, y: height * 0.85 },
    ],
    leftSleeve: [
      { x: centerX - shoulderWidth/2, y: height * 0.25 },
      { x: centerX - shoulderWidth/2 - sleeveLength, y: height * 0.28 },
      { x: centerX - shoulderWidth/2 - sleeveLength, y: height * 0.65 },
      { x: centerX - shoulderWidth/2, y: height * 0.68 },
    ],
    rightSleeve: [
      { x: centerX + shoulderWidth/2, y: height * 0.25 },
      { x: centerX + shoulderWidth/2 + sleeveLength, y: height * 0.28 },
      { x: centerX + shoulderWidth/2 + sleeveLength, y: height * 0.65 },
      { x: centerX + shoulderWidth/2, y: height * 0.68 },
    ],
    leftArm: [
      { x: centerX - bodyWidth/2, y: height * 0.30 },
      { x: centerX - shoulderWidth/2, y: height * 0.68 },
    ],
    rightArm: [
      { x: centerX + bodyWidth/2, y: height * 0.30 },
      { x: centerX + shoulderWidth/2, y: height * 0.68 },
    ],
  };
};

// Map grid coordinates to shirt regions
const mapGridToShirtRegion = (
  x: number, 
  y: number, 
  gridWidth: number, 
  gridHeight: number, 
  vectors: ShirtVector
): string | null => {
  const normalizedX = x / gridWidth;
  const normalizedY = y / gridHeight;
  
  // Define regions based on normalized coordinates
  if (normalizedY < 0.15 && normalizedX > 0.42 && normalizedX < 0.58) {
    return 'collar';
  } else if (normalizedY >= 0.15 && normalizedY < 0.30) {
    if (normalizedX < 0.42) return 'leftShoulder';
    if (normalizedX > 0.58) return 'rightShoulder';
  } else if (normalizedY >= 0.25 && normalizedY < 0.68) {
    if (normalizedX < 0.25) return 'leftSleeve';
    if (normalizedX > 0.75) return 'rightSleeve';
  } else if (normalizedY >= 0.30 && normalizedY < 0.85 && normalizedX >= 0.25 && normalizedX <= 0.75) {
    return 'body';
  }
  
  return null;
};

/**
 * CanvasShirtDisplay component that renders a shirt using HTML5 Canvas with vector points
 */
const CanvasShirtDisplay: React.FC<CanvasShirtDisplayProps> = ({ 
  grid, 
  gridWidth, 
  scale = 1, 
  id 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 300 * scale;
  const canvasHeight = 350 * scale;
  
  // Get the most used pattern from the grid
  const { patternId, colorId } = useMemo(() => getMostUsedPattern(grid), [grid]);
  
  // Generate shirt vectors
  const shirtVectors = useMemo(() => 
    generateShirtVectors(canvasWidth, canvasHeight), 
    [canvasWidth, canvasHeight]
  );

  // Pattern cache for performance
  const patternCache = useRef<{ [key: string]: HTMLImageElement }>({});

  // Load pattern image
  const loadPatternImage = (patternId: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const cacheKey = `batik${patternId}`;
      
      if (patternCache.current[cacheKey]) {
        resolve(patternCache.current[cacheKey]);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        patternCache.current[cacheKey] = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = `/patterns/Batik${patternId}.png`;
    });
  };

  // Draw a polygon from vector points
  const drawPolygon = (
    ctx: CanvasRenderingContext2D, 
    points: { x: number; y: number }[]
  ) => {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.closePath();
  };

  // Create pattern with color overlay
  const createColoredPattern = async (
    ctx: CanvasRenderingContext2D,
    patternImg: HTMLImageElement,
    colorHex: string
  ): Promise<CanvasPattern | null> => {
    // Create a temporary canvas for the colored pattern
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return null;

    tempCanvas.width = 100;
    tempCanvas.height = 100;

    // Draw the pattern
    tempCtx.drawImage(patternImg, 0, 0, 100, 100);

    // Apply color overlay using multiply blend mode
    tempCtx.globalCompositeOperation = 'multiply';
    tempCtx.fillStyle = colorHex;
    tempCtx.fillRect(0, 0, 100, 100);

    // Reset blend mode
    tempCtx.globalCompositeOperation = 'source-over';

    return ctx.createPattern(tempCanvas, 'repeat');
  };

  // Render the shirt
  const renderShirt = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    try {
      // Load pattern image
      const patternImg = await loadPatternImage(patternId);
      const colorHex = getColorHex(colorId);
      
      // Create colored pattern
      const pattern = await createColoredPattern(ctx, patternImg, colorHex);

      if (pattern) {
        ctx.fillStyle = pattern;
      } else {
        ctx.fillStyle = colorHex;
      }

      // Draw shirt parts using vector points
      ctx.save();

      // Draw collar
      drawPolygon(ctx, shirtVectors.collar);
      ctx.fill();
      ctx.strokeStyle = '#8b4513';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw body
      drawPolygon(ctx, shirtVectors.body);
      ctx.fill();
      ctx.stroke();

      // Draw left shoulder and sleeve
      drawPolygon(ctx, [...shirtVectors.leftShoulder, ...shirtVectors.leftSleeve.slice().reverse()]);
      ctx.fill();
      ctx.stroke();

      // Draw right shoulder and sleeve
      drawPolygon(ctx, [...shirtVectors.rightShoulder, ...shirtVectors.rightSleeve.slice().reverse()]);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Draw grid overlay for matrix representation
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.5;

      const cellWidth = canvasWidth / gridWidth;
      const cellHeight = canvasHeight / grid.length;

      // Draw grid lines
      for (let x = 0; x <= gridWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellWidth, 0);
        ctx.lineTo(x * cellWidth, canvasHeight);
        ctx.stroke();
      }

      for (let y = 0; y <= grid.length; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellHeight);
        ctx.lineTo(canvasWidth, y * cellHeight);
        ctx.stroke();
      }

      ctx.restore();

      // Highlight filled cells from the grid
      ctx.save();
      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          const [cellPatternId, cellColorId] = cell;
          if (cellPatternId > 0 && cellColorId > 0) {
            const region = mapGridToShirtRegion(x, y, gridWidth, grid.length, shirtVectors);
            if (region) {
              ctx.fillStyle = getColorHex(cellColorId);
              ctx.globalAlpha = 0.4;
              ctx.fillRect(
                x * cellWidth,
                y * cellHeight,
                cellWidth,
                cellHeight
              );
            }
          }
        });
      });
      ctx.restore();

    } catch (error) {
      console.error('Error rendering shirt:', error);
      
      // Fallback rendering without pattern
      ctx.fillStyle = getColorHex(colorId);
      drawPolygon(ctx, shirtVectors.collar);
      ctx.fill();
      drawPolygon(ctx, shirtVectors.body);
      ctx.fill();
      drawPolygon(ctx, [...shirtVectors.leftShoulder, ...shirtVectors.leftSleeve.slice().reverse()]);
      ctx.fill();
      drawPolygon(ctx, [...shirtVectors.rightShoulder, ...shirtVectors.rightSleeve.slice().reverse()]);
      ctx.fill();
    }
  };

  // Effect to render when component mounts or dependencies change
  useEffect(() => {
    renderShirt();
  }, [patternId, colorId, grid, scale]);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border-2 border-amber-600 rounded-lg shadow-lg bg-gray-50"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      
      {/* Pattern info overlay */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
        Pattern: {patternId} | Color: {colorId}
      </div>
    </div>
  );
};

export default CanvasShirtDisplay;
