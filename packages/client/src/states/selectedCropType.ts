import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const selectedCropType = atom<string>({
  key: "selected-crop-type",
  default: "wheat",
});

export const useSelectedCropType = () => useRecoilValue(selectedCropType);
export const useSetSelectedCropType = () => useSetRecoilState(selectedCropType);
