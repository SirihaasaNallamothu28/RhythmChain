"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Waveform } from "@/components/waveform";
import { VerificationResult } from "@/components/verification-result";
import { Upload, Link2, Music, Loader2 } from "lucide-react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

// You'll need to import your IDL
import idl from "public/idl/rhythmChain.json";
// /Users/sirihaasanallamothu/Desktop/Sirihaasa/RhythmChain/
import { AnchorProvider, BN, Program, web3 } from "@coral-xyz/anchor";

const PROGRAM_ID = "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF";

export function MusicVerifier() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    isOriginal: boolean;
    confidence: number;
    artist?: string;
    title?: string;
    registrationDate?: string;
    owner?: string;
  } | null>(null);

  // For registration form
  const [artistName, setArtistName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Initialize program when wallet is connected
  useEffect(() => {
    if (wallet && connection) {
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });

      try {
        const programId = new PublicKey(PROGRAM_ID);
        const program = new Program(idl, programId, provider);
        setProgram(program);
      } catch (error) {
        console.error("Failed to initialize program:", error);
      }
    }
  }, [wallet, connection]);

  // File hash function - uses the actual file content, not just a text representation
  const hashFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;

          if (!arrayBuffer) {
            reject(new Error("Failed to read file"));
            return;
          }

          // Use Web Crypto API for hashing
          const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

          resolve(hashHex);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] || null;
    if (!selectedFile) {
      alert("Please upload an audio file.");
      return;
    }
    setFile(selectedFile);

    try {
      const computedHash = await hashFile(selectedFile);
      setHash(computedHash);
      console.log("SHA-256 Hash:", computedHash);
    } catch (error) {
      console.error("Error reading audio file:", error);
      alert("Failed to process the audio file.");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setFile(null);
    setHash(null);
  };

  const simulateProgress = (callback: () => void) => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          callback();
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const verifyMusic = async () => {
    if (!file || !hash || !program) return;

    setIsVerifying(true);

    try {
      // Simulate progress for UI feedback
      simulateProgress(async () => {
        try {
          // Find the PDA for this hash
          const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from(hash)],
            program.programId
          );

          try {
            // Try to fetch the account - if it exists, the file has been registered
            const musicRecord = await (
              program.account as any
            ).rhythmChain.fetch(pda);

            // Format the timestamp as a date
            const timestamp = new Date(
              Number(musicRecord.fileTimestamp) * 1000
            );
            const formattedDate = timestamp.toISOString().split("T")[0];

            setResult({
              isOriginal: true,
              confidence: 100, // We're 100% confident since we found a blockchain record
              artist: musicRecord.fileAuthor,
              title: musicRecord.fileName,
              registrationDate: formattedDate,
              owner: musicRecord.owner.toString(),
            });

            setVerificationComplete(true);
          } catch (error) {
            // Account not found, file is not registered
            setResult({
              isOriginal: false,
              confidence: 0,
              artist: undefined,
              title: undefined,
              registrationDate: undefined,
            });

            // Show registration form
            setShowRegistrationForm(true);
            setVerificationComplete(true);
          }
        } catch (error) {
          console.error("Error during verification:", error);
          setResult({
            isOriginal: false,
            confidence: 0,
            artist: undefined,
            title: undefined,
            registrationDate: undefined,
          });
          setVerificationComplete(true);
        }

        setIsVerifying(false);
      });
    } catch (error) {
      console.error("Error verifying music:", error);
      setIsVerifying(false);
      setVerificationComplete(true);
      setResult({
        isOriginal: false,
        confidence: 0,
      });
    }
  };

  const registerMusic = async () => {
    if (!file || !hash || !program || !wallet) {
      alert("Missing required information");
      return;
    }

    const fileName = file.name;

    if (!artistName) {
      alert("Please enter the artist name");
      return;
    }

    setIsRegistering(true);

    try {
      simulateProgress(async () => {
        try {
          // Get timestamp and file size
          const timestamp = Math.floor(Date.now() / 1000);
          const fileLength = file.size;

          // Create a PDA for this file hash
          const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from(hash)],
            program.programId
          );

          // Call the initialize function
          const tx = await program.methods
            .initialize(
              fileName,
              artistName,
              new BN(timestamp),
              new BN(fileLength),
              hash
            )
            .accounts({
              signer: wallet.publicKey,
              rhythmChain: pda,
              systemProgram: web3.SystemProgram.programId,
            })
            .rpc();

          console.log("Transaction signature:", tx);

          // Update result with registration info
          setResult({
            isOriginal: true,
            confidence: 100,
            artist: artistName,
            title: fileName,
            registrationDate: new Date().toISOString().split("T")[0],
            owner: wallet.publicKey.toString(),
          });

          setShowRegistrationForm(false);
          setVerificationComplete(true);
        } catch (error) {
          console.error("Error registering music:", error);
          alert(
            "Failed to register music. It might already be registered or there was a transaction error."
          );
        }

        setIsRegistering(false);
      });
    } catch (error) {
      console.error("Error:", error);
      setIsRegistering(false);
      alert("An error occurred during registration");
    }
  };

  const handleVerify = () => {
    if (file) {
      verifyMusic();
    } else if (url) {
      // Currently URL verification not implemented
      alert("URL verification is not implemented yet");
    }
  };

  const resetVerification = () => {
    setFile(null);
    setUrl("");
    setHash(null);
    setVerificationComplete(false);
    setResult(null);
    setShowRegistrationForm(false);
    setArtistName("");
  };

  return (
    <Card className="w-full overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      <CardContent className="p-6">
        {!verificationComplete ? (
          <div className="space-y-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50">
                <TabsTrigger
                  value="upload"
                  className="lowercase flex items-center gap-2 data-[state=active]:bg-zinc-700"
                >
                  <Upload className="h-4 w-4" />
                  upload file
                </TabsTrigger>
                <TabsTrigger
                  value="link"
                  className="lowercase flex items-center gap-2 data-[state=active]:bg-zinc-700"
                >
                  <Link2 className="h-4 w-4" />
                  paste link
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-6 space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label
                    htmlFor="music-file"
                    className="lowercase text-zinc-400"
                  >
                    upload music file
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="music-file"
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="flex-1 bg-zinc-800 border-zinc-700 text-zinc-300"
                    />
                  </div>
                  {file && (
                    <p className="text-sm text-zinc-500 lowercase">
                      selected: {file.name}
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="link" className="mt-6 space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label
                    htmlFor="music-url"
                    className="lowercase text-zinc-400"
                  >
                    music url
                  </Label>
                  <Input
                    id="music-url"
                    type="url"
                    placeholder="https://example.com/music.mp3"
                    value={url}
                    onChange={handleUrlChange}
                    className="bg-zinc-800 border-zinc-700 text-zinc-300"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {(file || url) && !isVerifying && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-violet-500" />
                    <span className="font-medium lowercase text-zinc-300">
                      {file ? file.name : "music from url"}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Waveform />
                </div>
              </div>
            )}

            {isVerifying && (
              <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-800/30 p-6">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                  <div>
                    <h3 className="text-lg font-medium lowercase text-zinc-200">
                      verifying authenticity
                    </h3>
                    <p className="text-sm text-zinc-400 lowercase">
                      analyzing audio fingerprint and checking blockchain
                      records...
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="h-1 w-full bg-zinc-800" />
                <p className="text-center text-sm text-zinc-500 lowercase">
                  {progress < 30
                    ? "extracting audio features..."
                    : progress < 60
                      ? "comparing with blockchain registry..."
                      : progress < 90
                        ? "analyzing audio patterns..."
                        : "finalizing verification..."}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleVerify}
                disabled={isVerifying || (!file && !url) || !wallet}
                className="gap-2 lowercase bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    verifying...
                  </>
                ) : !wallet ? (
                  <>connect wallet to verify</>
                ) : (
                  <>verify authenticity</>
                )}
              </Button>
            </div>
          </div>
        ) : showRegistrationForm ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium lowercase text-zinc-200">
                music not found in registry
              </h3>
              <p className="text-sm text-zinc-400 lowercase mt-2">
                this music hasn't been registered yet. register it as yours?
              </p>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="artist-name" className="lowercase text-zinc-400">
                artist name
              </Label>
              <Input
                id="artist-name"
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="enter your artist name"
                className="bg-zinc-800 border-zinc-700 text-zinc-300"
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={registerMusic}
                disabled={isRegistering || !artistName || !wallet}
                className="gap-2 lowercase bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    registering...
                  </>
                ) : (
                  <>register as mine</>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={resetVerification}
                className="lowercase border-zinc-700 text-zinc-300"
              >
                cancel
              </Button>
            </div>

            {isRegistering && (
              <div className="mt-4">
                <Progress value={progress} className="h-1 w-full bg-zinc-800" />
                <p className="text-center text-sm text-zinc-500 lowercase mt-2">
                  {progress < 50
                    ? "preparing transaction..."
                    : "registering on solana blockchain..."}
                </p>
              </div>
            )}
          </div>
        ) : (
          <VerificationResult result={result} onReset={resetVerification} />
        )}
      </CardContent>
    </Card>
  );
}
