'use client'

import { getRhythmChainProgram, getRhythmChainProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useRhythmChainProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getRhythmChainProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getRhythmChainProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['rhythmChain', 'all', { cluster }],
    queryFn: () => program.account.rhythmChain.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['rhythmChain', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ rhythmChain: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useRhythmChainProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useRhythmChainProgram()

  const accountQuery = useQuery({
    queryKey: ['rhythmChain', 'fetch', { cluster, account }],
    queryFn: () => program.account.rhythmChain.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['rhythmChain', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ rhythmChain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['rhythmChain', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ rhythmChain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['rhythmChain', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ rhythmChain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['rhythmChain', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ rhythmChain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
