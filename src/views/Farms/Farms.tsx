import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { useWallet } from 'use-wallet'

import chef from '../../assets/img/chef.png'
import Container from '../../components/Container'

import Button from '../../components/Button'
import Page from '../../components/Page'
import Spacer from '../../components/Spacer'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import Farm from '../Farm'
import Balances from './components/Balances'

import FarmCards from './components/FarmCards'
import { useTranslation } from 'react-i18next'

const Farms: React.FC = () => {
  const { t } = useTranslation()

  const { path } = useRouteMatch()
  const { account } = useWallet()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)
  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader
                icon={<img src={chef} height="120" />}
                // subtitle="Earn SUSHI tokens by staking SushiSwap V2 SLP Tokens. Note: Current APY does not include 2/3rd SUSHI emission that is locked and will be retroactively disbursed at a later date."
                subtitle={t('Earn NST tokens by staking NewSwap LP Tokens.')}
                title={t('Select Your Favorite Dishes')}
              />
              <Container>
                <Balances />
              </Container>
              <Spacer size="lg" />
              <FarmCards />
            </Route>
            <Route path={`${path}/:farmId`}>
              <Farm />
            </Route>
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
              text={`🔓 ` + t('Unlock Wallet')}
            />
          </div>
        )}
      </Page>
    </Switch>
  )
}

export default Farms
