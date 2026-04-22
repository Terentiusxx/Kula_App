import { useMemo } from "react";
import { useWindowDimensions, PixelRatio } from "react-native";

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export function useResponsiveMetrics() {
  const { width, height, fontScale } = useWindowDimensions();

  return useMemo(() => {
    const scale = (size) => (width / BASE_WIDTH) * size;
    const verticalScale = (size) => (height / BASE_HEIGHT) * size;
    const moderateScale = (size, factor = 0.5) =>
      size + (scale(size) - size) * factor;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const scaleFont = (size, min = size * 0.9, max = size * 1.25) => {
      const next = size * (width / BASE_WIDTH) / (fontScale || 1);
      return PixelRatio.roundToNearestPixel(clamp(next, min, max));
    };

    return {
      width,
      height,
      fontScale,
      scale,
      verticalScale,
      moderateScale,
      scaleFont,
      clamp,
    };
  }, [width, height, fontScale]);
}

