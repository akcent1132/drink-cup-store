import { useRef, useCallback } from "react";
import useSize from "@react-hook/size";

export const useCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [width, height] = useSize(ref);

  const resize = useCallback(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (context) {
      const { devicePixelRatio: ratio = 1 } = window;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.scale(ratio, ratio);
      return context;
    }
  }, [ref, width, height]);
  return { ref, width, height, resize };
};
