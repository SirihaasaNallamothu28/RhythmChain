import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MusicVerifier } from "@/components/music-verifier";
import { HowItWorks } from "@/components/how-it-works";
import { RecentVerifications } from "@/components/recent-verifications";
import { Music4 } from "lucide-react";
import ConnectWalletButton from "@/components/wallet_connect";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-300">
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Music4 className="h-4 w-4 text-violet-500" />
            <span className="text-lg font-medium">rhythmChain</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#how-it-works"
              className="text-sm lowercase hover:text-violet-400"
            >
              how it works
            </Link>
            <Link
              href="#recent"
              className="text-sm lowercase hover:text-violet-400"
            >
              recent verifications
            </Link>
          </nav>
          <ConnectWalletButton />
        </div>
      </header>
      <main className="container px-4 py-12 md:px-6 md:py-16">
        <section className="mx-auto max-w-4xl">
          <div className="space-y-2 text-center mb-10">
            <h1 className="text-2xl font-medium tracking-tight lowercase text-white sm:text-3xl">
              verify music authenticity
            </h1>
            <p className="text-zinc-400 lowercase">
              upload your track to verify if it's an original creation
            </p>
          </div>
          <div>
            <MusicVerifier />
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-4xl py-16">
          <HowItWorks />
        </section>

        <section id="recent" className="mx-auto max-w-4xl py-16">
          <RecentVerifications />
        </section>
      </main>
      <footer className="border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-6 text-zinc-500">
          <div className="flex items-center gap-2">
            <Music4 className="h-4 w-4 text-violet-500" />
            <span className="text-sm lowercase">rhythm chain</span>
          </div>
          <p className="text-xs lowercase">© 2025</p>
        </div>
      </footer>
    </div>
  );
}
