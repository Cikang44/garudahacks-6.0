"use client";
import React, { useRef, useEffect, useState } from 'react';

type Cell = [number, number];

interface CanvasMatrixDisplayProps {
  grid: Cell[][];
  gridWidth: number;
  onCellClick?: (y: number, x: number) => void;
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

/**
 * CanvasMatrixDisplay component that renders a grid using HTML5 Canvas with vector-based shirt outline
 */
const CanvasMatrixDisplay: React.FC<CanvasMatrixDisplayProps> = ({ 
  grid, 
  gridWidth, 
  onCellClick 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  
  const cellSize = 24; // Size of each grid cell
  const canvasWidth = gridWidth * cellSize;
  const canvasHeight = grid.length * cellSize;

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

  // Draw shirt silhouette outline using vector points
  const drawShirtOutline = (ctx: CanvasRenderingContext2D) => {
    const width = canvasWidth;
    const height = canvasHeight;
    
    ctx.save();
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    // Define shirt outline using vector points
    ctx.beginPath();
    
    // Collar
    ctx.moveTo(width * 0.42, height * 0.08);
    ctx.lineTo(width * 0.58, height * 0.08);
    ctx.lineTo(width * 0.58, height * 0.15);
    
    // Right shoulder to sleeve
    ctx.lineTo(width * 0.75, height * 0.25);
    ctx.lineTo(width * 0.88, height * 0.25);
    ctx.lineTo(width * 0.92, height * 0.35);
    ctx.lineTo(width * 0.92, height * 0.75);
    ctx.lineTo(width * 0.88, height * 0.82);
    ctx.lineTo(width * 0.75, height * 0.82);
    
    // Right side of body
    ctx.lineTo(width * 0.75, height * 0.92);
    ctx.lineTo(width * 0.25, height * 0.92);
    
    // Left side of body
    ctx.lineTo(width * 0.25, height * 0.82);
    ctx.lineTo(width * 0.12, height * 0.82);
    ctx.lineTo(width * 0.08, height * 0.75);
    ctx.lineTo(width * 0.08, height * 0.35);
    ctx.lineTo(width * 0.12, height * 0.25);
    ctx.lineTo(width * 0.25, height * 0.25);
    
    // Left shoulder back to collar
    ctx.lineTo(width * 0.42, height * 0.15);
    ctx.closePath();
    
    ctx.stroke();
    ctx.restore();
  };

  // Check if a cell is within the shirt boundary
  const isCellInShirt = (x: number, y: number): boolean => {
    const normalizedX = x / gridWidth;
    const normalizedY = y / grid.length;
    
    // Collar area
    if (normalizedY <= 0.15 && normalizedX >= 0.42 && normalizedX <= 0.58) {
      return true;
    }
    
    // Main body area
    if (normalizedY > 0.15 && normalizedY <= 0.92 && normalizedX >= 0.25 && normalizedX <= 0.75) {
      return true;
    }
    
    // Sleeve areas
    if (normalizedY > 0.25 && normalizedY <= 0.82) {
      if ((normalizedX >= 0.08 && normalizedX < 0.25) || (normalizedX > 0.75 && normalizedX <= 0.92)) {
        return true;
      }
    }
    
    return false;
  };

  // Render the grid
  const renderGrid = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid cells
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const [patternID, colorID] = grid[y][x];
        const cellX = x * cellSize;
        const cellY = y * cellSize;
        
        const isForbidden = patternID === FORBIDDEN_CELL[0] && colorID === FORBIDDEN_CELL[1];
        const isInShirt = isCellInShirt(x, y);
        
        if (isForbidden || !isInShirt) {
          // Transparent or out-of-bounds cell
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
          continue;
        }

        // Draw cell background
        if (patternID === 0 && colorID === 0) {
          // Empty cell - show as light gray
          ctx.fillStyle = '#e5e7eb';
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
        } else if (patternID > 0 && colorID > 0) {
          try {
            // Try to load and draw pattern
            const patternImg = await loadPatternImage(patternID);
            
            // Create a temporary canvas for the pattern
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
              tempCanvas.width = cellSize;
              tempCanvas.height = cellSize;
              
              // Draw pattern
              tempCtx.drawImage(patternImg, 0, 0, cellSize, cellSize);
              
              // Apply color overlay
              tempCtx.globalCompositeOperation = 'multiply';
              tempCtx.fillStyle = getColorHex(colorID);
              tempCtx.globalAlpha = 0.7;
              tempCtx.fillRect(0, 0, cellSize, cellSize);
              
              // Draw the result to main canvas
              ctx.drawImage(tempCanvas, cellX, cellY);
            }
          } catch (error) {
            // Fallback to solid color
            ctx.fillStyle = getColorHex(colorID);
            ctx.fillRect(cellX, cellY, cellSize, cellSize);
          }
        }

        // Draw cell border
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);

        // Highlight hovered cell
        if (hoveredCell && hoveredCell.x === x && hoveredCell.y === y) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
          ctx.fillRect(cellX, cellY, cellSize, cellSize);
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.strokeRect(cellX, cellY, cellSize, cellSize);
        }
      }
    }

    // Draw shirt outline on top
    drawShirtOutline(ctx);
  };

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onCellClick) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor(((event.clientX - rect.left) * scaleX) / cellSize);
    const y = Math.floor(((event.clientY - rect.top) * scaleY) / cellSize);

    if (x >= 0 && x < gridWidth && y >= 0 && y < grid.length && isCellInShirt(x, y)) {
      onCellClick(y, x);
    }
  };

  // Handle canvas mouse move
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor(((event.clientX - rect.left) * scaleX) / cellSize);
    const y = Math.floor(((event.clientY - rect.top) * scaleY) / cellSize);

    if (x >= 0 && x < gridWidth && y >= 0 && y < grid.length && isCellInShirt(x, y)) {
      setHoveredCell({ x, y });
    } else {
      setHoveredCell(null);
    }
  };

  // Handle canvas mouse leave
  const handleCanvasMouseLeave = () => {
    setHoveredCell(null);
  };

  // Effect to render when component mounts or dependencies change
  useEffect(() => {
    renderGrid();
  }, [grid, hoveredCell]);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border-2 border-gray-300 rounded-lg shadow-lg bg-white cursor-pointer"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
      />
      
      {/* Grid info overlay */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
        {gridWidth} × {grid.length} grid
        {hoveredCell && ` | Cell: (${hoveredCell.x}, ${hoveredCell.y})`}
      </div>
    </div>
  );
};

export default CanvasMatrixDisplay;
