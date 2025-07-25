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

              // --- MODIFIED LOGIC STARTS HERE ---

              const targetR = p.red(targetColor);
              const targetG = p.green(targetColor);
              const targetB = p.blue(targetColor);

              for (let i = 0; i < p.pixels.length; i += 4) {
                const r = p.pixels[i];
                const g = p.pixels[i + 1];
                const b = p.pixels[i + 2];

                if (r === g && g === b) {
                  // The original grayscale value (0-255)
                  const grayValue = r;

                  // 1. Calculate the blend amount (alpha).
                  // Invert the value: black (0) becomes 1.0, white (255) becomes 0.0.
                  const colorAlpha = (255 - grayValue) / 255.0;

                  // 2. Use lerp() to blend between the original gray and the target color.
                  p.pixels[i] = p.lerp(grayValue, targetR, colorAlpha);
                  p.pixels[i + 1] = p.lerp(grayValue, targetG, colorAlpha);
                  p.pixels[i + 2] = p.lerp(grayValue, targetB, colorAlpha);
                }
              }

              // --- MODIFIED LOGIC ENDS HERE ---

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
