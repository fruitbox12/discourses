import '../styles/globals.css'
import type { AppProps } from 'next/app'
import store from '../store'
import { persistor } from '../store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apollo'

import { SessionProvider } from 'next-auth/react'

import { HMSRoomProvider } from '@100mslive/react-sdk';

function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState)
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <ApolloProvider client={apolloClient}>
          <SessionProvider session={session}>
            <HMSRoomProvider>
              <Component {...pageProps} />
            </HMSRoomProvider>
          </SessionProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  )
}

export default MyApp
