/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
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

import { abi } from "../../../abi/abi.json";

interface Comment {
  x: number;
  y: number;
  text: string;
  reviewId: string;
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
        reviewId: item.reviewId,
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
    const x = (event.clientX - rect.left) / rect.width; // relative x position
    const y = (event.clientY - rect.top) / rect.height; // relative y position
    setActiveComment({ x, y, text: "", reviewId: "" });
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
      "0x91d7bce52AbC0A8074A3943bd07c9Bf6cF2Ad6BC",
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
      "0x91d7bce52AbC0A8074A3943bd07c9Bf6cF2Ad6BC",
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
    <div className="flex flex-col relative border h-full border-white">
      <Header />
      <div className="flex flex-col gap-5 h-full w-full relative border border-white justify-center px-5 py-10">
        <div className="flex flex-col border border-white w-full">
          <h1>Title: {info.content.title}</h1>
          <h1>Description: {info.content.description}</h1>
          <h1>Reward: {info.content.reward}</h1>
        </div>
        <div className="flex w-full gap-10 relative">
          <div className="relative w-[800px] m-auto">
            <img
              src={`https://${contractInfo.info}.ipfs.dweb.link/${image.name}`}
              alt="design"
              onClick={onImageClick}
              className="w-[800px] h-[1000px] border border-white object-fit"
            />
            {comments.map((comment, index) => (
              <div
                key={index}
                style={{
                  top: `${comment.y * 100}%`,
                  left: `${comment.x * 100}%`,
                }}
                className="absolute bg-white p-2 rounded text-black"
              >
                {comment.text}
              </div>
            ))}
          </div>
          <div className="flex flex-grow gap-5 flex-col border text-center border-white">
            <h1 className="uppercase font-[600] border border-white">
              comments
            </h1>
            <div className="flex flex-col gap-5 px-5">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between align-center bg-gray-600 p-2 rounded text-white"
                >
                  {comment.text}
                  <button
                    className="border border-white rounded px-2"
                    onClick={() =>
                      handleClickToVote(comment.reviewId)
                    }
                  >
                    VOTE
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {activeComment && (
          <form
            onSubmit={onCommentSubmit}
            style={{ top: activeComment.y, left: activeComment.x }}
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

    console.log(reviewsResponse);

    return {
      props: {
        info: newObj,
        image: imageObj,
        contractInfo: graphResponse.designCreated,
        reviews: reviewsResponse.reviewCreateds,
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
