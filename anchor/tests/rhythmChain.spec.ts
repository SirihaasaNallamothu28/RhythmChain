import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { RhythmChain } from '../target/types/rhythmChain'

describe('rhythmChain', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.RhythmChain as Program<RhythmChain>

  const rhythmChainKeypair = Keypair.generate()

  it('Initialize RhythmChain', async () => {
    await program.methods
      .initialize()
      .accounts({
        rhythmChain: rhythmChainKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([rhythmChainKeypair])
      .rpc()

    const currentCount = await program.account.rhythmChain.fetch(rhythmChainKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment RhythmChain', async () => {
    await program.methods.increment().accounts({ rhythmChain: rhythmChainKeypair.publicKey }).rpc()

    const currentCount = await program.account.rhythmChain.fetch(rhythmChainKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment RhythmChain Again', async () => {
    await program.methods.increment().accounts({ rhythmChain: rhythmChainKeypair.publicKey }).rpc()

    const currentCount = await program.account.rhythmChain.fetch(rhythmChainKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement RhythmChain', async () => {
    await program.methods.decrement().accounts({ rhythmChain: rhythmChainKeypair.publicKey }).rpc()

    const currentCount = await program.account.rhythmChain.fetch(rhythmChainKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set rhythmChain value', async () => {
    await program.methods.set(42).accounts({ rhythmChain: rhythmChainKeypair.publicKey }).rpc()

    const currentCount = await program.account.rhythmChain.fetch(rhythmChainKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the rhythmChain account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        rhythmChain: rhythmChainKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.rhythmChain.fetchNullable(rhythmChainKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
