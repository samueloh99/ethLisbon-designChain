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
    </div>
  );
};

export default Header;
