import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_USERDATA, GET_NONCE } from '../lib/queries'
import { VERIFY_SIG } from '../lib/mutations'
import { setUser, updateTwitter } from '../store/slices/userSlice'
import { ethers } from "ethers";

const useWallet = (window : any) => {
    const dispatch = useDispatch();

    const [ win, setWin ] = useState(window);
    const user = useSelector((state: RootState) => state.user);
    const [walletAddress, setWalletAddress] = useState('');
    const [connectingWallet, setConnectingWallet] = useState(false);

    const [getNonce, { data: nonceData, loading: nonceLoading, error: nonceError }] = useLazyQuery(GET_NONCE);
    const [getAccountData, { data: accountData, loading: accountLoading, error: accountError }] = useLazyQuery(GET_USERDATA,{
		fetchPolicy: 'network-only',
		context: {
			headers: {
				authorization: `Bearer ${user.token}`
			}
		},
		onCompleted: (data) => {
			if (data && data.getUserData) {

				dispatch(
					updateTwitter({
						tConnected: data.getUserData.twitterConnected ? true : false,
						t_handle: data.getUserData.twitter.twitter_handle ? data.getUserData.twitter.twitter_handle : "",
						t_name: data.getUserData.twitter.twitter_name ? data.getUserData.twitter.twitter_name : "",
						t_id: data.getUserData.twitter.twitter_id ? data.getUserData.twitter.twitter_id : "",
						t_img: data.getUserData.twitter.image_url ? data.getUserData.twitter.image_url : "",
					})
					)
			}
		}
	});
    const [verifySig, { data, loading: sigLoading, error: sigError }] = useMutation(VERIFY_SIG, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            console.log(data);

            setConnectingWallet(false);
            dispatch(setUser({
                token: data.verifySignature.token,
                username: data.verifySignature.username,
                walletAddress: data.verifySignature.address,
                expiresAt: new Date(new Date().getTime() + 1).toISOString(),
                isLoggedIn: true,
				tConnected: false,
				t_handle: "",
				t_name: "",
				t_id: "",
				t_img: ""
            }));
        }
    });

    useEffect(() => {
        if (nonceData) {
            console.log("nonceData", nonceData);

            signAndVerify(nonceData.getNonce.nonce);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nonceData])

    useEffect(() => {
        if (user.isLoggedIn) {
            getAccountData({
                context: {
                    headers: {
                        authorization: `Bearer ${user.token}`
                    }
                }
            });
        }
    }, [getAccountData, user]);

    const signAndVerify = async (nonce: string) => {
		const sigData = await signNonce(nonce)
			.catch(err => {
				console.log(err);
				return;
			});


		if (sigData?.signature) {
			console.log("pass");

			verifySig({
				variables: {
					signature: sigData.signature,
					walletAddress: sigData.address
				}
			});
		}
	}

    const signNonce = async (nonce: string) => {
		try {
			if (win.ethereum === 'undefined') {
				return;
			}

			await win.ethereum.request({ method: "eth_requestAccounts" });
			const provider = new ethers.providers.Web3Provider(win.ethereum);
			const signer = provider.getSigner();
			const signature = await signer.signMessage(nonce)
				.catch(err => {
					alert("Error occured!");
					return;
				})
			const address = await signer.getAddress();
			return {
				signature,
				address
			}
		} catch (error) {
			console.log(error);
			setConnectingWallet(false);
		}
	}

    const connectWallet = async () => {
		setConnectingWallet(true);

		try {
			if (win.ethereum === 'undefined') {
                console.log("win.ethereum === 'undefined'");
                
				alert("Please install MetaMask to use this application.")
				return;
			}

            console.log(win.ethereum);
            

			await win.ethereum.request({ method: 'eth_requestAccounts' });
			const provider = new ethers.providers.Web3Provider(win.ethereum);
			const signer = provider.getSigner();
			const address = await signer.getAddress();
			setWalletAddress(address);
			getNonce({ variables: { address: address } });

		} catch (error) {
			console.log(error);
			setConnectingWallet(false);
		}
	}


    return [walletAddress, connectingWallet, connectWallet, setWin] as const;
}

export default useWallet;