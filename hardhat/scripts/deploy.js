const { ethers, hre } = require("hardhat");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");

async function main() {
  const designChainFactory = await ethers.getContractFactory("DesignChain");

  // Deploy the contract
  const deployedDesignChain = await designChainFactory.deploy();

  await deployedDesignChain.deployed();

  console.log("DesignChain Address:", deployedDesignChain.address);

  console.log("Waiting for Etherscan verification.....");
  // Wait for Etherscan to notice that the contract has been deployed
  await sleep(30000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: deployedDesignChain.address,
    constructorArguments: [],
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Use with: npx hardhat run scripts/deploy.js --network mumbai
