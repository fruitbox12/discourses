import { Wallet1 } from "iconsax-react";
import { shortAddress } from "../../helper/StringHelper";
import Branding from "../utils/Branding";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_USERDATA, GET_NONCE } from '../../lib/queries'
import { VERIFY_SIG } from '../../lib/mutations'
import { setUser, updateTwitter } from '../../store/slices/userSlice'
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { Twitter_x10 } from "../utils/SvgHub";
import useLoginCheck from "../../hooks/useLoginCheck";
import Link from "next/link";

const TopBar = () => {

	const dispatch = useDispatch();
	const route = useRouter();

	const user = useSelector((state: RootState) => state.user);
	const [walletAddress, setWalletAddress] = useState('');
	const [connectingWallet, setConnectingWallet] = useState(false);

	const { initWin } = useLoginCheck(window as any);

	const [getNonce, { data: nonceData, loading: nonceLoading, error: nonceError }] = useLazyQuery(GET_NONCE);
	const [getAccountData, { data: accountData, loading: accountLoading, error: accountError }] = useLazyQuery(GET_USERDATA, {
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

			if (data) {
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
		},
		onError: (error) => {
			console.log(error);
		}
	});

	useEffect(() => {
		if (window && (window as any).ethereum) {
			initWin(window as any);
		}
	},[])

	useEffect(() => {
		if (nonceData && !user.isLoggedIn) {
			console.log("nonceData", nonceData);
			signAndVerify(nonceData.getNonce.nonce);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nonceData])

	useEffect(() => {
		if (user.isLoggedIn) {
			getAccountData();
		}
	}, [getAccountData, user]);

	useEffect(() => {
		if (data) {
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
	}, [data])


	const signAndVerify = async (nonce: string) => {
		const sigData = await signNonce(nonce)
			.catch(err => {
				console.log(err);
				return;
			});


		if (sigData?.signature && !user.isLoggedIn) {

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
			const win = window as any;
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


	const handleConnectWallet = async () => {
		setConnectingWallet(true);

		try {
			const win = window as any;
			if (win.ethereum === 'undefined') {
				alert("Please install MetaMask to use this application.")
				return;
			}

			await win.ethereum.request({ method: 'eth_requestAccounts' });
			const provider = new ethers.providers.Web3Provider(win.ethereum);
			const signer = provider.getSigner();
			const address = await signer.getAddress();
			setWalletAddress(address);
			if (!user.isLoggedIn) {
				getNonce({ variables: { address: address } });
			}

		} catch (error) {
			console.log(error);
			setConnectingWallet(false);
		}
	}

	return (
		<nav className='flex items-center justify-between px-4 lg:px-0'>
			<button onClick={() => route.back()} className='text-[#616162] text-xs sm:text-sm text-left font-semibold w-[20%]'>
				&larr; {route.pathname === '/' ? 'AGORA' : 'Back'}
			</button>
			<Branding />
			{user.isLoggedIn && 
			<div className='cursor-default flex items-center justify-end gap-2 text-[#616162] text-sm font-semibold w-[20%]'>
				<div className='hidden sm:flex items-center overflow-clip bg-gradient w-6 h-6 rounded-xl' >
					<img className="w-6 h-6 object-cover object-center" src={`https://avatar.tobi.sh/${user.walletAddress}`} alt="" />
				</div>
				<div className="flex flex-col justify-center">
					<p className='text-white text-[10px] sm:text-xs'>{shortAddress(user.walletAddress === "" ? walletAddress : user.walletAddress)}</p>
					{
						!user.tConnected && 
						<Link href="/link" >
						<a className="text-[10px] text-[#1DA1F2] font-semibold">Link Twitter</a>
						</Link>
					}
					{
						accountData && user.tConnected && <p className="text-[10px] text-[#1DA1F2] font-semibold flex items-center gap-1"><Twitter_x10 /> {accountData.getUserData.twitter.twitter_handle}</p>
					}
				</div>
			</div>}

			{!user.isLoggedIn && <div className='cursor-default hidden sm:flex items-center justify-end gap-2 text-[#616162] text-sm font-semibold w-[20%]'>
				<Wallet1 size={20} />
				<button onClick={handleConnectWallet} className='text-white font-bold sm:text-xs hover:text-gradient'>Connect Wallet</button>
			</div>}
			{!user.isLoggedIn && <div className='cursor-default flex sm:hidden items-center justify-end gap-2 text-[#616162] text-sm font-semibold w-[20%]'>
				<button onClick={handleConnectWallet} className='button-i'><Wallet1 size={20} /></button>
			</div>}
		</nav>
	);
}

export default TopBar;