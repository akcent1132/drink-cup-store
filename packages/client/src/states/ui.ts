import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const isAuthDialogOpen = atom<boolean>({
  key: "is-auth-dialog-open",
  default: false,
});

export const useIsAuthDialogOpen = () => useRecoilValue(isAuthDialogOpen);
export const useSetIsAuthDialogOpen = () => useSetRecoilState(isAuthDialogOpen);
