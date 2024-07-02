import { uniqueId } from "lodash";
import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { setRecoil } from "recoil-nexus";

const isAuthDialogOpen = atom<boolean>({
  key: "is-auth-dialog-open",
  default: false,
});

export const useIsAuthDialogOpen = () => useRecoilValue(isAuthDialogOpen);
export const useSetIsAuthDialogOpen = () => useSetRecoilState(isAuthDialogOpen);

export enum NotificationType {
  ERROR,
}

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
};

const notifications = atom<Notification[]>({
  key: "notifications",
  default: [],
});

export const useNotifications = () => useRecoilValue(notifications);

export const addErrorNotification = ({ message }: { message: string }) => {
  setRecoil(notifications, (state) => [
    ...state,
    { type: NotificationType.ERROR, message, id: uniqueId() },
  ]);
};

export const useRemoveNotification = () => {
  const set = useSetRecoilState(notifications);
  return useCallback(
    (id: string) => set((state) => state.filter((n) => n.id !== id)),
    []
  );
};
export const useRemoveAllNotifications = () => {
  const set = useSetRecoilState(notifications);
  return useCallback(() => set([]), []);
};
