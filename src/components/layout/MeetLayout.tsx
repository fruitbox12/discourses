import Branding from "../utils/Branding";
import { FooterIcon } from "../utils/SvgHub";

const MeetLayout = ({ children } : {children: any}) => {
    return (
        <div className="flex-col min-h-screen justify-center flex px-2 sm:px-10 bg-[#000000]">
            <div className="w-full top-0 mx-auto inset-x-0 fixed flex items-center justify-center py-10">
                        <Branding />
                    </div>
            <div className="w-full flex justify-center t-all">
                {/* <div className="w-full max-w-[10rem] h-screen">
                    <div>nav</div>
                </div> */}
                {children}
            </div>

            {/* <footer className="flex bottom-0 fixed mx-auto justify-center items-center gap-4 pt-10 pb-6">
                        <FooterIcon />
                        <div className=" h-full w-[2px] bg-[#212427]" />

                        <a className="text-xs text-[#797979] hover:text-[#c6c6c6] t-all" href="#">Terms & conditions</a>
                        <a className="text-xs text-[#797979] hover:text-[#c6c6c6] t-all" href="#">Privacy policy</a>
                        <a className="text-xs text-[#797979] hover:text-[#c6c6c6] t-all" href="#">Whitepaper</a>
                        <a className="text-xs text-[#797979] hover:text-[#c6c6c6] t-all" href="#">Discord</a>
                    </footer> */}
        </div>
    );
};

export default MeetLayout;