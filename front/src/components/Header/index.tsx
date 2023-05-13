import { useRouter } from "next/navigation";

import truncateAddress from "../../helpers/truncateAddress";
import { useAccount } from "wagmi";

const Header = () => {
  const router = useRouter();

  const { isConnected, address } = useAccount();

  return (
    <div className="flex w-full m-auto max-w-5xl items-center justify-between p-5">
      <h1 className="cursor-pointer" onClick={() => router.push("/")}>
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
          className="border rounded px-2 py-1"
          onClick={() => router.push("/myprofile")}
        >
          My Profile
        </button>
      </div>
    </div>
  );
};

export default Header;
