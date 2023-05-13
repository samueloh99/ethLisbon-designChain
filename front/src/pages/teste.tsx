import { ethers } from "ethers";

const Home = () => {
  const handleClick = async () => {
    const proof =
      "0x1e9fdcd8b6ff1cd7491d38d26b748cf8a366c442f829a34beb4750d4f7c065811816772bd16f2be719602f3817691c4b594f9b2304d5a79178d9c1b6908958402467c3893236daeaa60f5a36589f3a9bab38ccad7a4f8f3e116d9055dfc45a8514c50c40d0b24ac79a567bb50ada890a6a879d50528961ca4983db0fc38af4830a829001adfbf6f93372f90bf2561906b96a683a1a799caf4951ee5f9ebdacf315c6db01d855ea2115a2db5deffd0ff16f29f659b4a40e5e1d0333fcfb93865a22b69c1c20a991f2fb2c1badaf601ba3fe18aa58a7c22469088f6ca022d789e4267ae641b9b7d33aca7149eb20ef947f108aac2afdb8135d27d3ae85edf31fee";
    const unpackedProof = ethers.utils.defaultAbiCoder.decode(
      ["uint256[8]"],
      proof
    )[0];
    console.log("unpackedProof: ", unpackedProof);
  };

  return (
    <div>
      <button onClick={handleClick}>Call createDesign</button>
    </div>
  );
};

export default Home;
