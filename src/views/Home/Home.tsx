import React, { useEffect, useMemo } from 'react'
import { useParams, Switch } from 'react-router-dom'
import styled from 'styled-components'
import chef from '../../assets/img/chef.png'
import coin from '../../assets/img/new.a6cfc11f.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import NewPageHeader from '../../components/NewPageHeader'
import Spacer from '../../components/Spacer'
import WalletProviderModal from '../../components/WalletProviderModal'
import { getNewNUSDTPairAddress } from '../../sushi/utils'
import useModal from '../../hooks/useModal'
import useSushi from '../../hooks/useSushi'
import { getContract } from '../../utils/erc20'
import Harvest from './components/Harvest'
import Stake from './components/Stake'
import { useTranslation } from 'react-i18next'
import newcoin from '../../assets/img/new.a6cfc11f.png'
import usdtcoin from '../../assets/img/usdtlogo.png'

const INFO_URL = process.env.REACT_APP_INFO_URL

const Home: React.FC = () => {
  const sushi = useSushi()
  const { ethereum } = useWallet()
  const { t } = useTranslation()
  const { account } = useWallet()

  const lpTokenAddress = getNewNUSDTPairAddress(sushi)
  const lpTokenName = 'NUSDT-NEW LP'
  const earnTokenName = 'NEW'
  const name = 'NUSDT Party!'
  const tokenSymbol = 'NUSDT'
  const iconL = usdtcoin
  const iconR = newcoin
  // const {
  //   pid,
  //   lpTokenAddress,
  //   tokenAddress,
  //   name,
  //   icon,
  //   iconL,
  //   iconR,
  //   tokenSymbol
  // } = {
  //   pid: 0,
  //   lpTokenAddress: {
  //     1007: '0x56aE975581a382193FF36579C81281E179486c43',
  //   },
  //   tokenAddresses: {
  //     1007: '0x20F12218281F9CA566B5c41F17c6c19050125cD3', //NUSDT
  //   },
  //   name: 'NUSDT Party!',
  //   symbol: 'NUSDT-NEW LP',
  //   tokenSymbol: 'NUSDT',
  //   icon: '👨🏻‍🍳',
  //   iconL: usdtcoin,
  //   iconR: newcoin
  // }


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)
  return (

    <Switch>
      <Page>
        {!!account ? (
          <>
            <NewPageHeader
              iconL={iconL}
              iconR={iconR}
              subtitle= {t('homeHeaderSubtitle', {tokenSymbol: tokenSymbol, new: 'NEW', token: 'NEW'})+ '(' + t('releaseTip') + ')'} 
              title={tokenSymbol + '- NEW ' + t('Farm')}
            />
            <StyledFarm>
              <StyledCardsWrapper>
                <StyledCardWrapper>
                  <Harvest icon={iconR}/>
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <Stake
                    lpContract={lpContract}
                    tokenName={lpTokenName}
                    iconL={iconL}
                    iconR={iconR}
                  />
                </StyledCardWrapper>
              </StyledCardsWrapper>
              <Spacer size="lg" />
              <StyledLink
                target="__blank"
                href={INFO_URL + `/pair/${lpTokenAddress}`}
              >
                {lpTokenName} {t('Info')}
              </StyledLink>
              <Spacer size="lg" />

            </StyledFarm>
          </>
        ) : (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={onPresentWalletProviderModal}
              size = 'new'
              variant = 'green'
              text={t('Unlock Wallet')}
            />
          </div>
        )}
      </Page>
    </Switch>
  )
}

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
  box-shadow: 0px 5px 12px 0px rgba(7,94,68,0.11);
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

const StyledLink = styled.a`
  color: #607686;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`
const StyledTableDiv = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0px 5px 12px 0px rgba(7,94,68,0.11);
  padding-top: 10px;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 10px
`

const StyleLabel = styled.div`
  color: #607686;
  font-size: 20px;
`

export default Home
