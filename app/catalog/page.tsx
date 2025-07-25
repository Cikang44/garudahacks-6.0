"use client";
import Link from "next/link";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import ShirtDisplay from "@/components/ShirtDisplay";
import CanvasShirtDisplay from "@/components/CanvasShirtDisplay";
import { Edit3, Eye, ShoppingCart } from "lucide-react";

// Product data structure
type ProductGrid = [number, number][][];

interface Product {
  id: string;
  name: string;
  price?: number;
  creator: string;
  grid: ProductGrid;
  gridWidth: number;
  gridHeight: number;
  isCompleted: boolean;
  completionPercentage: number;
}

// Helper function to check if a shirt design is completed
function calculateCompletion(grid: ProductGrid): { isCompleted: boolean; percentage: number } {
  let totalCells = 0;
  let filledCells = 0;

  grid.forEach(row => {
    row.forEach(cell => {
      const [patternID, colorID] = cell;
      if (patternID !== -1) { // Not a forbidden cell
        totalCells++;
        if (patternID > 0 && colorID > 0) { // Has actual pattern and color
          filledCells++;
        }
      }
    });
  });

  const percentage = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;
  return {
    isCompleted: percentage >= 80, // Consider 80%+ as completed
    percentage
  };
}

// Generate sample shirt grids
function generateShirtGrid(designPattern: 'random' | 'partial' | 'complete'): ProductGrid {
  const gridWidth = 19;
  const gridHeight = 13;
  const grid: ProductGrid = [];

  for (let y = 0; y < gridHeight; y++) {
    const row: [number, number][] = [];
    for (let x = 0; x < gridWidth; x++) {
      // Define shirt shape
      if (
        ((x < 4 && y > 3 && y < 13) || (x > 7 && x < 11 && y > -1 && y < 3) || (x > 14 && x < 19 && y > 3 && y < 13))
      ) {
        row.push([-1, -1]); // Forbidden cell
      } else {
        switch (designPattern) {
          case 'complete':
            // Fully designed shirt
            const patternId = Math.floor(Math.random() * 3) + 1;
            const colorId = Math.floor(Math.random() * 3) + 1;
            row.push([patternId, colorId]);
            break;
          case 'partial':
            // Partially designed shirt
            if (Math.random() > 0.4) {
              const patternId = Math.floor(Math.random() * 3) + 1;
              const colorId = Math.floor(Math.random() * 3) + 1;
              row.push([patternId, colorId]);
            } else {
              row.push([0, 0]); // Empty but designable
            }
            break;
          case 'random':
            // Mostly empty with some patterns
            if (Math.random() > 0.8) {
              const patternId = Math.floor(Math.random() * 3) + 1;
              const colorId = Math.floor(Math.random() * 3) + 1;
              row.push([patternId, colorId]);
            } else {
              row.push([0, 0]); // Empty but designable
            }
            break;
        }
      }
    }
    grid.push(row);
  }
  return grid;
}

// Mock product data
const products: Product[] = [
  {
    id: "1",
    name: "Royal Aceh Heritage Shirt",
    price: 299.99,
    creator: "Master Artisan Sari",
    grid: generateShirtGrid('complete'),
    gridWidth: 19,
    gridHeight: 13,
    isCompleted: true,
    completionPercentage: 100
  },
  {
    id: "2", 
    name: "Elegant Javanese Formal Wear",
    price: 349.99,
    creator: "Designer Indira",
    grid: generateShirtGrid('complete'),
    gridWidth: 19,
    gridHeight: 13,
    isCompleted: true,
    completionPercentage: 95
  },
  {
    id: "3",
    name: "Balinese Cultural Design",
    creator: "You",
    grid: generateShirtGrid('partial'),
    gridWidth: 19,
    gridHeight: 13,
    isCompleted: false,
    completionPercentage: 65
  },
  {
    id: "4",
    name: "Modern Fusion Concept",
    creator: "You",
    grid: generateShirtGrid('random'),
    gridWidth: 19,
    gridHeight: 13,
    isCompleted: false,
    completionPercentage: 25
  },
  {
    id: "5",
    name: "Traditional Patterns Mix",
    creator: "Community Design",
    grid: generateShirtGrid('partial'),
    gridWidth: 19,
    gridHeight: 13,
    isCompleted: false,
    completionPercentage: 70
  }
];

// Calculate completion for each product
products.forEach(product => {
  const completion = calculateCompletion(product.grid);
  product.isCompleted = completion.isCompleted;
  product.completionPercentage = completion.percentage;
});

export default function Catalog() {
  return (
    <div className="min-h-screen bg-amber-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Batik Design Catalog</h1>
          <p className="text-amber-200">Discover completed designs or continue your creations</p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-amber-800 rounded-lg p-1 flex gap-1">
            <Button variant="default" size="sm" className="bg-amber-600">
              All Designs
            </Button>
            <Button variant="ghost" size="sm" className="text-amber-200 hover:bg-amber-700">
              Completed
            </Button>
            <Button variant="ghost" size="sm" className="text-amber-200 hover:bg-amber-700">
              In Progress
            </Button>
            <Button variant="ghost" size="sm" className="text-amber-200 hover:bg-amber-700">
              My Designs
            </Button>
          </div>
        </div>

        {/* Carousel for shirt displays */}
        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card className="bg-amber-800 border-amber-700 hover:bg-amber-750 transition-all duration-300 hover:scale-105 hover:shadow-xl h-full">
                  <CardContent className="p-4 flex flex-col h-full">
                    {/* Shirt Preview */}
                    <div className="flex justify-center mb-4 bg-amber-700 rounded-lg p-4 relative">
                      <CanvasShirtDisplay 
                        grid={product.grid}
                        gridWidth={product.gridWidth}
                        scale={0.6}
                        id={product.id}
                      />
                      
                      {/* Completion badge */}
                      <div className="absolute top-2 right-2">
                        {product.isCompleted ? (
                          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            ✓ Complete
                          </div>
                        ) : (
                          <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {product.completionPercentage}%
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-grow">
                      <CardTitle className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {product.name}
                      </CardTitle>
                      
                      <CardDescription className="text-amber-200 mb-3 text-sm">
                        By {product.creator}
                      </CardDescription>

                      {/* Progress bar for incomplete designs */}
                      {!product.isCompleted && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-amber-300 mb-1">
                            <span>Design Progress</span>
                            <span>{product.completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-amber-600 rounded-full h-2">
                            <div 
                              className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${product.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Action buttons */}
                    <div className="space-y-2 mt-auto">
                      {product.isCompleted ? (
                        <>
                          {product.price && (
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xl font-bold text-white">
                                ${product.price}
                              </span>
                              <Button size="sm" variant="outline" className="text-amber-200 border-amber-600">
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Buy
                              </Button>
                            </div>
                          )}
                          <Link href={`/product/${product.id}`} className="block">
                            <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-500">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href={`/editor?design=${product.id}`} className="block">
                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Continue Editing
                            </Button>
                          </Link>
                          {product.completionPercentage > 50 && (
                            <Link href={`/product/${product.id}`} className="block">
                              <Button size="sm" variant="outline" className="w-full text-amber-200 border-amber-600">
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-amber-800 border-amber-600 text-amber-100 hover:bg-amber-700" />
          <CarouselNext className="bg-amber-800 border-amber-600 text-amber-100 hover:bg-amber-700" />
        </Carousel>

        {/* Create new design button */}
        <div className="flex justify-center mt-12">
          <Link href="/editor">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <Edit3 className="w-5 h-5 mr-2" />
              Create New Design
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
