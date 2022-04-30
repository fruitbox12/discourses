import { MessageRemove, MoneySend } from "iconsax-react";
import { useSelector } from "react-redux";
import { getFundClaimDate, hasWithdrawn, isPledger } from "../../helper/DataHelper";
import { RootState } from "../../store";
import { FUND_WITHDRAWN } from "../../lib/mutations";
import { useMutation, useLazyQuery } from "@apollo/client";
import DiscourseHub from '../../web3/abi/DiscourseHub.json';
import Addresses from '../../web3/addresses.json';
import Web3 from "web3";
import { useEffect, useState } from "react";
import { GET_DISCOURSE_BY_ID } from "../../lib/queries";
import { formatDate, isPast } from "../../helper/TimeHelper";

const getDiscourseContract = async () => {
    return await new (window as any).web3.eth.Contract(
        DiscourseHub,
        Addresses.discourse_daimond
    )
}

const FundClaimCardC = ({data}: {data: any}) => {

    const [ loading, setLoading ] = useState(false);

    const user = useSelector((state: RootState) => state.user);

    const [ fundWithdrawn ] = useMutation(FUND_WITHDRAWN, {
        variables: {
            propId: data.propId
        },
        context: {
            headers: {
                authorization: `Bearer ${user.token}`
            }
        },
        onCompleted: () => {
            refetch();
        }
    })

    const [ refetch ] = useLazyQuery(GET_DISCOURSE_BY_ID, {
        variables: {
            id: data.id
        }, onCompleted: (data) => {
            setLoading(false);
        }
    })

    const loadWeb3 = async () => {
        const win = window as any;
        if (win.ethereum) {
            win.web3 = new Web3(win.ethereum);
            await win.ethereum.enable();
            (window as any).contract = await getDiscourseContract();
        } else {
            // Show metamask error
        }
    }

    const handleClaim = async () => {
        setLoading(true);
        await loadWeb3();

        try {

            if (user.walletAddress === data.prop_starter) {

                var tx = await (window as any).contract.methods.proposerWithdraw(data.propId)
                    .send({ from: user.walletAddress });
                console.log(tx);
                fundWithdrawn();
            } else {
                var tx = await (window as any).contract.methods.speakerWithdraw(data.propId)
                    .send({ from: user.walletAddress });
                console.log(tx);
                fundWithdrawn();
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }

    return (
        <div className="bg-card rounded-xl p-4 flex flex-col">
            <div className="flex items-center gap-2">
                <MoneySend size='16' color='#ABECD6' />
                <p className="text-[#ABECD6] font-Lexend text-sm">Claim funds</p>
            </div>
            { isPast(getFundClaimDate(data).toISOString()) ? 
            <p className="text-[#c6c6c6] text-[10px] mt-2">
                Fund can be claimed now.
            </p> 
            :
            <p className="text-[#c6c6c6] text-[10px] mt-2">
                You can claim funds after <b>
                    {formatDate(getFundClaimDate(data))}
                    </b> 
            </p>
            }
            {
                !user.isLoggedIn && 
                <p className="text-yellow-200/70 text-[10px] font-medium bg-yellow-200/10 px-2 rounded-md mt-2 py-1">Connect your wallet to withdraw your fund.</p>
            }
            {
                isPast(getFundClaimDate(data).toISOString()) && !hasWithdrawn(data, user.walletAddress) &&
                <>
                { !loading && <button onClick={handleClaim} className="button-s text-[#c6c6c6] font-Lexend text-sm mt-2">
                    Claim Funds
                </button>}
                { loading && <button disabled className="button-s-d text-[#797979] font-Lexend text-sm mt-2">
                    wait..
                </button>}
                </>
            }

        </div>
    );
}

export default FundClaimCardC;