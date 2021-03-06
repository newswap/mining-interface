import React, { useCallback, useEffect, useState, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'
import DisclaimerModal from './components/DisclaimerModal'
import MobileMenu from './components/MobileMenu'
import TopBar from './components/TopBar'
import FarmsProvider from './contexts/Farms'
import NodeFarmsProvider from './contexts/NodeFarms'
import MainstreamFarmsProvider from './contexts/MainstreamFarms'
import CustomFarmsProvider from './contexts/CustomFarms'
import ModalsProvider from './contexts/Modals'
import TransactionProvider from './contexts/Transactions'
import SushiProvider from './contexts/SushiProvider'
import useModal from './hooks/useModal'
import theme from './theme'
import Farms from './views/Farms'
import NodeFarms from './views/NodeFarms'
import MainstreamFarms from './views/MainstreamFarms'
import Home from './views/Home'
import NST from './views/NST'
import NSP from './views/NSP'
import CommunityFarm from './views/CommunityFarm'
import TradeFarm from './views/TradeFarm'
import CustomFarms from './views/CustomFarms'
import CustomCreateFarm from './views/CustomCreateFarm'

const CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1012')
const NEWCHAIN_RPC = process.env.REACT_APP_NEWCHAIN_RPC


const App: React.FC = () => {
  // const { t } = useTranslation()
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false)
  }, [setMobileMenu])

  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true)
  }, [setMobileMenu])

  return (
    <Providers>
      <Suspense fallback={null}>
        <Router>
          <TopBar onPresentMobileMenu={handlePresentMobileMenu} />
          <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
          
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/nusdtMining">
              <Home />
            </Route>
            <Route path="/communityMining">
              <NodeFarms />
            </Route>
            <Route path="/tradeMining">
              <TradeFarm />
            </Route>
            <Route path="/mainstreamMining">
              <MainstreamFarms />
            </Route>
            <Route path="/customLPMining">
              <CustomFarms stakeTokenType='lpToken' />
            </Route>
            <Route path="/customSingleMining">
              <CustomFarms stakeTokenType='singleToken' />
            </Route>
            <Route path="/customCreateLPMining">
              <CustomCreateFarm stakeTokenType='lpToken'/>
            </Route>
            <Route path="/customCreateSingleMining">
              <CustomCreateFarm stakeTokenType='singleToken'/>
            </Route>

            {/* 
            <Route path="/nstFarms">
              <Farms />
            </Route>
            <Route path="/nst">
              <NST />
            </Route>
            <Route path="/nsp">
              <NSP />
            </Route>
            <Route path="/CommunityFarm">
              <CommunityFarm />
            </Route> */}
          </Switch>
        </Router>
        {/* <Disclaimer /> */}
      </Suspense>
    </Providers>
  )
}

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider
        chainId={CHAIN_ID}
        connectors={{
          walletconnect: { rpcUrl: NEWCHAIN_RPC },
        }}
      >
        <SushiProvider>
          <TransactionProvider>
            <FarmsProvider>
              <MainstreamFarmsProvider>
                <NodeFarmsProvider>
                  <CustomFarmsProvider>
                    <ModalsProvider>{children}</ModalsProvider>
                  </CustomFarmsProvider>
                </NodeFarmsProvider>
              </MainstreamFarmsProvider>
            </FarmsProvider>
          </TransactionProvider>
        </SushiProvider>
      </UseWalletProvider>
    </ThemeProvider>
  )
}

const Disclaimer: React.FC = () => {
  const markSeen = useCallback(() => {
    localStorage.setItem('disclaimer', 'seen')
  }, [])

  const [onPresentDisclaimerModal] = useModal(
    <DisclaimerModal onConfirm={markSeen} />,
  )

  useEffect(() => {
    const seenDisclaimer = false //localStorage.getItem('disclaimer')
    if (!seenDisclaimer) {
      onPresentDisclaimerModal()
    }
  }, [])

  return <div />
}

export default App
