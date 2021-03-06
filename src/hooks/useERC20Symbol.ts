import { useCallback, useEffect, useState } from 'react'
import { Contract } from 'web3-eth-contract'
import { getSymbol } from '../utils/erc20'

const useERC20Symbol = (tokenContract: Contract) => {
  const [symbol, setSymbol] = useState('')
  
  const fetchSymbol = useCallback(async () => {
    const symbol = await getSymbol(tokenContract)
    setSymbol(symbol)
  }, [tokenContract])

  useEffect(() => {
    fetchSymbol()
  }, [fetchSymbol, tokenContract])

  return symbol
}

export default useERC20Symbol
