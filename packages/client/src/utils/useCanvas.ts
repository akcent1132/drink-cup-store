import { useRef, useEffect, useLayoutEffect, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

const useSize = (target: React.RefObject<HTMLCanvasElement>): DOMRect | null => {
  const [size, setSize] = useState<DOMRect>();

  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size || null;
};

export const useCanvas = (draw: Function) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const size = useSize(canvasRef);
  const width = size ? size.width : 0;
  const height = size ? size.height : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (context) {
      const { devicePixelRatio: ratio = 1 } = window;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.scale(ratio, ratio);
      draw(context, width, height);
    }
    
  }, [draw, width, height]);
  return canvasRef;
};
