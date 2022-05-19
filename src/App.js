import './App.css';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/Counter.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = abi.abi;

function App() {
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        console.log(`metamask is available`);
      } else {
        console.log(`please install metamask`);
      }

      const accounts = await ethereum.request({
        method: 'eth_accounts'
      });

      if (accounts.length !== 0) {
        console.log(`found account with address`, accounts[0]);
        setAccount(accounts[0]);
      } else {
        console.log(`no authorized account found`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected().then(() => {
      getCounts().then();
    });
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log(`please install metamask`);
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      console.log(accounts[0]);

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const hi = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const CounterContract = new ethers.Contract(contractAddress, contractABI, signer);

        setIsLoading(true);

        let tx = await CounterContract.add();
        await tx.wait();

        setIsLoading(false);

        await getCounts();
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const getCounts = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log(`ethereum object is not available`);
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const CounterContract = new ethers.Contract(contractAddress, contractABI, signer);

      const counts = await CounterContract.getCounts();
      setCount(counts.toNumber());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-full min-h-screen bg-blue-900 flex flex-col justify-center items-center">
      <h1 className="text-8xl font-bold text-white text-shadow text-center">Hello, Web3!</h1>

      {!account ?
        <button
          className="rounded-full py-6 px-12 text-3xl mt-16 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 transition"
          onClick={connectWallet}>Connect Wallet</button>
        :
        <>
          <h2 className="text-6xl text-center mt-24 text-yellow-300 font-bold">👋 {count}</h2>

          <h3 className="text-3xl text-center text-white text-hold mt-12">
            Logged in as {" "}
            <strong>{`${account.substring(0, 4)}...${account.substring(account.length - 4)}`}</strong>
          </h3>

          <button
            className="rounded-full py-6 px-12 text-3xl mt-16 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 transition"
            onClick={hi}>
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Say Hi"
            )
            }
          </button>
        </>
      }
    </div>
  );
}

export default App;
