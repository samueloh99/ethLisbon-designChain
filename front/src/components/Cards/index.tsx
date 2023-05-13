/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useRouter } from "next/router";
import { DesignProps } from "../../types/apisTypes";
import truncateAddress from "../../helpers/truncateAddress";

import ProfileImage from "../../../public/profile.jpeg";

interface ICardsProps {
  posts: DesignProps;
}

const Cards = ({ posts }: ICardsProps) => {
  const router = useRouter();
  return (
    <div
      className="flex flex-col justify-center rounded-md relative overflow-hidden shadow-customShadow gap-5 w-[300px] h-[300px] cursor-pointer"
      onClick={() => router.push(`/post/${posts.id}`)}
    >
      <div className="flex flex-grow h-[200px] relative w-full justify-center items-center">
        <img
          src={`https://${posts.cid}.ipfs.dweb.link/${posts.image.name}`}
          alt="img"
          className="w-full h-[200px] object-cover"
        />
      </div>
      <div className="flex flex-col gap-[10px] px-5 pb-5">
        <div className="flex flex-row items-center justify-start gap-5">
          <NextImage
            src={ProfileImage}
            className="rounded-[50%]"
            alt="profile-image"
            width={25}
            height={25}
          />
          <h1>{truncateAddress(posts.owner)}</h1>
        </div>
        <div className="flex flex-row items-center justify-start gap-5">
          <h1>{posts.content.title}</h1>
        </div>
      </div>
    </div>
  );
};

export default Cards;
