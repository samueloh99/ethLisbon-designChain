import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { setCookie, parseCookies } from "nookies";

import { IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { SignInWithLens } from "@lens-protocol/widgets-react";

const Header = dynamic(() => import("../components/Header"), {
  ssr: false,
});

export default function Signup() {
  const [lensConnected, setLensConnected] = useState(false);
  const cookies = parseCookies();

  useEffect(() => {
    const lensIsConnected = cookies["lens-profile"] !== undefined;

    setLensConnected(lensIsConnected);
  }, []);

  async function onSignIn(tokens: any, profile: any) {
    console.log("tokens: ", tokens);
    console.log("profile: ", profile);

    if (profile === undefined) return;

    const lensProfile = JSON.stringify(profile);

    setCookie(null, "lens-profile", lensProfile, {
      maxAge: 3600,
      path: "/",
    });
  }

  // const handleProof = useCallback((result: ISuccessResult) => {
  //   return new Promise<void>((resolve) => {
  //     setTimeout(() => resolve(), 3000);
  //     // NOTE: Example of how to decline the verification request and show an error message to the user
  //   });
  // }, []);

  // const onSuccess = async (result: ISuccessResult) => {
  //   console.log("resultssss", result);
  // };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div className="flex flex-col gap-10 w-full h-full border border-white flex-grow justify-center items-center">
        <div className="flex border border-white flex-col gap-2 justify-center items-center">
          <h1 className="uppercase font-[600]">
            1. Connect to Lens Profile
          </h1>

          {lensConnected ? (
            <h1 className="uppercase font-[600]">
              ✅ Lens Profile Connected
            </h1>
          ) : (
            <SignInWithLens onSignIn={onSignIn} />
          )}
        </div>
        <div className="flex border border-white flex-col gap-2 justify-center items-center">
          <h1 className="uppercase font-[600]">
            2. Verify in Worldcoin
          </h1>
          {/* <IDKitWidget
            action="my_action"
            onSuccess={onSuccess}
            handleVerify={handleProof}
            app_id="app_8dbb8a1c2454a71d3cb609e70322e485"
            // walletConnectProjectId="get_this_from_walletconnect_portal"
          >
            {({ open }) => <button onClick={open}>Click me</button>}
          </IDKitWidget> */}
        </div>
      </div>
    </main>
  );
}
