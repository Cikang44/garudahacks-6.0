// lib/hooks/useImageProcessor.ts
"use client";

import { useRef } from "react";
import type p5 from "p5";

export const useImageProcessor = () => {
  const promiseCache = useRef<Record<string, Promise<string>>>({});

  const processImage = (
    imageUrl: string,
    colorHex: string
  ): Promise<string> => {
    const cacheKey = `${imageUrl}-${colorHex}`;
    if (Object.prototype.hasOwnProperty.call(promiseCache.current, cacheKey)) {
      return promiseCache.current[cacheKey];
    }

    const newPromise = new Promise<string>(async (resolve, reject) => {
      try {
        const p5Constructor = (await import("p5")).default;

        const sketch = (p: p5) => {
          p.setup = async () => {
            try {
              const img = await p.loadImage(imageUrl);

              if (!img || !img.width || img.width <= 0) {
                throw new Error(`Image at ${imageUrl} is invalid.`);
              }

              const canvas = p.createCanvas(img.width, img.height);
              const targetColor = p.color(colorHex);
              p.image(img, 0, 0);
              p.loadPixels();

              // --- REVERTED LOGIC STARTS HERE ---

              const targetR = p.red(targetColor);
              const targetG = p.green(targetColor);
              const targetB = p.blue(targetColor);

              for (let i = 0; i < p.pixels.length; i += 4) {
                const r = p.pixels[i];
                const g = p.pixels[i + 1];
                const b = p.pixels[i + 2];

                if (r === g && g === b) {
                  const grayValue = r;

                  // 1. Calculate blend amount based on darkness.
                  // Black (0) = 1.0 alpha, White (255) = 0.0 alpha.
                  const colorAlpha = (255 - grayValue) / 255.0;

                  // 2. Blend from the original gray value to the target color.
                  p.pixels[i] = p.lerp(grayValue, targetR, colorAlpha);
                  p.pixels[i + 1] = p.lerp(grayValue, targetG, colorAlpha);
                  p.pixels[i + 2] = p.lerp(grayValue, targetB, colorAlpha);
                }
              }

              // --- REVERTED LOGIC ENDS HERE ---

              p.updatePixels();
              const dataUrl = canvas.elt.toDataURL();

              p.remove();
              resolve(dataUrl);
            } catch (error) {
              p.remove();
              reject(error);
            }
          };
        };
        new p5Constructor(sketch);
      } catch (error) {
        reject(error);
      }
    });

    promiseCache.current[cacheKey] = newPromise;

    newPromise.catch(() => {
      if (
        Object.prototype.hasOwnProperty.call(promiseCache.current, cacheKey)
      ) {
        delete promiseCache.current[cacheKey];
      }
    });

    return newPromise;
  };

  return { processImage };
};
