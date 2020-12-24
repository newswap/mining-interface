import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import ERC20ABI from '../constants/abi/ERC20.json'

export const getContract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (ERC20ABI.abi as unknown) as AbiItem,
    address,
  )
  return contract
}

export const getAllowance = async (
  contract: Contract,
  owner: string,
  spender: string,
): Promise<string> => {
  try {
    const allowance: string = await contract.methods
      .allowance(owner, spender)
      .call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getTotalSupply = async (
  provider: provider,
  tokenAddress: string,
): Promise<string> => {
  const contract = getContract(provider, tokenAddress)
  try {
    const totalSupply: string = await contract.methods
      .totalSupply()
      .call()
    return totalSupply
  } catch (e) {
    return '0'
  }
}

export const getBalance = async (
  provider: provider,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance: string = await lpContract.methods
      .balanceOf(userAddress)
      .call()
    return balance
  } catch (e) {
    return '0'
  }
}
