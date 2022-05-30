import '../styles/globals.css'
import type { AppProps } from 'next/app'
import store from '../store'
import { persistor } from '../store'
import { Provider as RProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apollo'

import { SessionProvider } from 'next-auth/react'

import { HMSRoomProvider } from '@100mslive/react-sdk';

//wagmi
import { providers } from 'ethers';
import { chain, createClient, WagmiConfig } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';
import SEOHome from '../components/utils/SEOHome'

const connectors = () => {
  return [
    new WalletConnectConnector({
      options: {
        chainId: chain.polygonMumbai.id,
        rpc: { 80001: "https://polygon-mumbai.g.alchemy.com/v2/ksqleRX25aRSLQ9uawfAwVTlQ8gKLULj" }
      }
    }),
    new MetaMaskConnector({
      chains: [chain.polygonMumbai],
      options: {
        shimDisconnect: true
      }
    }),
    new InjectedConnector({
      chains: [chain.polygonMumbai],
    })
  ]
}

const wagmiClient = createClient({
  autoConnect: true,
  provider(config) {
    return new providers.AlchemyProvider(config.chainId, 'ksqleRX25aRSLQ9uawfAwVTlQ8gKLULj');
  },
  connectors
})

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState)
  return (
    <RProvider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        {() => (
            <WagmiConfig client={wagmiClient}>
              <ApolloProvider client={apolloClient}>
                <SessionProvider session={session}>
                  <HMSRoomProvider>
                    <SEOHome />
                    <Component {...pageProps} />
                  </HMSRoomProvider>
                </SessionProvider>
              </ApolloProvider>
            </WagmiConfig>
          )}
      </PersistGate>
    </RProvider>
  )
}

export default MyApp
