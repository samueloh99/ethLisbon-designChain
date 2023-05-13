import { useEffect, useState } from "react";
import axios from "axios";

import { DesignProps } from "../../types/apisTypes";
import Cards from "../Cards";

const DesignGrid = () => {
  const [myDesigns, setMyDesigns] = useState<DesignProps[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.post("/api/graphGetDesign");

      if (response.status !== 200) return setMyDesigns([]);

      if (response.data.designCreateds.length > 0) {
        const designsPromises = response.data.designCreateds.map(
          async (design: any) => {
            const { data } = await axios.post(`/api/getContent`, {
              cid: design.info,
            });

            const postInfoObject = data.data.find(
              (item: any) => item.name === "postInfo"
            );

            const imageObj = data.data.find(
              (item: any) => item.name !== "postInfo"
            );

            return {
              designId: design.designId,
              id: design.id,
              cid: design.info,
              content: JSON.parse(postInfoObject.content),
              image: imageObj,
              owner: design.owner,
            };
          }
        );

        const des = await Promise.all(designsPromises);

        setMyDesigns(des);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-grow flex-col text-center w-full align-center justify-center gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="text-[20px] font-[600]">
          Explore Designs to contribute
        </h1>
        <div className="flex px-5 md:px-20">
          <input className="w-full text-white bg-btn border-[0.5px] border-[#ccc] rounded-md py-2 px-5" />
        </div>
      </div>
      <div className="flex flex-grow grid md:grid-cols-4 grid-cols-2 w-full gap-4">
        {myDesigns.map((item, index) => {
          return <Cards key={index} posts={item} />;
        })}
      </div>
    </div>
  );
};

export default DesignGrid;
