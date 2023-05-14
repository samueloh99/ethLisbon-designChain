import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from "react";
import { parseCookies, setCookie } from "nookies";
import { useRouter } from "next/router";

import { LensProfile } from "../types/apisTypes";

type UserAuthenticationContextData = {
  lensConnected: boolean;
  onSignIn: (tokens: any, profile: any) => void;
  lensProfile: LensProfile | undefined;
};

type UserAuthenticationProviderProps = {
  children: ReactNode;
};

export const UserAuthenticationContext = createContext(
  {} as UserAuthenticationContextData
);

export function UserAuthenticationProvider({
  children,
}: UserAuthenticationProviderProps) {
  const router = useRouter();
  const [lensProfile, setLensProfile] = useState<LensProfile>();
  const [lensConnected, setLensConnected] = useState(false);
  const cookies = parseCookies();

  useEffect(() => {
    const lensIsConnected = cookies["lens-profile"] !== undefined;

    setLensConnected(lensIsConnected);
  }, []);

  useEffect(() => {
    if (lensConnected) {
      setLensProfile(JSON.parse(cookies["lens-profile"]));
    }
  }, [lensConnected]);

  async function onSignIn(tokens: any, profile: any) {
    console.log("tokens: ", tokens);
    console.log("profile: ", profile);

    if (profile === undefined) return;

    const lensProfile = JSON.stringify(profile);

    setCookie(null, "lens-profile", lensProfile, {
      maxAge: 3600,
      path: "/",
    });

    router.reload();
  }

  return (
    <UserAuthenticationContext.Provider
      value={{ lensConnected, onSignIn, lensProfile }}
    >
      {children}
    </UserAuthenticationContext.Provider>
  );
}

export const useUserAuthenticationContext = () =>
  useContext(UserAuthenticationContext);
