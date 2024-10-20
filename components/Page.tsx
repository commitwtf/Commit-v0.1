"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect } from 'wagmi';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from 'next/image';
import Web3 from "web3";
import commitABI from '../contract/commitabi.json';
import usdcABI from '../contract/usdcabi.json';

// Define Navbar Component
const Navbar = () => {
  return (
    <nav className="flex justify-center items-center w-full fixed z-[6] backdrop-blur-sm py-3">
      <div className="flex justify-between items-center w-full max-w-screen-lg mx-auto px-4">
        <a href="#" className="flex justify-start items-center flex-shrink-0 cursor-pointer">
          <div className="relative w-14 h-14">
            <Image 
              src="https://i.imgur.com/G6Dx8nu.png" 
              alt="logo" 
              layout="fill" 
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <h1 className="hidden sm:block font-normal font-poppins text-[24px] text-white leading-loose px-2 mt-2">
            Commit
          </h1>
        </a>
        <div className="flex items-center">
          <ConnectButton
            label="Connect Wallet"
            accountStatus="address"
            chainStatus="none"
            showBalance={false}
          />
        </div>
      </div>
    </nav>
  );
};

// CommitPage Component
const CommitPage = () => {
  const { address, isConnected } = useAccount();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [message, setMessage] = useState<string>("");

  const usdcContractAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const commitContractAddress = "0xc8aF01aaa367A6718d5bA0F9Fa24112564e2e722";
  const amountToApprove = Web3.utils.toWei("10", "mwei"); // USDC has 6 decimals

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      setMessage("Please install MetaMask!");
    }
  }, []);

  const handleCommit = async () => {
    if (web3 && isConnected && address) {
      try {
        const accounts = await web3.eth.getAccounts();
        const userAccount = address;

        // Initialize USDC and commit contracts
        const usdcContract = new web3.eth.Contract(usdcABI, usdcContractAddress);
        const commitContract = new web3.eth.Contract(commitABI, commitContractAddress);

        // Approve USDC transfer
        await usdcContract.methods.approve(commitContractAddress, amountToApprove).send({ from: userAccount });

        // Join commitment
        await commitContract.methods.joinCommitment(/* arguments you need to pass */).send({ from: userAccount });

        console.log("Successfully joined the commitment!");
      } catch (error) {
        console.error("Error during commitment:", error);
        setMessage("Transaction failed. Check console for details.");
      }
    } else {
      setMessage("Please connect your wallet first.");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen pt-32 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 overflow-hidden">
      {/* Background Blur Effects */}
      <div className='absolute -top-20 -left-20 w-52 h-52 bg-[#33bbcf] rounded-full animate-blob1 filter blur-2xl opacity-[35%] z-0' />
      <div className='absolute top-20 -right-20 w-52 h-52 bg-[#9dedf0] rounded-full animate-blob2 filter blur-2xl opacity-[35%] z-0' />
      <div className='absolute -bottom-20 left-20 w-52 h-52 bg-[#def9fa] rounded-full animate-blob3 filter blur-2xl opacity-[35%] z-0' />

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
            {/* Commit Details */}
            <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md">
        <strong className="text-white flex justify-center">FtC Public Goods Supporter</strong>
        <p className="text-gray-300">You are committing to donate to at least 3 public goods.</p>
      </div>

      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md flex items-center justify-center">
        <Image src="/image.webp" alt="image" className="max-h-64 rounded-lg" width={200} height={300} />
      </div>

      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md">
        <strong className="text-white">Stake</strong>
        <p className="text-gray-300">10 USDC</p>
      </div>

      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md">
        <strong className="text-white">Details</strong>
        <p className="text-gray-300">
          Donate to any project developed during the <a href="https://www.fundingthecommons.io/residencies" className="underline">FtC Residency</a> in Chiang Mai by the end of the year.
        </p>
        <p className="text-gray-300">Donations can be of any amount.</p>
        <p className="text-gray-300">You can submit the proofs of supporting in the telegram group.</p>
      </div>

      <div className="w-full max-w-md mb-6 rounded-lg backdrop-blur-md">
        <button
          onClick={handleCommit}
          className="w-full p-3 bg-[#33bbcf] rounded-md text-white hover:bg-[#2a9da4] transition duration-300"
        >
          <strong className="text-lg">Commit</strong>
        </button>
      </div>

      {message && (
        <div className="w-full max-w-md p-4 mb-6 bg-red-500 rounded-lg text-white text-center">
          {message}
        </div>
      )}
    </div>
  );
};

// Main Component
const Main = () => {
  return (
    <div className="relative">
      <Navbar />
      <CommitPage />
    </div>
  );
};

export default Main;
