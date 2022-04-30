import { MessageRemove } from "iconsax-react";
import { useSelector } from "react-redux";
import { hasWithdrawn, isPledger } from "../../helper/DataHelper";
import { RootState } from "../../store";
import { TERMINATE_PROPOSAL, FUND_WITHDRAWN } from "../../lib/mutations";
import { useMutation, useLazyQuery } from "@apollo/client";
import DiscourseHub from '../../web3/abi/DiscourseHub.json';
import Addresses from '../../web3/addresses.json';
import Web3 from "web3";
import { useEffect, useState } from "react";
import { GET_DISCOURSE_BY_ID } from "../../lib/queries";

const getDiscourseContract = async () => {
    return await new (window as any).web3.eth.Contract(
        DiscourseHub,
        Addresses.discourse_daimond
    )
}

const FundClaimCardT = ({ data }: { data: any }) => {

    const [ loading, setLoading ] = useState(false);
    const [ needTermination, setNeedTermination ] = useState(false);

    const user = useSelector((state: RootState) => state.user);

    const [ terminateProposal ] = useMutation(TERMINATE_PROPOSAL, {
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
        },
        onError: (error) => {
            console.log(error);
            setLoading(false);
        }
    });

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

    
    useEffect(() => {
        if(data.status.terminated && needTermination) {
            callClaim();
        }
    }, [data, needTermination])

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
        if (!data.status.terminated) {
            console.log("not terminated");
            setNeedTermination(true);
            terminateProposal();
        } else {
            console.log("terminated");
            callClaim();
        }
    }

    const callClaim = async () => {
        await loadWeb3();

        // if (data.prop_starter === user.walletAddress) {
        //     try {
        //         const tx = await (window as any).contract.methods.proposerWithdraw(data.propId).send({ from: user.walletAddress });
        //         console.log(tx);
        //         fundWithdrawn();
                
        //     } catch (error) {
        //         console.log(error);
        //         setLoading(false);
        //     }
        // } else {
            try {
                const tx = await (window as any).contract.methods.withdrawPledge(data.propId).send({ from: user.walletAddress });
                console.log(tx);
                fundWithdrawn();
                
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        // }
    }

    return (
        <div className="bg-card rounded-xl p-4 flex flex-col">
            <div className="flex items-center gap-2">
                <MessageRemove size='16' color='#fc8181' />
                <p className="text-[#fc8181] font-Lexend text-sm">Discourse Terminated</p>
            </div>
            <p className="text-[#c6c6c6] text-[10px] mt-2">
                Speakers didn&apos;t confirmed
            </p>
            {
                !user.isLoggedIn && 
                <p className="text-yellow-200/70 text-[10px] font-medium bg-yellow-200/10 px-2 rounded-md mt-2 py-1">Connect your wallet to withdraw your fund.</p>
            }
            {
                user.isLoggedIn && isPledger(data, user.walletAddress) && !hasWithdrawn(data, user.walletAddress) &&
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

export default FundClaimCardT;