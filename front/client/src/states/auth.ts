import { useApolloClient } from "@apollo/client";
import { decode as b64Decode } from "js-base64";
import { chain } from "lodash";
import { useCallback, useEffect } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { z } from "zod";
import { isNonNil } from "../utils/ts";
import {
  useLoginMutation,
  UserPlantingsDocument,
  UserPlantingsQuery,
} from "./auth.generated";
import { createOptionFilterParam, useAddFilter, useFilters } from "./filters";
import { useSetSelectedCropType } from "./selectedCropType";
import { useSetIsAuthDialogOpen } from "./ui";

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

const _defaultUser = readUserFromStore();
const auth = atom<AuthState>({
  key: "auth",
  default: _defaultUser
    ? { isAuthenticated: true, user: _defaultUser }
    : { isAuthenticated: false },
});

export const useAuth = () => useRecoilValue(auth);

// Is loading user farms in the backgroung to select the most relevant crop-type and filters
const isLoadingInitialUserData = atom<boolean>({
  key: "is-loading-initial-user-data",
  default: false,
});
export const useIsLoadingInitialUserData = () =>
  useRecoilValue(isLoadingInitialUserData);

export const useLogin = () => {
  const [loginMutation, mutationState] = useLoginMutation();
  const setupUi = useSetupUIToShowRelevantInfoToUser();
  const setAuth = useSetRecoilState(auth);
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setAuth((prev) => ({ ...prev, error: null }));
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
            writeUserToStore(login.user);
            setAuth({
              isAuthenticated: true,
              user: login.user,
            });
            setupUi();
            return true;
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

      return false;
    },
    [loginMutation, setAuth, setupUi],
  );

  return { login, isLoginInProgress: mutationState.loading };
};

export const useSetupUIToShowRelevantInfoToUser = () => {
  const apolloClient = useApolloClient();
  const addFilter = useAddFilter();
  const setSelectedCropType = useSetSelectedCropType();
  const setIsLoadingInitialUserData = useSetRecoilState(
    isLoadingInitialUserData,
  );
  const auth = useAuth();
  const filters = useFilters();

  // load user data and change dashboard to show the most relevant state
  return useCallback(async () => {
    setIsLoadingInitialUserData(true);
    const farms = await apolloClient.query<UserPlantingsQuery>({
      variables: { userId: (auth.isAuthenticated && auth.user.id) || null },
      query: UserPlantingsDocument,
      fetchPolicy: "no-cache",
    });
    setIsLoadingInitialUserData(false);

    if (farms.data && farms.data.myFarms?.length) {
      farms.data.myFarms
        .map((f) => f?.id)
        .filter(isNonNil)
        .map((farmId) =>
          addFilter({
            name: farmId.split(".")[0],
            params: [createOptionFilterParam("farmDomain", [farmId])],
          }),
        );
      const topCrop = chain(farms.data.myFarms)
        .map((farm) => farm?.plantings || [])
        .flatten()
        .map((planting) => planting.cropType)
        .groupBy()
        .values()
        .maxBy("length")
        .first()
        .value();

      if (topCrop) {
        setSelectedCropType(topCrop);
      }
    } else if (filters.length === 0) {
      // Add a default filter when no filters are set
      addFilter({
        name: "Direct Sales",
        params: [createOptionFilterParam("types", ["directsale_farm"])],
      });
    }
  }, [
    addFilter,
    apolloClient,
    auth,
    filters.length,
    setIsLoadingInitialUserData,
    setSelectedCropType,
  ]);
};

export const useLogout = () => {
  const setAuth = useSetRecoilState(auth);
  return useCallback(() => {
    setAuth({
      isAuthenticated: false,
    });
    localStorage.removeItem(STORE_KEY);
  }, [setAuth]);
};

const UserPayload = z.object({
  _id: z.string(),
  email: z.string(),
  token: z.string(),
});
export const useTryAcceptingMagicLinkLogin = () => {
  const setAuth = useSetRecoilState(auth);
  const setIsAuthDialogOpen = useSetIsAuthDialogOpen();

  // check the query params once when the app loads
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("accept-magic-link")) {
      if (!params.has("user")) {
        throw new Error("Failed to authenticate: 'user' param is missing");
      }
      const {
        email,
        token,
        _id: id,
      } = UserPayload.parse(JSON.parse(b64Decode(params.get("user")!)));

      // Update the authentication state
      const user = { email, token, id };
      writeUserToStore(user);
      setAuth({ isAuthenticated: true, user: user });
      setIsAuthDialogOpen(false);

      // Invalidate magic link
      if (params.has("invalidateMagicLink")) {
        fetch(params.get("invalidateMagicLink")!).catch((e) =>
          console.warn("Failed to invalidate magic link", e),
        );
      }

      // remove magic-link-login related params from the url
      params.delete("accept-magic-link");
      params.delete("user");
      params.delete("landingPath");
      params.delete("invalidateMagicLink");
      const search = params.toString();
      window.history.pushState(
        null,
        "",
        window.location.pathname + (search ? `?${search}` : ""),
      );
    }
  }, [setAuth, setIsAuthDialogOpen]);
};
