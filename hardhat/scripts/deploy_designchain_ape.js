const { ethers, hre } = require("hardhat");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");

async function main() {
  const designChainFactory = await ethers.getContractFactory(
    "DesignChain_IntegratingApe"
  );

  // Address of the ERC20 token
  const tokenAddress = "0x9C0BAB447CBF9F86C8800f566448C373a144f47f";

  // Deploy the contract
  const deployedDesignChain = await designChainFactory.deploy(tokenAddress);

  await deployedDesignChain.deployed();

  console.log(
    "DesignChain_IntegratingApe Address:",
    deployedDesignChain.address
  );

  console.log("Waiting for Etherscan verification.....");
  // Wait for Etherscan to notice that the contract has been deployed
  await sleep(10000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: deployedDesignChain.address,
    constructorArguments: [tokenAddress],
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

// Use with: npx hardhat run scripts/deploy_designchain_ape.js --network mumbai
