import { ethers } from "ethers";
import { Link1, Warning2 } from "iconsax-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setShowBetaMsg, setWrongChain } from "../../store/slices/uiSlice";
import Branding from "../utils/Branding";
const Layout = ({ children }: { children: any }) => {

    const dispatch = useDispatch();
    const ui = useSelector((state: any) => state.ui);

    const handleClose = () => {
        dispatch(setShowBetaMsg(
            false
        ));
    }

    useEffect(() => {
        let win = window as any;

        const checkChain = async () => {
            if (win.ethereum) {
                const provider = new ethers.providers.Web3Provider(win.ethereum);
                const network = await provider.getNetwork();
                if (network.chainId !== 4) {
                    dispatch(
                        setWrongChain(true)
                    );
                }
            }
        }

        if (win.ethereum) {
            try {
                checkChain();
                const provider = new ethers.providers.Web3Provider(win.ethereum, "any");
                provider.on("network", (newNetwork:any, oldNetwork:any) => {
                    if (newNetwork.chainId !== 4) {
                        dispatch(
                            setWrongChain(true)
                        );
                    } else {
                        dispatch(
                            setWrongChain(false)
                        );
                    }
                    
                })

            } catch (error) {
                console.log(error);
            }
        }
    }, [])

    const switchNetwork = () => {
        var wind = window as any;
        const provider = new ethers.providers.Web3Provider(wind.ethereum, "any");
        provider.send("wallet_switchEthereumChain",
        [{ chainId: '0x4' }]);
    }

    const handleSwitchNetwork = () => {
        if ((window as any).ethereum) {
            switchNetwork();
        }
    }

    return (
        <div className="flex-col min-h-screen flex items-center relative justify-center bg-[#000000]">
            { !ui.wrongChain && <div className="w-full max-w-4xl flex">
                {children}
            </div>}

            {
                ui.wrongChain && <div className="w-full max-w-4xl flex flex-col items-center justify-center">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6.75V11.85C22 13.12 21.58 14.19 20.83 14.93C20.09 15.68 19.02 16.1 17.75 16.1V17.91C17.75 18.59 16.99 19 16.43 18.62L15.46 17.98C15.55 17.67 15.59 17.33 15.59 16.97V12.9C15.59 10.86 14.23 9.5 12.19 9.5H5.4C5.26 9.5 5.13 9.51 5 9.52V6.75C5 4.2 6.7 2.5 9.25 2.5H17.75C20.3 2.5 22 4.2 22 6.75Z" stroke="url(#paint0_linear_524_2144)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.59 12.9V16.97C15.59 17.33 15.55 17.67 15.46 17.98C15.09 19.45 13.87 20.37 12.19 20.37H9.47L6.45 22.38C6.34876 22.4493 6.23046 22.4895 6.10796 22.4963C5.98547 22.503 5.86346 22.4761 5.75521 22.4184C5.64695 22.3606 5.5566 22.2743 5.49398 22.1688C5.43135 22.0633 5.39885 21.9427 5.4 21.82V20.37C4.38 20.37 3.53 20.03 2.94 19.44C2.34 18.84 2 17.99 2 16.97V12.9C2 11 3.18 9.69 5 9.52C5.13 9.51 5.26 9.5 5.4 9.5H12.19C14.23 9.5 15.59 10.86 15.59 12.9V12.9Z" stroke="url(#paint1_linear_524_2144)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                    <linearGradient id="paint0_linear_524_2144" x1="5" y1="6.35549" x2="22.7242" y2="9.04466" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#84B9D1" />
                        <stop offset="1" stopColor="#D2B4FC" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_524_2144" x1="2" y1="12.5808" x2="16.1687" y2="14.7314" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#84B9D1" />
                        <stop offset="1" stopColor="#D2B4FC" />
                    </linearGradient>
                </defs>
            </svg>
                    <p className="font-Lexend text-[#c6c6c6] mt-6">Wrong Chain detected!</p>
                    <p className="font-Lexend text-[#797979] text-sm">Please switch to the correct chain</p>
                    <span onClick={handleSwitchNetwork} className="cursor-pointer font-regular text-blue-400 text-[10px] mt-1 font-medium">Click to change</span>
                </div>
            }
            <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-40">
                {
                    ui.wrongChain &&
                    <div className=" bg-card p-4 gap-2 rounded-xl z-40 max-w-sm flex flex-row">
                        <div className="flex flex-col items-center justify-between">
                            <Link1 size="24"
                                color="#fc8181"
                                variant="Broken" />
                        </div>
                        <div className="flex flex-col ">
                            <p className="text-[#fc8181] font-Lexend text-sm">Wrong Chain</p>
                            <p className="text-[#c6c6c6] font-Lexend text-[10px] max-w-[25ch] w-full gap-2 items-center">This app is only available on <b>Rinkeby Test Net</b></p>
                            <span onClick={handleSwitchNetwork} className="cursor-pointer font-regular text-blue-400 text-[10px] mt-1 font-medium">Click to change</span>
                        </div>
                    </div>
                }
                {ui.showBetaMsg &&
                    <div className=" bg-card p-4 gap-2 rounded-xl  max-w-sm flex flex-row">
                        <div className="flex flex-col items-center justify-between">
                            <Warning2 size='24' color="#6c6c6c" />
                        </div>
                        <div className="flex flex-col ">
                            <p className="text-white font-Lexend text-sm">Still in development</p>
                            <p className="text-[#c6c6c6] font-Lexend text-[10px] flex w-full justify-between gap-2 items-center">Might be buggy <span onClick={handleClose} className="cursor-pointer font-regular text-red-400 text-[10px] mt-1">close</span>  </p>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
};

export default Layout;