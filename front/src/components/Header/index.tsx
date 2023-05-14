import { useRouter } from "next/navigation";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  const router = useRouter();

  return (
    <div className="flex w-full text-black items-center justify-between p-5">
      <h1
        className="cursor-pointer font-[600] uppercase"
        onClick={() => router.push("/")}
      >
        Design Chain
      </h1>
      <div className="flex flex-row gap-5 justify-center items-center">
        <ConnectButton showBalance={false} />

        <button
          className="bg-btn rounded-[18px] px-5 py-3 font-[600]"
          onClick={() => router.push("/myprofile")}
        >
          My Profile
        </button>
      </div>
    </div>
  );
};

export default Header;
