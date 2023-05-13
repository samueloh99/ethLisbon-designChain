import dynamic from "next/dynamic";

import { SignInWithLens } from "@lens-protocol/widgets-react";

const Header = dynamic(() => import("../components/Header"), {
  ssr: false,
});

export default function Signup() {
  async function onSignIn(tokens: any, profile: any) {
    console.log("tokens: ", tokens);
    console.log("profile: ", profile);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div className="flex w-full h-full border border-white flex-grow justify-center items-center">
        <div className="flex border border-white flex-col justify-center items-center">
          <h1 className="text-2xl mb-6 font-bold">My Profile</h1>

          <SignInWithLens onSignIn={onSignIn} />
        </div>
      </div>
    </main>
  );
}
