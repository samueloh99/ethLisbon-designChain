import "../styles/globals.css";
import type { AppProps } from "next/app";

import {
  RainbowKitProvider,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
// import { LensConfig, development } from "@lens-protocol/react-web";
// import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
// import { LensProvider } from "@lens-protocol/react-web";

import { UserAuthenticationProvider } from "../../src/context/UserAuthenticationContext";

const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Ethereum PCD",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

// const lensConfig: LensConfig = {
//   bindings: wagmiBindings(),
//   environment: development,
// };
export default function App({ Component, pageProps }: AppProps) {
  return (
    // <LensProvider config={lensConfig}>
    <UserAuthenticationProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </UserAuthenticationProvider>
    // </LensProvider>
  );
}
