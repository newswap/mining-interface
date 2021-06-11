import BigNumber from 'bignumber.js'
import React, { useCallback, useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import styled from 'styled-components'
import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import IconButton from '../../../components/IconButton'
import { AddIcon } from '../../../components/icons'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getLogoURLByAddress } from '../../../utils/addressUtil'
import useAllowanceGeneral from '../../../hooks/useAllowanceGeneral'
import useApproveGeneral from '../../../hooks/useApproveGeneral'
import useStakeGeneral from '../../../hooks/useStakeGeneral'
import useStakeNEW from '../../../hooks/useStakeNEW'
import useStakedBalanceByAccount from '../../../hooks/useStakedBalanceByAccount'
import useUnstakeGeneral from '../../../hooks/useUnstakeGeneral'
import useSushi from '../../../hooks/useSushi'
import { getWNewAddress } from '../../../sushi/utils'
import useNewBalance from '../../../hooks/useNewBalance'
import { getBalanceNumber, getDisplayBalance } from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import { useTranslation } from 'react-i18next'
import LazyIcon from '../../../components/LazyIcon'

interface StakeProps {
  stakingContract: Contract
  miningContract: Contract
  stakingTokenName: string
  isStakingLPToken: boolean
  stakingToken?: string
  token0Address?: string
  token1Address?: string
  stakingTokenDecimals: number
}

const Stake: React.FC<StakeProps> = ({ stakingContract, miningContract, stakingTokenName, isStakingLPToken, stakingToken, token0Address, token1Address, stakingTokenDecimals }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { account } = useWallet()
  const { t } = useTranslation()
  const sushi = useSushi()
  const wnewAddress = getWNewAddress(sushi)

  const newBalance = useNewBalance()
  const allowance = useAllowanceGeneral(stakingContract, miningContract)
  const tokenBalance = useTokenBalance(stakingContract?.options.address)
  const stakedBalance = useStakedBalanceByAccount(miningContract)

  const { onApprove } = useApproveGeneral(stakingContract, miningContract)
  const { onStake } = useStakeGeneral(miningContract)
  const { onStakeNEW } = useStakeNEW(miningContract)
  const { onUnstake } = useUnstakeGeneral(miningContract)

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={ wnewAddress?.toLowerCase() != stakingContract?.options.address?.toLowerCase() ? tokenBalance : newBalance }
      tokenDecimals = {stakingTokenDecimals}
      onConfirm={ wnewAddress?.toLowerCase() != stakingContract?.options.address?.toLowerCase() ? onStake : onStakeNEW }
      tokenName={stakingTokenName}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      tokenDecimals = {stakingTokenDecimals}
      onConfirm={onUnstake}
      tokenName={stakingTokenName}
    />,
  )

  useEffect(() => {
    setRequestedApproval(false)
  }, [account, setRequestedApproval])

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            {/* <CardIcon>👨🏻‍🍳</CardIcon> */}
            <StyledDiv>
              {
                isStakingLPToken ? 
                <>
                  {/* <StyledImg src={getLogoURLByAddress(token1Address)}></StyledImg>
                  <StyledImgL src={getLogoURLByAddress(token0Address)}></StyledImgL> */}
                  <LazyIcon address={token1Address} customStyle={iconStyleR}/>
                  <LazyIcon address={token0Address} customStyle={iconStyleL}/>
                </> :
                <>
                  <LazyIcon address={stakingToken} customStyle={iconStyle}/>
                </>
              }
            </StyledDiv>
            <Spacer height={20} />
            <Value value={getBalanceNumber(stakedBalance, stakingTokenDecimals)} />
            <Label text={`${stakingTokenName} ` + t('Staked')} />
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() && wnewAddress?.toLowerCase() != stakingContract?.options.address?.toLowerCase() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
                text={requestedApproval ? t('Approving...') : t('Approve') + ` ${stakingTokenName}`}
                size = 'new'
                variant = 'green'
              />
            ) : (
              <>
                <Button
                  disabled={stakedBalance.eq(new BigNumber(0))}
                  text={t('Unstake')}
                  onClick={onPresentWithdraw}
                  size = 'new'
                  variant = 'grey'
                />
                <StyledActionSpacer />
                <Button
                  disabled={false}
                  text={t('Stake')}
                  onClick={onPresentDeposit}
                  size = 'new'
                  variant = 'green'
                />
              </>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

interface SpacerProps{
  height: number
}

const Spacer = styled.div<SpacerProps>`
  height: ${props => props.height}px;
`

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`
const StyledImg = styled.img `
    float: left;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin-left: 26px;
`

const StyledImgL = styled.img `
    float: left;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin-right: -26px;
    margin-top: -60px;
`
const StyledDiv = styled.div`
  width: 86px;

`

const iconStyle: React.CSSProperties = {
  // float: 'left',
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  marginLeft: '13px',
  // marginTop: '-60px',
  // background: 'white',
}

const iconStyleR: React.CSSProperties = {
  float: 'left',
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  marginLeft: '26px',
  // background: 'white',
}

const iconStyleL: React.CSSProperties = {
  float: 'left',
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  marginRight: '-26px',
  marginTop: '-60px',
  // background: 'white',
}


export default Stake
