"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import MatrixDisplay from "@/lib/matrixRenderer";
import CanvasMatrixDisplay from "@/components/CanvasMatrixDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";

// Product data structure
type ProductGrid = [number, number][][];

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  grid: ProductGrid;
  gridWidth: number;
  gridHeight: number;
  creator: string;
  createdAt: string;
}

// Pattern and color dictionaries
const allPatterns: { [key: number]: string; } = {
  1: "Batik1.png",
  2: "Batik2.png",
  3: "Batik3.png",
};

const allColors: { [key: number]: string; } = {
  1: "d2691e", // saddle brown
  2: "cd5c5c", // indian red
  3: "b22222", // fire brick
};

const patternNames: { [key: number]: string; } = {
  1: "Aceh Traditional",
  2: "Javanese Heritage",
  3: "Balinese Classic"
};

const patternDescs: { [key: number]: string; } = {
  1: "Traditional Acehnese batik pattern featuring intricate geometric designs that represent the rich cultural heritage of Aceh region.",
  2: "Classic Javanese batik with elegant flowing motifs that symbolize harmony and balance in traditional Indonesian art.",
  3: "Balinese batik pattern inspired by Hindu-Buddhist traditions, featuring ornate decorative elements and spiritual symbolism."
};

// Mock product data - in a real app this would come from an API
const mockProducts: { [key: string]: Product; } = {
  "1": {
    id: "1",
    name: "Royal Aceh Heritage Shirt",
    description: "An exquisite batik shirt featuring traditional Acehnese patterns. This piece combines modern tailoring with centuries-old design traditions, creating a timeless garment perfect for formal occasions.",
    price: 299.99,
    creator: "Master Artisan Sari",
    createdAt: "2024-12-15",
    gridWidth: 19,
    gridHeight: 13,
    grid: (() => {
      const grid: ProductGrid = [];
      for (let y = 0; y < 13; y++) {
        const row: [number, number][] = [];
        for (let x = 0; x < 19; x++) {
          if (
            ((x < 4 && y > 3 && y < 13) || (x > 7 && x < 11 && y > -1 && y < 3) || (x > 14 && x < 19 && y > 3 && y < 13))
          ) {
            row.push([-1, -1]);
          } else {
            // Create a pattern with different batik designs
            const patternId = Math.floor(Math.random() * 3) + 1;
            const colorId = Math.floor(Math.random() * 3) + 1;
            row.push([patternId, colorId]);
          }
        }
        grid.push(row);
      }
      return grid;
    })(),
  },
  "2": {
    id: "2",
    name: "Elegant Javanese Formal Wear",
    description: "A sophisticated batik shirt showcasing the refined beauty of Javanese artistic traditions. Perfect for business meetings or cultural events.",
    price: 349.99,
    creator: "Designer Indira",
    createdAt: "2024-12-10",
    gridWidth: 19,
    gridHeight: 13,
    grid: (() => {
      const grid: ProductGrid = [];
      for (let y = 0; y < 13; y++) {
        const row: [number, number][] = [];
        for (let x = 0; x < 19; x++) {
          if (
            ((x < 4 && y > 3 && y < 13) || (x > 7 && x < 11 && y > -1 && y < 3) || (x > 14 && x < 19 && y > 3 && y < 13))
          ) {
            row.push([-1, -1]);
          } else {
            row.push([2, 2]); // Predominantly Javanese pattern
          }
        }
        grid.push(row);
      }
      return grid;
    })(),
  }
};

export default function ProductView() {
  const params = useParams();
  const productId = params.id as string;
  const product = mockProducts[productId];

  const [selectedCell, setSelectedCell] = useState<{
    x: number;
    y: number;
    patternId: number;
    colorId: number;
  } | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);

  // Handle cell clicks to show pattern information
  function handleCellClick(y: number, x: number) {
    if (product.grid[y] && product.grid[y][x]) {
      const [patternId, colorId] = product.grid[y][x];
      if (patternId !== -1) {
        setSelectedCell({ x, y, patternId, colorId });
      }
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-amber-900 flex items-center justify-center">
        <Card className="p-8">
          <CardContent>
            <h1 className="text-2xl font-bold text-center">Product not found</h1>
            <Link href="/catalog">
              <Button className="mt-4 w-full">Back to Catalog</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-900 text-white">
      {/* Header */}
      <div className="bg-amber-800 p-4 flex items-center justify-between border-b border-amber-700">
        <Link href="/catalog">
          <Button variant="ghost" size="icon" className="text-white hover:bg-amber-700">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Product Details</h1>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-amber-700"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`h-6 w-6 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Matrix Display */}
          <Card className="bg-amber-700 border-amber-600 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Product Design View
                </h3>
                <p className="text-amber-200 text-sm">Click on patterns to view details</p>
              </div>
              <CanvasMatrixDisplay
                grid={product.grid}
                gridWidth={product.gridWidth}
                onCellClick={handleCellClick}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Pattern Details */}
        <div className="w-full bg-amber-800 border-l border-amber-700">
          <div className="p-6">
            <h3 className="text-xl text-center font-bold text-white mb-4">
              Batik #{product.id}
            </h3>



            {selectedCell ? (
              <Card className="bg-amber-700 border-amber-600">
                <CardContent className="p-4">
                  <div className="mb-4">
                    <img
                      src={`/patterns/${allPatterns[selectedCell.patternId]}`}
                      alt={patternNames[selectedCell.patternId]}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  <CardTitle className="text-lg font-bold text-white mb-2">
                    {patternNames[selectedCell.patternId]}
                  </CardTitle>

                  <CardDescription className="text-amber-200 text-sm text-justify mb-4 leading-relaxed">
                    {patternDescs[selectedCell.patternId]}
                  </CardDescription>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-300">Position:</span>
                      <span className="text-white">({selectedCell.x}, {selectedCell.y})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-300">Pattern ID:</span>
                      <span className="text-white">{selectedCell.patternId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-300">Color:</span>
                      <div
                        className="w-6 h-6 rounded border-2 border-amber-400"
                        style={{ backgroundColor: `#${allColors[selectedCell.colorId]}` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-amber-700 border-amber-600">
                <CardContent className="p-6 text-center">
                  <div className="text-amber-200 mb-2">
                    👆 Click on any pattern in the shirt design
                  </div>
                  <p className="text-amber-300 text-sm">
                    Select a pattern to view detailed information about its origin and meaning.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="mt-6 flex gap-4">
              <Button
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
