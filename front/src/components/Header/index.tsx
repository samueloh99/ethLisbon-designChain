import { useRouter } from "next/navigation";

import truncateAddress from "../../helpers/truncateAddress";
import { useAccount } from "wagmi";

const Header = () => {
  const router = useRouter();

  const { isConnected, address } = useAccount();

  return (
    <div className="flex w-full text-black items-center justify-between p-5">
      <h1
        className="cursor-pointer font-[600] uppercase"
        onClick={() => router.push("/")}
      >
        Design Chain
      </h1>
      <div className="flex flex-row gap-5 justify-center items-center">
        {isConnected ? (
          <div className="flex">
            ✅ Connected to: {truncateAddress(address as string)}
          </div>
        ) : (
          <button
            className="bg-btn px-5 py-4 rounded-[18px] flex"
            onClick={() => router.push("/signup")}
          >
            Login
          </button>
        )}

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
