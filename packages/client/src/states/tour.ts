import { PropsWithChildren, useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { z } from "zod";

const STORE_KEY = "coffeeshop.tour";

export enum Stop {
  SELECT_CROP,
  FILTER,
  HOVER_VALUE,
  OPEN_PLANTING,
}

export const Stops = [
  Stop.SELECT_CROP,
  Stop.FILTER,
  Stop.HOVER_VALUE,
  Stop.OPEN_PLANTING,
];

const StoreSchema = z.object({
  isTourOn: z.boolean(),
  currentStop: z.nativeEnum(Stop),
});

export const readFromStore = () => {
  if (localStorage[STORE_KEY]) {
    try {
      return StoreSchema.parse(JSON.parse(localStorage[STORE_KEY]));
    } catch (e) {
      console.warn("Failed to parse tour data", localStorage[STORE_KEY], e);
    }
  }
  return {
    currentStop: Stops[0],
    isTourOn: true
  };
};

const writeToStore = (update: Partial<z.infer<typeof StoreSchema>>) => {
  localStorage[STORE_KEY] = JSON.stringify({
    ...(readFromStore() || {}),
    ...update,
  });
};

const currentStop = atom<Stop>({
  key: "tour.current-stop",
  default: readFromStore()?.currentStop || Stop.SELECT_CROP,
});

const isTourOn = atom<boolean>({
  key: "tour.is-on",
  default: readFromStore()?.isTourOn ?? true,
});

export const useCurrentStop = () => useRecoilValue(currentStop);
export const useSetCurrentStop = () => {
  const set = useSetRecoilState(currentStop);
  return useCallback((currentStop: Stop) => {
    set(currentStop);
    writeToStore({ currentStop });
  }, []);
};

export const useIsTourOn = () => useRecoilValue(isTourOn);
export const useSetIsTourOn = () => {
  const set = useSetRecoilState(isTourOn);
  return useCallback((isTourOn: boolean) => {
    set(isTourOn);
    writeToStore({ isTourOn });
  }, []);
};

const useStep = () => {
  const setCurrentStop = useSetCurrentStop();
  const setIsTourOn = useSetIsTourOn();
  const currentStop = useCurrentStop();
  return useCallback(
    (step: number) => {
      const currentIndex = Stops.indexOf(currentStop);
      const index = Math.max(0, currentIndex + step);
      if (index >= Stops.length) {
        setCurrentStop(Stops[0]);
        setIsTourOn(false);
      } else {
        setCurrentStop(Stops[index]);
      }
    },
    [currentStop]
  );
};
export const useNext = () => {
  const step = useStep();
  return () => step(1);
};
export const useBack = () => {
  const step = useStep();
  return () => step(-1);
};

export const useStartTour = () => {
  const setCurrentStop = useSetCurrentStop();
  const setIsTourOn = useSetIsTourOn();
  const currentStop = useCurrentStop();
  return useCallback(() => {
    setCurrentStop(Stops[0]);
    setIsTourOn(true);
  }, []);
};
