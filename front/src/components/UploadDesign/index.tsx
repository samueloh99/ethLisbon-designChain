import React, { useEffect, useRef, useState } from "react";

import { Web3Storage } from "web3.storage";

import { ethers, Contract, Signer } from "ethers";

import { useSigner } from "wagmi";

import { abi } from "../../../abi/abi.json";
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

    const amountMATIC = ethers.utils.parseEther(form.reward);

    try {
      // // Call your contract function
      const result = await contract.createDesign(cid, amountMATIC, {
        value: amountMATIC,
      });
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

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div
          ref={modalRef}
          className="flex flex-col justify-center items-center bg-black border-2 border-white rounded-lg w-4/6 md:max-w-full mx-auto h-full shadow-2xl transition-transform duration-300 transform ${
            isOpen ? 'scale-100' : 'scale-90 pointer-events-none'
          }"
        >
          {status.isLoading ? (
            <div className="flex w-full p-10 relative">
              <div className="p-6 h-full w-full flex flex-col text-white justify-center items-center">
                <h1>Loading</h1>
              </div>
            </div>
          ) : (
            <div className="flex w-full p-10 relative">
              <button
                className="bg-red-500 w-[40px] text-white font-bold h-[40px] rounded absolute top-10 right-10"
                onClick={() => onClose()}
              >
                X
              </button>
              <div className="p-6 h-full w-full flex flex-col text-white justify-center items-center">
                <h2 className="text-2xl font-bold mb-4">
                  Upload your design
                </h2>
                <div className="flex flex-col gap-10 mb-10">
                  <div className="flex flex-col">
                    <h1 className="uppercase font-[600]">Title:</h1>
                    <input
                      type="text"
                      className="block w-[400px] py-2 px-4 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="uppercase font-[600]">
                      Description:
                    </h1>
                    <input
                      type="text"
                      className="block w-[400px] py-2 px-4 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="uppercase font-[600]">
                      Your Design:
                    </h1>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="block w-[400px] py-2 px-4 text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="uppercase font-[600]">Reward:</h1>

                    <input
                      type="text"
                      className="block w-[400px] py-2 px-4 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
          <button
            className="bg-btn px-5 py-4 rounded-[18px] flex mb-5"
            onClick={() => handleUpload()}
          >
            UPLOAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
