import { MessageRemove } from "iconsax-react";
import { useSelector } from "react-redux";
import { hasWithdrawn, isPledger } from "../../helper/DataHelper";
import { RootState } from "../../store";
import { TERMINATE_PROPOSAL, FUND_WITHDRAWN } from "../../lib/mutations";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_DISCOURSE_BY_ID } from "../../lib/queries";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { contractData } from "../../helper/ContractHelper";

const FundClaimCardT = ({ data }: { data: any }) => {

    const [loading, setLoading] = useState(false);
    const [needTermination, setNeedTermination] = useState(false);

    const user = useSelector((state: RootState) => state.user);

    const [terminateProposal] = useMutation(TERMINATE_PROPOSAL, {
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

    const [fundWithdrawn] = useMutation(FUND_WITHDRAWN, {
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

    const [refetch] = useLazyQuery(GET_DISCOURSE_BY_ID, {
        variables: {
            id: data.id
        }, onCompleted: (data) => {
            setLoading(false);
        }
    })

    const withdrawP = useContractWrite(
        contractData(),
        'withdrawPledge',
        {
            args: [data.propId],
            overrides: { from: user.walletAddress },
            onSettled: (txn) => {
                console.log('submitted:', txn);
            },
            onError: (error) => {
                setLoading(false);
                console.log(error);
            }
        }
    )

    const waitForWithdrawl = useWaitForTransaction({
        hash: withdrawP.data?.hash,
        onSettled: (txn) => {
            fundWithdrawn();
        }
    })

    useEffect(() => {
        if (data.status.terminated && needTermination) {
            withdrawP.write();
        }
    }, [data, needTermination, withdrawP])

    const handleClaim = async () => {
        setLoading(true);
        if (!data.status.terminated) {
            console.log("not terminated");
            setNeedTermination(true);
            terminateProposal();
        } else {
            console.log("terminated");
            withdrawP.write();
        }
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
                    {!loading && <button onClick={handleClaim} className="button-s text-[#c6c6c6] font-Lexend text-sm mt-2">
                        Claim Funds
                    </button>}
                    {loading && <button disabled className="button-s-d text-[#797979] font-Lexend text-sm mt-2">
                        wait..
                    </button>}
                </>
            }

        </div>
    );
}

export default FundClaimCardT;