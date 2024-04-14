import Header from "./ui/Header";
import SwapContainer from "./ui/SwapContaier";
import { WalletProvider } from "./WalletContext";

export default function Home() {
  return (
    <main className="">
      <WalletProvider>
        <Header />
        <SwapContainer />
      </WalletProvider>
    </main>
  );
}
