import BigNumber from 'bignumber.js'
import React, { useCallback, useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import useSushi from '../../../hooks/useSushi'
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
import { getNewMineSingleContract } from '../../../sushi/utils'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useAllowanceGeneral from '../../../hooks/useAllowanceGeneral'
import useApproveGeneral from '../../../hooks/useApproveGeneral'
import useStakeNewMineSingle from '../../../hooks/useStakeNewMineSingle'
import useStakedBalanceByAccount from '../../../hooks/useStakedBalanceByAccount'
import useUnstakeNewMineSingle from '../../../hooks/useUnstakeNewMineSingle'
import { getBalanceNumber, getDisplayBalance } from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import { useTranslation } from 'react-i18next'

interface StakeProps {
  lpContract: Contract
  tokenName: string
  iconL: string
  iconR: string
}

const Stake: React.FC<StakeProps> = ({ lpContract, tokenName, iconL, iconR }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { account } = useWallet()
  const { t } = useTranslation()

  const sushi = useSushi()
  const newMineContract = getNewMineSingleContract(sushi)

  const allowance = useAllowanceGeneral(lpContract, newMineContract)
  const { onApprove } = useApproveGeneral(lpContract, newMineContract)

  const tokenBalance = useTokenBalance(lpContract.options.address)
  const stakedBalance = useStakedBalanceByAccount(newMineContract)

  const { onStake } = useStakeNewMineSingle(newMineContract)
  const { onUnstake } = useUnstakeNewMineSingle(newMineContract)

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={tokenName}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={tokenName}
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
              <StyledImg src={iconR}></StyledImg>
              <StyledImgR src={iconL}></StyledImgR>
            </StyledDiv>
            <Spacer height={20} />
            <Value value={getDisplayBalance(stakedBalance)} />
            <Label text={`${tokenName} ` + t('Tokens Staked')} />
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
                text={requestedApproval ? t('Approving...') : t('Approve') + ` ${tokenName}`}
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

const StyledImgR = styled.img `
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

export default Stake
