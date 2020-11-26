import BigNumber from 'bignumber.js'
import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import useTokenBalance from '../../../hooks/useTokenBalance'
import {getBalanceNumber} from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import {contractAddresses} from '../../../sushi/lib/constants'
import useEnterXNSP from "../../../hooks/useEnterXNSP";
import useAllowanceNSP from "../../../hooks/useAllowanceNSP";
import useApproveNSP from "../../../hooks/useApproveNSP";
import { useTranslation } from 'react-i18next'

interface StakeProps {
}

const CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1');

const StakeNSP: React.FC<StakeProps> = ({}) => {
  const tokenName = "NSP"
  const [requestedApproval, setRequestedApproval] = useState(false)
  const allowance = useAllowanceNSP()
  const {onApprove} = useApproveNSP()
  const { t } = useTranslation()

  const tokenBalance = useTokenBalance(contractAddresses.nsp[CHAIN_ID])

  const {onEnter} = useEnterXNSP()

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onEnter}
      tokenName={tokenName}
    />,
  )

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
            <CardIcon>👨🏻‍🍳</CardIcon>
            <Value value={getBalanceNumber(tokenBalance)}/>
            <Label text={t('NSP Tokens Available')}/>
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
                text={t('Approve NSP')}
              />
            ) : (
              <>
                <Button
                  disabled={tokenBalance.eq(new BigNumber(0))}
                  text={t('Convert to xNSP')}
                  onClick={onPresentDeposit}
                />
                <StyledActionSpacer/>
              </>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

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

export default StakeNSP