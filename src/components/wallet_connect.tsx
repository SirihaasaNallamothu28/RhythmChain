"use client";

import { FC, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection } from "@solana/wallet-adapter-react";

export const ConnectWalletButton: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (publicKey) {
      const address = publicKey.toBase58();
      setWalletAddress(address);

      connection
        .getBalance(publicKey)
        .then((lamports) => {
          setBalance(lamports / 1_000_000_000);
        })
        .catch((error) => {
          console.error("Error fetching balance:", error);
          setBalance(0); // Set a default value to avoid UI issues
        });
    } else {
      setWalletAddress(null);
      setBalance(null);
    }
  }, [publicKey]);

  return (
    <div className="wallet-connection">
      <WalletMultiButton className="custom-wallet-button" />
      {/* {walletAddress && balance !== null && (
        <p className="text-sm flex justify-center text-green-400">
          {balance.toFixed(2)} SOL
        </p>
      )} */}
    </div>
  );
};

export default ConnectWalletButton;
