/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/router";
import { DesignProps } from "../../types/apisTypes";
interface ICardsProps {
  posts: DesignProps;
}

const Cards = ({ posts }: ICardsProps) => {
  const router = useRouter();
  return (
    <div
      className="flex flex-col border justify-center rounded-md gap-5 border-white w-auto h-[450px] cursor-pointer"
      onClick={() => router.push(`/post/${posts.id}`)}
    >
      <h1>{posts.designId}</h1>
      <h1>{posts.content.title}</h1>
      <h1>{posts.content.reward}</h1>
      <div className="flex flex-grow relative w-full justify-center items-center">
        <img
          src={`https://${posts.cid}.ipfs.dweb.link/${posts.image.name}`}
          alt="img"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Cards;
