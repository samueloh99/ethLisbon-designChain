import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import UploadDesign from "../components/UploadDesign";
import DesignGrid from "../components/DesignsGrid";
import { useUserAuthenticationContext } from "../context/UserAuthenticationContext";

const Header = dynamic(() => import("../components/Header"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { lensConnected } = useUserAuthenticationContext();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div className="flex flex-col justify-center h-full w-full flex-grow gap-10">
        <div className="flex md:flex-row flex-col text-center justify-center items-center gap-4">
          {lensConnected ? (
            <button
              className="bg-btn rounded-[18px] px-5 py-3 font-[600]"
              onClick={() => setIsModalOpen(true)}
            >
              Upload Design
            </button>
          ) : (
            <h1>
              To Upload your design <br />
              Go to{"  "}
              <strong
                className="cursor-pointer underline"
                onClick={() => router.push("/myprofile")}
              >
                My Profile{"  "}
              </strong>
              and SignIn on Lens
            </h1>
          )}
        </div>
        <UploadDesign
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <DesignGrid />
      </div>
    </main>
  );
}
