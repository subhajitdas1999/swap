import { WalletProvider } from "./provider/WalletProvider";
import Header from "./ui/Header";
import SwapContainer from "./ui/SwapContainer";

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
