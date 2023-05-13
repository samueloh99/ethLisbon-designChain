import { useState } from "react";
import dynamic from "next/dynamic";

import UploadDesign from "../components/UploadDesign";
import DesignGrid from "../components/DesignsGrid";

const Header = dynamic(() => import("../components/Header"), {
  ssr: false,
});

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div className="flex flex-col justify-center h-full w-full flex-grow gap-10">
        <div className="flex md:flex-row flex-col text-center justify-center items-center gap-4">
          <button
            className="bg-btn rounded-[18px] px-5 py-3 font-[600]"
            onClick={() => setIsModalOpen(true)}
          >
            Upload Design
          </button>
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
