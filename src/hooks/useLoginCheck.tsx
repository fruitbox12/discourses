import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { CHECK_TOKEN } from '../lib/queries'
import { REFRESH_TOKEN, VERIFY_SIG } from '../lib/mutations'
import { setUser, updateToken } from '../store/slices/userSlice'
import { ethers } from "ethers";

const useLoginCheck = (windows?: any) => {

    const dispatch = useDispatch();

    const [ win, setWin ] = useState(windows);
    const [walletAddress, setWalletAddress] = useState('');

	const user = useSelector((state: RootState) => state.user);
	const [ openConnectWallet, setOpenConnectWallet ] = useState(false);
	
	const [checkToken, { error: checkTokenError }] = useLazyQuery(CHECK_TOKEN, {
		context: {
			headers: {
				authorization: `Bearer ${user.token}`
			}
		}
	});	
    

	useEffect(() => {
		if (checkTokenError) {
			dispatch(setUser({
				token: '',
				username: '',
				walletAddress: '',
				expiresAt: '',
				isLoggedIn: false,
                tConnected: false,
                t_handle: "",
                t_name: "",
                t_id: "",
                t_img: ""
			}));
			setWalletAddress('');
		}
	}, [checkTokenError, dispatch])

    useEffect(() => {
        const loginCheck = async () => {
            if (!win.ethereum) {
                console.log("Please install MetaMask to use this application.");
                return;
            }
            try {
                console.log("win.eth ✅");
                
                const provider = new ethers.providers.Web3Provider(win.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    console.log("accounts ✅");
                    setWalletAddress(accounts[0]);
                    checkToken();
                    
                } else {
                    dispatch(setUser({
                        token: '',
                        username: '',
                        walletAddress: '',
                        expiresAt: '',
                        isLoggedIn: false,
                        tConnected: false,
                        t_handle: "",
                        t_name: "",
                        t_id: "",
                        t_img: ""
                    }));
                    setWalletAddress('');
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        if (win.ethereum) {
            loginCheck();
        }

    }, [checkToken, win]);

    

    const initWin = (win: any) => {
        setWin(win);
    }

    return { initWin } as const;
}

export default useLoginCheck;