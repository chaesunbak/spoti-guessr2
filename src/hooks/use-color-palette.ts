import { useState, useEffect } from "react";
import ColorThief from "colorthief";

interface UseColorPaletteResult {
  data: string[] | null;
  loading: boolean;
  error: Error | null;
}

export function useColorPalette(imageUrl: string): UseColorPaletteResult {
  const [data, setData] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const colorThief = new ColorThief();
    const img = document.createElement("img");
    img.crossOrigin = "Anonymous";

    const getColorPalette = () => {
      try {
        const palette = colorThief.getPalette(img, 5);
        const colors = palette.map(
          (color: number[]) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        );
        setData(colors);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to extract color")
        );
        setLoading(false);
      }
    };

    img.onload = getColorPalette;
    img.onerror = (err) => {
      setError(err instanceof Error ? err : new Error("Failed to load image"));
      setLoading(false);
    };

    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  return { data, loading, error };
}
