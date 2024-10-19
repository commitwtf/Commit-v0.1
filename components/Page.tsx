"use client";

import { useState } from "react";
import { useWriteContract, usePrepareContractWrite, useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from 'next/image';

// Navbar Component
const Navbar = () => {
  return (
    <nav className="flex justify-center items-center w-full fixed z-[6] backdrop-blur-sm py-3">
      <div className="flex justify-between items-center w-full max-w-screen-lg mx-auto px-4">
        <a href="#" className="flex justify-start items-center flex-shrink-0 cursor-pointer">
          <div className="relative w-14 h-14"> {/* 55px by 55px */}
            <Image 
              src="https://i.imgur.com/G6Dx8nu.png" 
              alt="logo" 
              layout="fill" // Makes the Image fill the parent div
              objectFit="cover" // Maintain aspect ratio while covering the area
              className="rounded-full" // Make the image circular
            />
          </div>
          <h1 className="hidden sm:block font-normal font-poppins text-[24px] text-white leading-loose px-2 mt-2">
            Commit
          </h1>
        </a>
        <div className="flex items-center">
          <ConnectButton
            label="Connect Wallet" // Custom label for the button
            accountStatus="address" // Show only the address
            chainStatus="none" // Hide the chain UI
            showBalance={false} // Do not show balance
          />
        </div>
      </div>
    </nav>
  );
};


// CommitPage Component
const CommitPage = () => {
  const { isConnected } = useAccount(); // Track if the wallet is connected
  const { connect } = useConnect(); // Get connect function
  const { disconnect } = useDisconnect(); // Get disconnect function
  const [message, setMessage] = useState(""); // State to hold the message

  // const usdcContractAddress = "0xYourUSDCAddress"; // Replace with the USDC contract address
  // const amountToApprove = ethers.utils.parseUnits("10", 6); // Assuming USDC has 6 decimals

  // // Prepare the contract write for the joinCommitment function
  // const { config: joinCommitmentConfig } = usePrepareWriteContract({
  //   address: "0xYourContractAddress", // Replace with your contract address
  //   abi: YourCommitmentContractABI,
  //   functionName: 'joinCommitment',
  //   args: [/* arguments you need to pass */],
  //   enabled: isConnected, // Enable the contract write only when connected
  // });
  // const { config: approveConfig } = usePrepareWriteContract({
  //   address: usdcContractAddress,
  //   abi: YourUSDCabi,
  //   functionName: 'approve',
  //   args: [joinCommitmentConfig.address, amountToApprove],
  //   enabled: isConnected, // Enable the contract write only when connected
  // });


  // const { write: approveUsdc } = useWriteContract(approveConfig);
  // const { write: joinCommitment } = useWriteContract(joinCommitmentConfig);
  
  const handleCommit = async ()  => {
    if (isConnected) {
      try {
        // // Step 1: Approve USDC
        // const approveTx = await approveUsdc();
        // await approveTx.wait(); // Wait for the transaction to be mined

        // // Step 2: Call joinCommitment
        // const joinTx = await joinCommitment(); // Call the joinCommitment function
        // await joinTx.wait(); // Wait for the transaction to be mined

        console.log("Successfully joined the commitment!");
      } catch (error) {
        console.error("Error during commitment:", error);
      }
    } else {
      setMessage("Please connect your wallet first."); // Set message to prompt wallet connection
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen pt-32 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 overflow-hidden">
      {/* Background blobs */}
      <div className='absolute -top-20 -left-20 w-52 h-52 bg-[#33bbcf] rounded-full animate-blob1 filter blur-2xl opacity-[35%] z-0' />
      <div className='absolute top-20 -right-20 w-52 h-52 bg-[#9dedf0] rounded-full animate-blob2 filter blur-2xl opacity-[35%] z-0' />
      <div className='absolute -bottom-20 left-20 w-52 h-52 bg-[#def9fa] rounded-full animate-blob3 filter blur-2xl opacity-[35%] z-0' />
      
      {/* Commit Creator Text */}
      <div className="w-full max-w-md p-2 mb-2 rounded-lg backdrop-blur-md flex justify-center">
        <p className="text-gray-400">Commit Creator: 
          <Image 
            src="https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/932d36bd-3feb-4037-6219-e53664444600/anim=false,fit=contain,f=auto,w=288" 
            alt="creator" 
            width={24} 
            height={24} 
            className="inline-block rounded-full mx-1 align-middle"
          /> 
          <a href="https://warpcast.com/rev">@rev</a>
        </p>
      </div>
      {/* One Liner Section */}
      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md">
        <strong className="text-white flex justify-center">FtC Public Goods Supporter</strong>
        <p className="text-gray-300">You are committing to donate to at least 3 public goods.</p>
      </div>

      {/* Hardcoded Image Section */}
      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md flex items-center justify-center">
        <Image src="/image.webp" alt="image" className="max-h-64 rounded-lg" width={200} height={300} />
      </div>

      {/* Amount Section */}
      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md">
        <strong className="text-white">Stake</strong>
        <p className="text-gray-300">10 USDC</p>
      </div>

      {/* Detailed Description Section */}
      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md">
        <strong className="text-white">Details</strong>
        <p className="text-gray-300">
          Donate to any project developed during the <a href="https://www.fundingthecommons.io/residencies" className="underline">FtC Residency</a> in Chiang Mai by the end of the year.
        </p>
        <p className="text-gray-300">Donations can be of any amount.</p>
        <p className="text-gray-300">You can submit the proofs of supporting in the telegram group.</p>
      </div>

      {/* Commit Button Section */}
      <div className="w-full max-w-md mb-6 rounded-lg backdrop-blur-md">
        <button
          onClick={handleCommit}
          className="w-full p-3 bg-customPurple rounded-md text-white hover:bg-customPurple transition duration-300" // Button styles
        >
          <strong className="text-lg">Commit</strong>
        </button>
      </div>

      {/* Message Section */}
      {message && (
        <div className="w-full max-w-md p-4 mb-6 bg-red-500 rounded-lg text-white text-center">
          {message}
        </div>
      )}
<div className="flex justify-center space-x-4 mt-4">
  <a href="https://t.me/+e0yHv2tdDG40ZTZi" target="_blank" rel="noopener noreferrer">
    <Image src="/telegram.png" alt="Telegram" width={30} height={30} />
  </a>
  <a href="https://warpcast.com/~/channel/commit" target="_blank" rel="noopener noreferrer">
    <Image src="/farcaster.svg" alt="Farcaster" width={30} height={30} />
  </a>
</div>
    </div>
  );
};

// Main Component that includes Navbar and CommitPage
const Main = () => {
  return (
    <div className="relative">
      <Navbar />
      <CommitPage />
    </div>
  );
};

export default Main;
