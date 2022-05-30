import { ethers } from "ethers";
import { Link1, Warning2 } from "iconsax-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setShowBetaMsg, setWrongChain } from "../../store/slices/uiSlice";
import Branding from "../utils/Branding";
import { WrongChainIcon } from "../utils/SvgHub";
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
                if (network.chainId !== 80001) {
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
                    if (newNetwork.chainId !== 80001) {
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
        try {
            var wind = window as any;
            const provider = new ethers.providers.Web3Provider(wind.ethereum, "any");
            provider.send("wallet_switchEthereumChain",
            [{ chainId: '0x13881' }]);
        } catch (error) {
            console.log(error);
            addChain();
        }
        
    }

    const addChain = () => {
        var wind = window as any;
        const provider = new ethers.providers.Web3Provider(wind.ethereum, "any");
        provider.send("wallet_addEthereumChain",
        [{ chainId: '0x13881' }]);
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
                    <WrongChainIcon />
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
                            <p className="text-[#c6c6c6] font-Lexend text-[10px] max-w-[25ch] w-full gap-2 items-center">This app is only available on <b>Polygon Mumbai</b></p>
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