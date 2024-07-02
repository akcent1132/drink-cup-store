import React, { useEffect, useLayoutEffect, useState } from "react";

export const useXOverlap = (
  refA: React.RefObject<HTMLElement>,
  refB: React.RefObject<HTMLElement>,
  deps?: React.DependencyList
) => {
  const [overlap, setOverlap] = useState(false);
  useEffect(() => {
    if (refA.current && refB.current) {
      const bbA = refA.current.getBoundingClientRect();
      const bbB = refB.current.getBoundingClientRect();
      setOverlap(
        (bbA.left < bbB.left && bbA.right > bbB.left) ||
          (bbA.left < bbB.right && bbA.right > bbB.right) ||
          (bbA.left < bbB.left && bbA.right > bbB.right) ||
          (bbA.left > bbB.left && bbA.right < bbB.right)
      );
    } else {
      setOverlap(false);
    }
  }, [...(deps || []), refA.current, refB.current]);
  return overlap;
};
