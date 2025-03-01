// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import RhythmChainIDL from '../target/idl/rhythmChain.json'
import type { RhythmChain } from '../target/types/rhythmChain'

// Re-export the generated IDL and type
export { RhythmChain, RhythmChainIDL }

// The programId is imported from the program IDL.
export const RHYTHM_CHAIN_PROGRAM_ID = new PublicKey(RhythmChainIDL.address)

// This is a helper function to get the RhythmChain Anchor program.
export function getRhythmChainProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...RhythmChainIDL, address: address ? address.toBase58() : RhythmChainIDL.address } as RhythmChain, provider)
}

// This is a helper function to get the program ID for the RhythmChain program depending on the cluster.
export function getRhythmChainProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the RhythmChain program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return RHYTHM_CHAIN_PROGRAM_ID
  }
}
