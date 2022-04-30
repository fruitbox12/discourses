import { Warning2 } from "iconsax-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setShowBetaMsg } from "../../store/slices/uiSlice";
const Layout = ({ children }: { children: any }) => {

    const dispatch = useDispatch();
    const ui = useSelector((state: any) => state.ui);

    const handleClose = () => {
        dispatch(setShowBetaMsg(
            false
        ));
    }

    return (
        <div className="flex-col min-h-screen flex items-center relative justify-center bg-[#000000]">
            <div className="w-full max-w-4xl flex">
                {/* <div className="w-full max-w-[10rem] h-screen">
                    <div>nav</div>
                </div> */}
                {children}
            </div>
            { ui.showBetaMsg &&
            <div className="fixed bg-card p-4 bottom-6 right-6 gap-2 rounded-xl z-40 max-w-sm flex flex-row">
                <div className="flex flex-col items-center justify-between">
                    <Warning2 size='24' color="#6c6c6c" />

                </div>
                <div className="flex flex-col ">
                    <p className="text-white font-Lexend text-sm">Still in development</p>
                    <p className="text-[#c6c6c6] font-Lexend text-[10px] flex w-full justify-between gap-2 items-center">Might be buggy <span onClick={handleClose} className="cursor-pointer font-regular text-red-400 text-[10px] mt-1">close</span>  </p>
                </div>

            </div>}
        </div>
    );
};

export default Layout;