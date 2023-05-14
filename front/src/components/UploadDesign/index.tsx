import React, { useEffect, useRef, useState } from "react";

import { Web3Storage } from "web3.storage";

import { ethers, Contract, Signer } from "ethers";

import { useSigner } from "wagmi";

import { abi } from "../../../abi/abi.json";
import { abi as apeAbi } from "../../../abi/apeAbi.json";
import { useAccount } from "wagmi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function makeStorageClient() {
  return new Web3Storage({
    token: process.env.NEXT_PUBLIC_API_KEY_WEB3 as string,
  });
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { address } = useAccount();
  const { data } = useSigner();

  const [apeCoinValidated, setApeCoinValidated] = useState(false);

  const [form, setForm] = useState({
    title: "",
    reward: "",
    description: "",
    file: null,
  });

  const [status, setStatus] = useState({
    isError: false,
    isLoading: false,
    isSuccess: false,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileUpload = async (e: any) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleUpload = async () => {
    setStatus({
      ...status,
      isLoading: true,
    });
    if (!form.file) {
      alert("Please select a file.");
      return;
    }
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    const postInfo = {
      reward: form.reward,
      description: form.description,
      title: form.title,
    };

    const blob = new Blob([JSON.stringify(postInfo)], {
      type: "application/json",
    });

    const filesToUpload = [form.file, new File([blob], "postInfo")];

    const client = makeStorageClient();
    const cid = await client.put(filesToUpload);

    const contract = new Contract(
      process.env.NEXT_PUBLIC_CONTRACTADDRESS as string,
      abi,
      data as Signer
    );

    const amountApeToken = ethers.utils.parseUnits(form.reward, 18); // change the number of decimals accordingly

    try {
      // // Call your contract function
      const result = await contract.createDesign(cid, amountApeToken);
      console.log("Function result:", result);
      setForm({
        description: "",
        file: null,
        reward: "",
        title: "",
      });
      onClose();
      setStatus({
        isError: false,
        isSuccess: true,
        isLoading: false,
      });
    } catch (err) {
      setStatus({
        isError: true,
        isSuccess: false,
        isLoading: false,
      });
      console.error("Error calling the contract function:", err);
    }
  };

  const handleClickApproveApe = async () => {
    console.log("APPROVE APE");
    const contract = new Contract(
      "0x9C0BAB447CBF9F86C8800f566448C373a144f47f",
      apeAbi,
      data as Signer
    );

    try {
      const result = await contract.allowance(
        address,
        process.env.NEXT_PUBLIC_CONTRACTADDRESS as string
      );

      const transformed = ethers.BigNumber.from(result._hex);
      const num = Number(transformed.toString());

      if (num === 0) {
        const amountMATIC = ethers.utils.parseEther(form.reward);
        const result = await contract.approve(
          process.env.NEXT_PUBLIC_CONTRACTADDRESS as string,
          amountMATIC
        );
        console.log("Function result:", result);
        return setApeCoinValidated(true);
      }

      if (num > Number(form.reward)) {
        return setApeCoinValidated(true);
      }

      const calculatedAmount = Number(form.reward) - num;

      const amountMATIC = ethers.utils.parseEther(
        String(calculatedAmount)
      );
      const resultApprove = await contract.approve(
        process.env.NEXT_PUBLIC_CONTRACTADDRESS as string,
        amountMATIC
      );
      console.log("Function result:", resultApprove);
      return setApeCoinValidated(true);
    } catch (err) {
      // setApeCoinValidated(false);
      console.error("Error calling the contract function:", err);
    }
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div
          ref={modalRef}
          className="flex flex-col justify-center h-[800px] items-center bg-white rounded-lg w-full md:w-4/6 md:max-w-full mx-auto h-full shadow-2xl transition-transform duration-300 transform ${
            isOpen ? 'scale-100' : 'scale-90 pointer-events-none'
          }"
        >
          {status.isLoading ? (
            <div className="flex w-full p-10 relative">
              <div className="p-6 h-full w-full flex flex-col text-black justify-center items-center">
                <h1>Deploying</h1>
              </div>
            </div>
          ) : (
            <div className="flex w-full relative">
              <button
                className="bg-btn w-[40px] text-black font-bold h-[40px] rounded absolute top-10 right-10"
                onClick={() => onClose()}
              >
                X
              </button>
              <div className="p-6 h-full w-full flex flex-col text-black justify-center items-center">
                <h1 className="text-[20px] font-[600]">
                  Upload your design
                </h1>
                <div className="flex justify-center items-center w-full flex-col mt-10 gap-10 mb-10">
                  <div className="flex flex-col w-full justify-center items-center">
                    <input
                      type="text"
                      placeholder="Title"
                      className="flex w-full md:w-[400px] py-3 px-4 text-sm text-gray-900 border border-gray-300 rounded bg-gray-200 dark:text-gray-800 focus:outline-none dark:placeholder-gray-800"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col w-full justify-center items-center">
                    <input
                      placeholder="Description"
                      type="text"
                      className="block w-full md:w-[400px] py-3 px-4 text-sm text-gray-900 border border-gray-300 rounded bg-gray-200 dark:text-gray-800 focus:outline-none dark:placeholder-gray-800"
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col w-full justify-center items-center">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      placeholder="Select a file..."
                      className="flex w-full md:w-[400px] py-3 px-4 text-sm text-gray-900 border border-gray-300 rounded bg-gray-200 dark:text-gray-800 focus:outline-none dark:placeholder-gray-800"
                    />
                  </div>
                  <div className="flex flex-col w-full justify-center items-center">
                    <input
                      type="text"
                      placeholder="Reward"
                      className="flex w-full md:w-[400px] py-3 px-4 text-sm text-gray-900 border border-gray-300 rounded bg-gray-200 dark:text-gray-800 focus:outline-none dark:placeholder-gray-800"
                      value={form.reward}
                      onChange={(e) =>
                        setForm({ ...form, reward: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {apeCoinValidated ? (
            <button
              className="bg-btn mb-10 rounded-[18px] px-5 py-3 font-[600]"
              onClick={() => handleUpload()}
            >
              UPLOAD
            </button>
          ) : (
            <button
              className="bg-btn mb-10 rounded-[18px] px-5 py-3 font-[600]"
              onClick={() => handleClickApproveApe()}
            >
              APPROVE APE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

/// in order to depoist ape, you need to approve this contract.
