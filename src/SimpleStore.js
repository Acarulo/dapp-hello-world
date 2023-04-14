import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "./abis/SimpleStore.json";

const SimpleStore = () => {

    // We make use of the following contract address.
    const contractAddr = "0x09B25343281aF0d47a3B597413EcCeD36C252750";

    // We create the state inside the SimpleStore js file.
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [contractValue, setContractValue] = useState(null);
  
    // Allows us to connect to the network provided by Metamask.
    const connectWalletHandler = async () => {
        if (window.ethereum) {
            let result = await window.ethereum.request({method: 'eth_requestAccounts'});
            accountChangeHandler(result[0]);
            setConnectButtonText("Wallet connected!");
        } else {
            setErrorMessage("Need to install Metamask!");
        }
    }

    // Handles the wallet address owned by the user.
    const accountChangeHandler = newAccount => {
        setDefaultAccount(newAccount);
        updateEthers();
    };

    // Updates the web3 environment information.
    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        let tempSigner = tempProvider.getSigner();
        let tempContract = new ethers.Contract(contractAddr, contractABI, tempSigner);;
        
        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
    };

    // Gets the current value from SimpleStorage.sol.
    const getCurrentValue = async () => {
        let value = await contract.get();
        setContractValue(value);
    };

    // Sets the current value from SimpleStorage.sol.
    const setHandler = (e) => {
        e.preventDefault();
        contract.set(e.target.setText.value);
    }

    return (
        <div>
            <h1>{"Get/set interaction with SimpleStorage contract"}</h1>
            <button onClick={connectWalletHandler}> {connectButtonText} </button>
            {defaultAccount !== null && <h3>Address: {defaultAccount}</h3>}

            <form onSubmit={setHandler}>
                <input id='setText' type='text'/>
                <button type="submit">Update contract</button>
            </form>

            <button onClick={getCurrentValue}>Get current value</button>
            {contractValue}
            {errorMessage}
        </div>
    )
}

export default SimpleStore;