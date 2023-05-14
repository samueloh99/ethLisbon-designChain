import dynamic from "next/dynamic";
import NextImage from "next/image";
import { useRouter } from "next/router";

import { SignInWithLens } from "@lens-protocol/widgets-react";

import { BiExit } from "react-icons/bi";

import { destroyCookie } from "nookies";

import ProfileImage from "../../public/profile.jpeg";
import { useUserAuthenticationContext } from "../context/UserAuthenticationContext";

const Header = dynamic(() => import("../components/Header"), {
  ssr: false,
});

export default function Signup() {
  const router = useRouter();
  const { lensConnected, onSignIn, lensProfile } =
    useUserAuthenticationContext();

  const handleClickDisconnect = () => {
    const shouldDisconnect = window.confirm(
      "Are you sure you want to disconnect?"
    );

    if (shouldDisconnect) {
      localStorage.clear();
      sessionStorage.clear();
      destroyCookie(null, "lens-profile", { path: "/" });
      router.push("/");
    }
  };

  if (lensProfile !== undefined) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <Header />
        <div className="flex relative flex-col gap-10 w-full h-full flex-grow justify-center items-center">
          <div
            className="cursor-pointer absolute z-[12] top-10 right-10"
            onClick={() => handleClickDisconnect()}
          >
            <BiExit size={40} color="black" />
          </div>
          <div className="flex z-[11] h-full w-full flex-grow flex-col gap-2 justify-center items-center">
            <div className="flex gap-5 flex-col h-[450px] justify-end items-center align-end">
              <NextImage
                src={ProfileImage}
                className="rounded-[50%]"
                alt="profile-image"
                width={200}
                height={200}
              />
              <div className="flex text-center h-auto mb-10 flex-col ">
                <h1 className="text-[24px] font-[600]">
                  @{lensProfile.handle}
                </h1>
                <h1 className="text-[18px] font-[400]">
                  {lensProfile.id}
                </h1>
              </div>
            </div>
            <div className="flex flex-grow gap-5 grid grid-cols-2 w-full pb-10 px-10 md:px-0 md:w-[500px] align-center justify-center items-center h-3/6">
              <div className="shadow-xl w-full flex flex-col p-3 text-center gap-2 rounded-[10px]">
                <h1 className="uppercase text-[12px] font-[600]">
                  Total Followers
                </h1>
                <h1 className="uppercase text-[14px] font-[600]">
                  {lensProfile.stats.totalFollowers}
                </h1>
              </div>
              <div className="shadow-xl w-full flex flex-col p-3 text-center gap-2 rounded-[10px]">
                <h1 className="uppercase text-[12px] font-[600]">
                  Total Following
                </h1>
                <h1 className="uppercase text-[14px] font-[600]">
                  {lensProfile.stats.totalFollowing}
                </h1>
              </div>
              <div className="shadow-xl w-full flex flex-col p-3 text-center gap-2 rounded-[10px]">
                <h1 className="uppercase text-[12px] font-[600]">
                  Total Comments
                </h1>
                <h1 className="uppercase text-[14px] font-[600]">
                  {lensProfile.stats.totalComments}
                </h1>
              </div>
              <div className="shadow-xl w-full flex flex-col p-3 text-center gap-2 rounded-[10px]">
                <h1 className="uppercase text-[12px] font-[600]">
                  Total Posts
                </h1>
                <h1 className="uppercase text-[14px] font-[600]">
                  {lensProfile.stats.totalPosts}
                </h1>
              </div>
              <div className="shadow-xl w-full flex flex-col p-3 text-center gap-2 rounded-[10px]">
                <h1 className="uppercase text-[12px] font-[600]">
                  Total Publications
                </h1>
                <h1 className="uppercase text-[14px] font-[600]">
                  {lensProfile.stats.totalPublications}
                </h1>
              </div>{" "}
              <div className="shadow-xl w-full flex flex-col p-3 text-center gap-2 rounded-[10px]">
                <h1 className="uppercase text-[12px] font-[600]">
                  Total Collects
                </h1>
                <h1 className="uppercase text-[14px] font-[600]">
                  {lensProfile.stats.totalCollects}
                </h1>
              </div>
            </div>
          </div>
          <div className="absolute w-full h-[50%] top-0 bg-white z-[10] rounded-b-[100%] overflow-hidden"></div>
          <div className="absolute w-full h-full bg-btn z-[9] overflow-hidden"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div className="flex flex-col gap-10 w-full h-full flex-grow justify-center items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
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
      </div>
    </main>
  );
}
