"use client";

import { FC, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const ConnectWalletButton: FC = () => {
  const { connected, publicKey } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString());
    }
  }, [publicKey, connected]);

  return (
    <div className="wallet-connection">
      <WalletMultiButton className="custom-wallet-button">
        {connected
          ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
          : "connect wallet"}
      </WalletMultiButton>
    </div>
  );
};

export default ConnectWalletButton;
