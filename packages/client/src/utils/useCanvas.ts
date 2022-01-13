import {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import useResizeObserver from "@react-hook/resize-observer";

export const useSize = (
  target: React.RefObject<HTMLCanvasElement>
): DOMRect | null => {
  const [size, setSize] = useState<DOMRect>();

  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size || null;
};

export const useCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const size = useSize(ref);
  const width = size ? size.width : 0;
  const height = size ? size.height : 0;

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
