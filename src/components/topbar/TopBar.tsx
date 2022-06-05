import Branding from "../utils/Branding";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import WalletOptionsPopUp from "../dialogs/WalletOptions";
import AppContext from "../utils/AppContext";
import LogoutPop from "../dialogs/LogoutPop";

const TopBar = () => {

	const route = useRouter();
	const [clientLoaded, setClientLoaded] = useState(false);

	useEffect(() => {
		setClientLoaded(true);
	}, [])

	const { loggedIn, t_connected, t_handle, walletAddress } = useContext(AppContext);

	if (!clientLoaded) {
		return <></>
	}

	return (
		<nav className='flex items-center justify-between px-4 lg:px-0'>
			<button onClick={() => route.back()} className={`text-[#616162]  ${route.pathname === '/' ? 'opacity-0' : '' }  text-xs sm:text-sm text-left font-semibold w-[20%]`}>
				&larr; {route.pathname === '/' ? 'AGORA' : 'Back'}
			</button>
			<Branding />
			{loggedIn && 
			// <div className='cursor-default flex items-center justify-end gap-2 text-[#616162] text-sm font-semibold w-[20%]'>
			// 	<div className='hidden sm:flex items-center overflow-clip bg-gradient w-6 h-6 rounded-xl' >
			// 		<img className="w-6 h-6 object-cover rounded-xl object-center" src={`https://avatar.tobi.sh/${walletAddress}`} alt="" />
			// 	</div>
			// 	<div className="flex flex-col justify-center">
			// 		<p className='text-white text-[10px] sm:text-xs'>{shortAddress(walletAddress === "" ? '' : walletAddress)}</p>
			// 		{!t_connected && 
			// 			<Link href="/link" >
			// 			<a className="text-[10px] text-[#1DA1F2] font-semibold">Link Twitter</a>
			// 			</Link>
			// 		}
			// 		{t_connected && <p className="text-[10px] text-[#1DA1F2] font-semibold flex items-center gap-1"><Twitter_x10 /> {t_handle}</p>
			// 		}
			// 	</div>
			// </div>
			<LogoutPop />
			}

			{!loggedIn && <div className='cursor-default flex items-center justify-end gap-2 text-[#616162] text-sm font-semibold w-[20%]'>
				{/* <button onClick={handleConnectWallet} className='text-white font-bold sm:text-xs hover:text-gradient'>Connect Wallet</button> */}
				<WalletOptionsPopUp />
			</div>}
			{/* {!user.isLoggedIn && <div className='cursor-default flex sm:hidden items-center justify-end gap-2 text-[#616162] text-sm font-semibold w-[20%]'>
				<button onClick={handleConnectWallet} className='button-i'><Wallet1 size={20} /></button>
			</div>} */}
		</nav>
	);
}

export default TopBar;