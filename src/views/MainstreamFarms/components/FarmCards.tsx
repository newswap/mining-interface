import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import {newCoin} from '../../../sushi/lib/constants'
import LazyIcon from '../../../components/LazyIcon'

import { MainstreamFarm } from '../../../contexts/MainstreamFarms'
import useAllStakedValueForMainstream, {
  StakedValue,
} from '../../../hooks/useAllStakedValueForMainstream'
import useMainstreamFarms from '../../../hooks/useMainstreamFarms'
import useNewEarningsSingle from '../../../hooks/useNewEarningsSingle'
import useNewPrice from '../../../hooks/useNewPrice'
import useSushi from '../../../hooks/useSushi'
import { getDisplayBalance } from '../../../utils/formatBalance'
import { useTranslation } from 'react-i18next'
import Container from '../../../components/Container'
import {isMobile} from 'react-device-detect'

interface FarmWithStakedValue extends MainstreamFarm, StakedValue {
  reserveUSD: BigNumber,
  apy: BigNumber
}

const BLOCKS_PER_YEAR = new BigNumber(10512000)

const FarmCards: React.FC = () => {
  const [mainstreamFarms] = useMainstreamFarms()
  const stakedValue = useAllStakedValueForMainstream()
  const newPrice = useNewPrice()
  // console.log("FarmCards newPrice------->"+newPrice)
  const { t } = useTranslation()
  
  const rows = mainstreamFarms.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {
      const farmWithStakedValue = {
        ...farm,
        ...stakedValue[i],
        reserveUSD: stakedValue[i]
          ? newPrice
              .times(stakedValue[i].totalWethValue)
          : null,
        apy: stakedValue[i]
          ? BLOCKS_PER_YEAR
              .times(new BigNumber(farm.newPerBlock))
              .div(stakedValue[i].totalWethValue)
          : null,
      }
      const newFarmRows = [...farmRows]
      if (newFarmRows[newFarmRows.length - 1].length === 3) { //每3个一排
        newFarmRows.push([farmWithStakedValue])
      } else {
        newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
      }
      return newFarmRows
    },
    [[]],
  )

  return (
    <Container size = 'md'>
    <StyledCards>
      {!!rows[0].length ? (
        rows.map((farmRow, i) => (
          <StyledRow key={i}>
            {farmRow.map((farm, j) => (
              <React.Fragment key={j}>
                <FarmCard farm={farm} />
                {(j === 0 || j === 1) && <StyledSpacer />}
                {/* {(j == farmRow.length - 1) && <FarmEmptyCard/>} */}
              </React.Fragment>
            ))}
          </StyledRow>
        ))
      ) : (
        <></>
        // <StyledLoadingWrapper>
        //   <Loader text={t('Cooking the rice ...')} />
        // </StyledLoadingWrapper>
      )}
    </StyledCards>
    </Container>
  )
}

