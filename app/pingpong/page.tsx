"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import commitABI from "../../contract/commitabi.json";
import usdcABI from "../../contract/usdcabi.json";
import { parseUnits } from "viem";
import {config} from "../../wagmi"

// Define Navbar Component
const Navbar = () => {
  return (
    <nav className="flex justify-center items-center w-full fixed z-[6] backdrop-blur-sm py-3">
      <div className="flex justify-between items-center w-full max-w-screen-lg mx-auto px-4">
        <a
          href="#"
          className="flex justify-start items-center flex-shrink-0 cursor-pointer"
        >
          <h1 className="font-normal font-poppins text-[24px] text-white leading-loose px-2 mt-2">
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
  const [message, setMessage] = useState("");

  const usdcContractAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const commitContractAddress = "0xc8aF01aaa367A6718d5bA0F9Fa24112564e2e722";
  const amountToApproveBI = parseUnits("5", 6);

    // Read allowance from USDC contract
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
      address: usdcContractAddress,
      abi: usdcABI,
      functionName: "allowance",
      args: [address, commitContractAddress],
    });
  
    const { writeContractAsync } = useWriteContract();
  
    const handleCommit = async () => {
      if (!isConnected || !address) {
        setMessage("Please connect your wallet before committing.");
        return;
      }
  
      try {
        // Allowance comes in as a bigint from wagmi/viem
        const allowanceBI = 
        allowance && (typeof allowance === 'string' || typeof allowance === 'number' || typeof allowance === 'bigint')
          ? BigInt(allowance)
          : BigInt(0);
  
        // Check if allowance is sufficient
        if (allowanceBI < amountToApproveBI) {
          setMessage("Approving 5 USDC for the commitment...");
  
          const approveTx = await writeContractAsync({
            address: usdcContractAddress,
            abi: usdcABI,
            functionName: "approve",
            args: [commitContractAddress, amountToApproveBI],
          });
  
          // Wait for approval confirmation
          await waitForTransactionReceipt(config, {hash: approveTx});
          setMessage("USDC approved! Joining the commitment...");
          await refetchAllowance(); // Re-fetch allowance after approval
        } else {
          setMessage("USDC is already approved. Joining the commitment...");
        }
  
        // Call joinCommitment after approval confirmation
        const joinTx = await writeContractAsync({
          address: commitContractAddress,
          abi: commitABI,
          functionName: "joinCommitment",
          args: [2],
        });
  
        // Wait for the transaction to be confirmed
        await waitForTransactionReceipt(config, {hash: joinTx});
        setMessage("Successfully joined the commitment!");
      } catch (error) {
        console.error("Error during commitment:", error);
        setMessage("An error occurred during the commitment process.");
      }
    };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen pt-32 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute -top-20 -left-20 w-52 h-52 bg-[#33bbcf] rounded-full animate-blob1 filter blur-2xl opacity-[35%] z-0" />
      <div className="absolute top-20 -right-20 w-52 h-52 bg-[#9dedf0] rounded-full animate-blob2 filter blur-2xl opacity-[35%] z-0" />
      <div className="absolute -bottom-20 left-20 w-52 h-52 bg-[#def9fa] rounded-full animate-blob3 filter blur-2xl opacity-[35%] z-0" />

      <div className="w-full max-w-md p-2 mb-2 rounded-lg backdrop-blur-md flex justify-center">
        <p className="text-gray-400">
          Commit Creator:
          <Image
            src="https://pbs.twimg.com/profile_images/1475184333329768450/vN6horsl_400x400.jpg"
            alt="creator"
            width={24}
            height={24}
            className="inline-block rounded-full mx-1 align-middle"
          />
          <a
            href="https://x.com/iamnotstatic"
            target="_blank"
            rel="noopener noreferrer"
          >
            @iamnotstatic
          </a>
        </p>
      </div>
      {/* Commit Details */}
      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md">
        <strong className="text-white flex justify-center">
          FtC Ping Pong Tournament
        </strong>
        <p className="text-gray-300 flex justify-center">
            Have some sports exercises & fun together!
        </p>
      </div>

      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md flex items-center justify-center">
        <Image
          src="/ping.webp"
          alt="image"
          className="max-h-64 rounded-lg"
          width={350}
          height={500}
        />
      </div>

      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md">
        <strong className="text-white">Stake</strong>
        <p className="text-gray-300">5 USDC</p>
      </div>

      <div className="w-full max-w-md p-4 mb-2 bg-gray-800 rounded-lg backdrop-blur-md">
        <strong className="text-white">Details</strong>
        <p className="text-gray-300">
          Participate in the PingPong Tournament at the{" "}
          <a
            href="https://www.fundingthecommons.io/residencies"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            FtC Residency
          </a>{" "}
          .
        </p>
        <p className="text-gray-300">No Cheating</p>
        <p className="text-gray-300">
          You can submit the Proof of Participating in the telegram group.
        </p>
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
        <div className="w-full max-w-md p-4 mb-2 bg-gray-700 text-white rounded-lg backdrop-blur-md flex justify-center">
          {message}
        </div>
      )}

      <div className="flex justify-center space-x-4 mt-4">
        <a
          href="https://t.me/+e0yHv2tdDG40ZTZi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/telegram.png" alt="Telegram" width={30} height={30} />
        </a>
        <a
          href="https://warpcast.com/~/channel/commit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/farcaster.svg" alt="Farcaster" width={30} height={30} />
        </a>
      </div>
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
