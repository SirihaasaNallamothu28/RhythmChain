import Image from "next/image";


export default function Home() {
  return (
    <div className="app">

      <main>
        <h2>Welcome to RythmChain</h2>
        <p>Please sign in with your Solana wallet to continue</p>
        {/* <SolanaSignIn /> */}
      </main>
      <footer>
        <p>© 2025 rythmchain</p>
      </footer>
    </div>

  );
}
