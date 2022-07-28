import { useCallback, useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { z } from "zod";
import { useLoginMutation } from "./auth.generated";

const STORE_KEY = "coffeeshop.authentication";

const StoreUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  token: z.string(),
});

export const readUserFromStore = () => {
  if (localStorage[STORE_KEY]) {
    try {
      return StoreUserSchema.parse(JSON.parse(localStorage[STORE_KEY]));
    } catch (e) {
      console.warn("Failed to parse user", e);
    }
  }
  return null;
};

const writeUserToStore = (user: User) => {
  localStorage[STORE_KEY] = JSON.stringify(user);
};

type User = {
  id: string;
  email: string;
  name?: string | null;
  token: string;
};
type AuthState =
  | {
      isAuthenticated: true;
      user: User;
      error?: string | null;
    }
  | {
      isAuthenticated: false;
      error?: string | null;
    };

const _defaultUser = readUserFromStore()
const auth = atom<AuthState>({
  key: "auth",
  default: _defaultUser ? {isAuthenticated: true, user: _defaultUser} : { isAuthenticated: false },
});

export const useAuth = () => useRecoilValue(auth);

export const useLogin = () => {
  const [loginMutation, mutationState] = useLoginMutation();
  const setAuth = useSetRecoilState(auth);
  const login = useCallback(
    async (email: string, password: string) => {
      const { data, errors } = await loginMutation({
        variables: { email, password },
      });
      if (errors) {
        setAuth({
          isAuthenticated: false,
          error: errors.map((e) => e.message).join("\n"),
        });
      } else if (data?.login) {
        const { login } = data;
        if (login.success) {
          if (login.user) {
            writeUserToStore(login.user)
            setAuth({
              isAuthenticated: true,
              user: login.user,
            });
          } else {
            setAuth({
              isAuthenticated: false,
              error: "Missing user object",
            });
          }
        } else {
          setAuth({
            isAuthenticated: false,
            error: login.error,
          });
        }
      }
    },
    [loginMutation]
  );
  return { login, isLoginInProgress: mutationState.loading };
};

export const useLogout = () => {
  const setAuth = useSetRecoilState(auth);
  return useCallback(() => {
    setAuth({
      isAuthenticated: false,
    });
  }, []);
};
