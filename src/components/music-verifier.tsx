"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Waveform } from "@/components/waveform";
import { VerificationResult } from "@/components/verification-result";
import { Upload, Link2, Music, Loader2 } from "lucide-react";

export function MusicVerifier() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [hash, setHash] = useState<string | null>(null);

  const hashMessage = async (message: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  };
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    isOriginal: boolean;
    confidence: number;
    artist?: string;
    title?: string;
    registrationDate?: string;
  } | null>(null);

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
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const hexString = Array.from(uint8Array)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      const computedHash = await hashMessage(hexString);
      setHash(computedHash);
      console.log("SHA-256 Hash:", computedHash);
      alert("Audio uploaded successfully!");
    } catch (error) {
      console.error("Error reading audio file:", error);
      alert("Failed to process the audio file.");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setFile(null);
  };

  const simulateVerification = () => {
    setIsVerifying(true);
    setProgress(0);
    setVerificationComplete(false);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Randomly determine if the music is original or not for demo purposes
            const isOriginal = Math.random() > 0.5;
            setResult({
              isOriginal,
              confidence: 70 + Math.floor(Math.random() * 25),
              artist: isOriginal ? "olivia rodriguez" : undefined,
              title: isOriginal ? "digital heartbeat" : undefined,
              registrationDate: isOriginal ? "2024-12-15" : undefined,
            });
            setVerificationComplete(true);
            setIsVerifying(false);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const handleVerify = () => {
    if (file || url) {
      simulateVerification();
    }
  };

  const resetVerification = () => {
    setFile(null);
    setUrl("");
    setVerificationComplete(false);
    setResult(null);
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
                    ? "analyzing ai generation patterns..."
                    : "finalizing verification..."}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleVerify}
                disabled={isVerifying || (!file && !url)}
                className="gap-2 lowercase bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    verifying...
                  </>
                ) : (
                  <>verify authenticity</>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <VerificationResult result={result} onReset={resetVerification} />
        )}
      </CardContent>
    </Card>
  );
}
