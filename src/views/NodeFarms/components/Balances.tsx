import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'

import useAllStakedValueForCommunity from '../../../hooks/useAllStakedValueForCommunity'
import useAllEarningsNew from '../../../hooks/useAllEarningsNew'
import useNewPrice from '../../../hooks/useNewPrice'
import useNewBalance from '../../../hooks/useNewBalance'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { useTranslation } from 'react-i18next'

const NEW_PER_BLOCK: number = parseInt(process.env.REACT_APP_NEW_PER_BLOCK_NODE ?? '1')
const BLOCKS_PER_YEAR = new BigNumber(10512000)
const CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1012')

// const PendingRewards: React.FC = () => {
//   const [start, setStart] = useState(0)
//   const [end, setEnd] = useState(0)
//   const [scale, setScale] = useState(1)

  // const allEarnings = useAllEarningsNew()
  // let sumEarning = 0
  // for (let earning of allEarnings) {
  //   sumEarning += new BigNumber(earning)
  //     .div(new BigNumber(10).pow(18))
  //     .toNumber()
  // }

//   useEffect(() => {
//     setStart(end)
//     setEnd(sumEarning)
//   }, [sumEarning])

//   return (
//     <span
//       style={{
//         transform: `scale(${scale})`,
//         transformOrigin: 'right bottom',
//         transition: 'transform 0.5s',
//         display: 'inline-block',
//       }}
//     >
//       <CountUp
//         start={start}
//         end={end}
//         decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
//         duration={1}
//         onStart={() => {
//           setScale(1.25)
//           setTimeout(() => setScale(1), 600)
//         }}
//         separator=","
//       />
//     </span>
//   )
// }

const Balances: React.FC = () => {
  const { account, balance } = useWallet()
  const { t } = useTranslation()

  const allEarnings = useAllEarningsNew()
  let sumEarning = 0
  for (let earning of allEarnings) {
    sumEarning += new BigNumber(earning)
      .div(new BigNumber(10).pow(18))
      .toNumber()
  }

  const stakedValue = useAllStakedValueForCommunity()
  const newPrice = useNewPrice()
  // console.log("newPrice------->"+newPrice)

  // useWallet()中的balance在手机上无效，获取NEW用下面的方法
  const newBalance = useNewBalance()
  // console.log("===================>"+newBalance)

  let totalNew = 0
  for (let staked of stakedValue) {
    totalNew += staked.totalWethValue ? staked.totalWethValue.toNumber() : 0

    // console.log('========================')
    // console.log(staked.tokenAmount.toNumber())
    // console.log(staked.wethAmount.toNumber())
    // console.log(staked.totalWethValue.toNumber())
    // console.log(staked.tokenPriceInWeth.toNumber())
  }

  //第四期结束时间 2021/06/13 12:00
  const endTime = 1623556800000  
  
  return (
    <StyledWrapper>
      { CHAIN_ID===1007 || new Date().getTime() < endTime ? (
          <Card>
            <CardContent>
              <Label text={t('APY(Estimated)')} />
              <Value
                value={totalNew > 0
                      ? `${BLOCKS_PER_YEAR.times(new BigNumber(NEW_PER_BLOCK)).div(totalNew)
                          .times(new BigNumber(100))
                          .toNumber()
                          .toLocaleString('en-US')}%`
                        : t('Loading ...')}
              />
            </CardContent>
            <Footnote>
              {t('Total Stake Value')}
              <FootnoteValue>
                {
                  totalNew > 0 
                    ? `$${newPrice.times(totalNew)
                    .toNumber()
                    .toLocaleString('en-US')}` 
                    : t('Loading ...')
                }
              </FootnoteValue>
            </Footnote>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <StyledCloseDiv>
                {t('unMingClose', {Number:5} )}
              </StyledCloseDiv>
            </CardContent>
            <Footnote>
              {t('unMingCloseTips', {Number:4} )}
            </Footnote>
          </Card>
        )
      }
      <Spacer />
      <Card>
        <CardContent>
          <StyledBalances>
            <StyledBalance>
              {/* <SushiIcon /> */}
              {/* <Spacer /> */}
              <div style={{ flex: 1 }}>
                <Label text={t('NEW Earned')} />
                <Value
                  value={!!account ? sumEarning : '—'}
                />
              </div>
            </StyledBalance>
          </StyledBalances>
        </CardContent>
        <Footnote>
          {t('Your NEW Balance')}
          <FootnoteValue>
            {!!account ? getBalanceNumber(newBalance).toFixed(3) : '—'}            
            {/* <PendingRewards /> NEW */}
          </FootnoteValue>
        </Footnote>
      </Card>
    </StyledWrapper>
  )
}

const StyledCloseDiv = styled.div`
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-top: 5px;
  padding-bottom: 15px;
  @media (max-width: 768px) {
    width: 99%;
    font-size: 24px;
  }
  color: #20C5A0;
  font-size: 29px;
  font-weight: 700;
`

const Footnote = styled.div`
  font-size: 16px;
  padding: 20px 30px;
  font-family: 'PingFang SC Medium', sans-serif;
  // color: ${(props) => props.theme.color.grey[400]};
  color: #607686;
  // border-top: solid 1px ${(props) => props.theme.color.grey[300]};
`
const FootnoteValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  float: right;
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledBalances = styled.div`
  display: flex;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`

export default Balances
