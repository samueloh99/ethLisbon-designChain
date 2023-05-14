/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import NextImage from "next/image";
import dynamic from "next/dynamic";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import axios from "axios";
import { Contract, Signer, ethers } from "ethers";
import { useSigner } from "wagmi";

import { RiArrowUpSLine } from "react-icons/ri";

import ProfileImage from "../../../public/profile.jpeg";

import { abi } from "../../../abi/abi.json";
import truncateAddress from "../../helpers/truncateAddress";

interface Comment {
  x: number;
  y: number;
  votes: string;
  text: string;
  reviewId: string;
  reviewer: string;
}

interface PropsServerSide {
  info: {
    content: {
      reward: string;
      description: string;
      title: string;
    };
    name: string;
  };
  image: {
    name: string;
  };
  contractInfo: {
    designId: string;
    id: string;
    info: string;
    reward: string;
    __typename: string;
  };
  reviews: {
    __typename: string;
    id: string;
    reviewId: string;
    upVotes: string;
    votes: string;
    reviewer: string;
    designId: string;
    posX: string;
    posY: string;
    comment: string;
  }[];
}

const Header = dynamic(() => import("../../components/Header"), {
  ssr: false,
});

const Post = ({
  info,
  image,
  contractInfo,
  reviews,
}: PropsServerSide) => {
  const { data } = useSigner();

  const [comments, setComments] = useState<Comment[]>([]);
  const [activeComment, setActiveComment] = useState<Comment | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const scaleFactor = ethers.BigNumber.from(10).pow(5);

    const formattedReviews = reviews.map((item) => {
      const posXBigNumber = ethers.BigNumber.from(item.posX);
      const posYBigNumber = ethers.BigNumber.from(item.posY);

      const posX =
        posXBigNumber.div(scaleFactor).toNumber() +
        posXBigNumber.mod(scaleFactor).toNumber() / 1e5;
      const posY =
        posYBigNumber.div(scaleFactor).toNumber() +
        posYBigNumber.mod(scaleFactor).toNumber() / 1e5;

      return {
        text: item.comment,
        x: posX,
        votes: item.votes,
        reviewId: item.reviewId,
        reviewer: item.reviewer,
        y: posY,
      };
    });

    setComments(formattedReviews);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveComment(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onImageClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width; // x position in percentage
    const y = (event.clientY - rect.top) / rect.height; // y position in percentage

    setActiveComment({
      x,
      y,
      text: "",
      reviewId: "",
      votes: "",
      reviewer: "",
    });
  };

  const onCommentChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = event.target.value;
    setActiveComment((current) =>
      current ? { ...current, text } : null
    );
  };

  const onCommentSubmit = async (event: FormEvent) => {
    setIsLoading(true);
    event.preventDefault();
    if (!activeComment) return;

    setComments((current) => [...current, activeComment]);
    setActiveComment(null);

    const contract = new Contract(
      process.env.NEXT_PUBLIC_CONTRACTADDRESS as string,
      abi,
      data as Signer
    );

    const x = ethers.BigNumber.from(
      Math.round(activeComment.x * 1e5)
    );
    const y = ethers.BigNumber.from(
      Math.round(activeComment.y * 1e5)
    );

    try {
      // // Call your contract function
      const result = await contract.createReview(
        contractInfo.designId,
        activeComment.text,
        x,
        y
      );

      if (result.data) {
        return setIsLoading(false);
      }

      console.log("Function result:", result);
    } catch (err) {
      setIsLoading(false);
      console.error("Error calling the contract function:", err);
    }
  };

  const handleClickToVote = async (id: string) => {
    const contract = new Contract(
      process.env.NEXT_PUBLIC_CONTRACTADDRESS as string,
      abi,
      data as Signer
    );

    try {
      // // Call your contract function
      const result = await contract.upvoteReview(id);

      if (result.data) {
        return setIsLoading(false);
      }

      alert("Voted !");
      console.log("Function result:", result);
    } catch (err) {
      setIsLoading(false);
      console.error("Error calling the contract function:", err);
    }
  };

  return (
    <div className="flex flex-col relative h-full">
      <Header />
      <div className="flex flex-col gap-5 h-full w-full relative justify-center px-5 py-10">
        <div className="flex w-full flex-col md:flex-row gap-5 relative">
          <div className="relative w-[1200px] flex-grow h-[700px] mb-auto">
            <img
              src={`https://${contractInfo.info}.ipfs.dweb.link/${image.name}`}
              alt="design"
              onClick={onImageClick}
              className="w-[1200px] h-[700px] border border-white object-fit"
            />
            {activeComment && (
              <form
                onSubmit={onCommentSubmit}
                style={{
                  top: `${activeComment.y * 100}%`,
                  left: `${activeComment.x * 100}%`,
                }}
                className="absolute bg-white p-2 rounded text-black"
              >
                <textarea
                  onChange={onCommentChange}
                  value={activeComment.text}
                  className="resize-none"
                />
                <button
                  type="submit"
                  className="mt-2 block w-full bg-blue-500 text-white rounded p-2"
                >
                  Submit
                </button>
              </form>
            )}
            {comments.map((comment, index) => (
              <div
                key={index}
                style={{
                  top: `${comment.y * 100}%`,
                  left: `${comment.x * 100}%`,
                }}
                className="group z-[100] border border-black flex items-center border border-black absolute bg-white p-2 rounded text-black transition-all duration-500 ease-in-out w-12 h-12 hover:w-[250px] overflow-hidden"
              >
                <NextImage
                  src={ProfileImage}
                  className="rounded-[50%]"
                  alt="profile-image"
                  width={25}
                  height={25}
                />
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                  <h1>{comment.text}</h1>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-grow gap-20 flex-col justify-start items-start text-center">
            <div className="flex flex-col justify-start items-start w-full">
              <h1>Title: {info.content.title}</h1>
              <h1>Description: {info.content.description}</h1>
              <h1>Reward: {info.content.reward}</h1>
            </div>
            <div className="flex justify-start items-start flex-col gap-5 w-full">
              <h1 className="uppercase font-[600]">comments</h1>
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full items-start justify-between align-center bg-gray-600 p-2 rounded text-white"
                >
                  <div className="flex flex-row w-full items-center justify-start gap-5">
                    <div className="flex flex-col">
                      <RiArrowUpSLine
                        size={35}
                        color="white"
                        className="cursor-pointer"
                        onClick={() =>
                          handleClickToVote(comment.reviewId)
                        }
                      />
                      <h1>{comment.votes}</h1>
                    </div>
                    <div className="flex flex-row items-center justify-start">
                      <NextImage
                        src={ProfileImage}
                        className="rounded-[50%]"
                        alt="profile-image"
                        width={25}
                        height={25}
                      />
                      <h1 className="ml-[5px]">
                        {truncateAddress(comment.reviewer)}
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-10 my-5 pl-5">
                    <h1>{comment.text}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  const id = context.query.id;

  try {
    const { data: graphResponse } = await axios.post(
      `http://localhost:3000/api/graphGetDesignById`,
      {
        id,
      }
    );

    const { data: getContentResponse } = await axios.post(
      `http://localhost:3000/api/getContent`,
      {
        cid: graphResponse.designCreated.info,
      }
    );

    const { data: reviewsResponse } = await axios.post(
      `http://localhost:3000/api/graphGetReviewsByDesignId`,
      {
        id: graphResponse.designCreated.designId,
      }
    );

    console.log(reviewsResponse);

    const postInfoObject = getContentResponse.data.find(
      (item: any) => item.name === "postInfo"
    );

    const newObj = {
      ...postInfoObject,
      content: JSON.parse(postInfoObject.content),
    };

    const imageObj = getContentResponse.data.find(
      (item: any) => item.name !== "postInfo"
    );

    return {
      props: {
        info: newObj,
        image: imageObj,
        contractInfo: graphResponse.designCreated,
        reviews: reviewsResponse,
      },
    };
  } catch (err) {
    return {
      props: {
        info: [],
        image: [],
      },
    };
  }
};

export default Post;