interface FarmCardProps {
  farm: FarmWithStakedValue
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const [startTime, setStartTime] = useState(0)
  const { t } = useTranslation()
  // const earnings = useNewEarningsSingle(farm.miningContract)
  // const { wethAmount, totalWethValue, reserveUSD  } = farm
  const sushi = useSushi()

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <span style={{ width: '100%' }}>
        {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    )
  }

  const poolActive = true // startTime * 1000 - Date.now() <= 0

  return (
    <StyledCardWrapper>
      {/* {farm.tokenSymbol === 'NST' && <StyledCardAccent />}  */}
      <Card>
        <StyledCardContent>
          <StyledContent>
            {farm ? (
              <>
              <StyledDiv>
              <LazyIcon address={farm.tokenAddress} customStyle={iconStyle}/>
              <StyledImg src={newCoin}></StyledImg>
            </StyledDiv>
            <StyledTitle>{farm.tokenSymbol + '-NEW'}</StyledTitle>
              {/* <StyledDetailPending> {t('Pending harvest')} {getDisplayBalance(earnings)} NEW</StyledDetailPending> */}
              <StyledDetails>
                <StyledDetail>{t('Deposit')} {farm.lpToken}</StyledDetail>
                <StyledDetail>{t('Earn')} {farm.earnToken.toUpperCase()}</StyledDetail>
              </StyledDetails>
            <Spacer />
            <Button
              size = 'new'
              variant = 'green'
              disabled={!poolActive}
              text={poolActive ? t('Select') : undefined}
              to={`/mainstreamMining/${farm.id}`}
            >
              {!poolActive && (
                <Countdown
                  date={new Date(startTime * 1000)}
                  renderer={renderer}
                />
              )}
            </Button>
            <StyledInsightDiv>
              <StyledInsight>
                <span>{t('Stake Value')}</span>
                <span>
                  {farm.reserveUSD
                    ? `$${farm.reserveUSD
                       .toNumber()
                       .toLocaleString('en-US')}`
                    : t('Loading ...')}
                </span>
              </StyledInsight>
              <StyledInsight>
                <span>{t('APY(Estimated)')}</span>
                <span>
                  {farm.apy
                   ? `${farm.apy
                       .times(new BigNumber(100))
                       .toNumber()
                       .toLocaleString('en-US')}%`
                    : t('Loading ...')}
                </span>
              {/* <span>
                {farm.tokenAmount
                  ? (farm.tokenAmount.toNumber() || 0).toLocaleString('en-US')
                  : '-'}{' '}
                {farm.tokenSymbol}
              </span>
              <span>
                {farm.wethAmount
                  ? (farm.wethAmount.toNumber() || 0).toLocaleString('en-US')
                  : '-'}{' '}
                NEW
              </span> */}
              </StyledInsight>
            </StyledInsightDiv>
              </>

            ) : (
              <div></div>
            )}
            
          </StyledContent>
        </StyledCardContent>
      </Card>
    </StyledCardWrapper>
  )
}

// const FarmEmptyCard: React.FC = ({  }) => {
//   return (
//     <StyledCardWrapper>
//       {/* {farm.tokenSymbol === 'NST' && <StyledCardAccent />}  */}
//       <Card>
//         <StyledCardContent>
//           <StyledContent>
//             <StyledSpan>
//               更多矿池敬请期待…
//             </StyledSpan>
//           </StyledContent>
//         </StyledCardContent>
//       </Card>
//     </StyledCardWrapper>
//   )
// }

const StyledSpan = isMobile ? styled.div `
    display: flex;
    flex: 1;
    flex-direction: column; 
    align-items: center;
    justify-content: center;
  ` : styled.div `
    display: flex;
    flex: 1;
    flex-direction: column; 
    align-items: center;
    justify-content: center;
    padding-top: calc(50%);
  `

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[3]}px;
  padding-left: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0px 5px 12px 0px rgba(7,94,68,0.11);

`

const RainbowLight = keyframes`

	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = isMobile ? 
  styled.div`
    display: flex;
    width: 100%;
    position: relative;
  ` :  styled.div`
    display: flex;
    width: calc((752px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
    position: relative;
  `

const StyledTitle = styled.h4`
  // color: ${(props) => props.theme.color.grey[600]};
  color: #20C5A0;
  font-size: 26px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  margin-top: 20px;
  text-align: center;
`

const StyledDetail = styled.div`
  color: #647684;
  text-align: center;
`
const StyledDetailPending = styled.div`
  color: #20C5A0;
  padding: 0px;
  margin-top: 0px;
  text-align: center;
  font-size:16px;
`

const StyledInsightDiv = styled.div`
  background: #F2F2F7;
  width: 100%;
  border-radius: 8px;
  padding: 0;
  margin-top: 10px;
`

const StyledInsight = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: #F2F2F7;
  color: #647684;
  width: 100%;
  line-height: 32px;
  font-size: 13px;
  text-align: center;
  padding: 0 12px;
`
const StyledDiv = styled.div`
  display: flex;
`


const StyledImg = styled.img `
    width: 60px;
    height: 60px;
    border-radius: 24px;
    margin-left: 4px;
`

const StyledImgR = styled.img `
    width: 60px;
    height: 60px;
    border-radius: 30px;
`

const iconStyle: React.CSSProperties = {
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  background: 'white',
}

export default FarmCards
