import dynamic from "next/dynamic";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = dynamic(() => import("../components/Header"), {
  ssr: false,
});

export default function Signup() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div className="flex w-full h-full flex-grow justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl mb-6 font-bold">
            1. Connect your wallet
          </h1>
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </main>
  );
}
