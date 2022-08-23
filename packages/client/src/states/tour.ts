import { PropsWithChildren, useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { z } from "zod";

const STORE_KEY = "coffeeshop.tour";

export enum Stop {
  SELECT_CROP = 1,
  FILTER = 2,
  HOVER_VALUE = 3,
  OPEN_PLANTING = 4,
}

const StoreSchema = z.object({
  isTourOn: z.boolean(),
  currentStop: z.nativeEnum(Stop),
});

export const readFromStore = () => {
  if (localStorage[STORE_KEY]) {
    try {
      return StoreSchema.parse(JSON.parse(localStorage[STORE_KEY]));
    } catch (e) {
      console.warn("Failed to parse user", e);
    }
  }
  return null;
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
