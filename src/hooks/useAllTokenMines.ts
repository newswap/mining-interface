import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'
import { useWallet } from 'use-wallet'

import { getAllTokenMines } from '../sushi/utils'
import useBlock from './useBlock'

export interface TokenMine {
  // tokenMine address
  id: string
  owner: string
  name: string
  stakingToken: string
  rewardsToken: string
  startTime: number
  endTime: number
  rewardAmount: number

  stakingTokenSymbol: string
  stakingTokenName: string
  stakingTokenDecimals: number
  rewardsTokenSymbol: string
  rewardsTokenName: string
  rewardsTokenDecimals: number

  isStakingLPToken: boolean
  token0Address: string
  token0Symbol: string
  token0Name: string
  token0Decimals: number
  token1Address: string
  token1Symbol: string
  token1Name: string
  token1Decimals: number

  // creation stats
  createdAtTimestamp: number
  createdAtBlockNumber: number
}

// TODO 删除，改用useCustomFarms
const useAllTokenMines = () => {
  const [tokenMines, setTokenMines] = useState([] as Array<TokenMine>)
  const {
    ethereum,
  }: { ethereum: provider } = useWallet()
  // const block = useBlock()

  const fetchAllTokenMines= useCallback(async () => {
    const allTokenMines= await getAllTokenMines()
    setTokenMines(allTokenMines)
  }, [ethereum])

  useEffect(() => {
    if (ethereum) {
      fetchAllTokenMines()
    }
  }, [ethereum]) //[ethereum, block]

  return tokenMines
}

export default useAllTokenMines
