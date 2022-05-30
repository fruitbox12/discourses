import { MessageRemove, MoneySend } from "iconsax-react";
import { useSelector } from "react-redux";
import { getFundClaimDate, hasWithdrawn, isPledger } from "../../helper/DataHelper";
import { RootState } from "../../store";
import { FUND_WITHDRAWN } from "../../lib/mutations";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_DISCOURSE_BY_ID } from "../../lib/queries";
import { formatDate, isPast } from "../../helper/TimeHelper";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { contractData } from "../../helper/ContractHelper";


const FundClaimCardC = ({ data }: { data: any }) => {

    const [loading, setLoading] = useState(false);

    const user = useSelector((state: RootState) => state.user);

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


    const withdrawPro = useContractWrite(
        contractData(),
        'proposerWithdraw',
        {
            args: [data.propId],
            overrides: {
                from: user.walletAddress
            },
            onSettled: (txn) => {
                console.log('submitted', txn);
            },
            onError: (error) => {
                setLoading(false);
            }
        }
    )

    const withdrawSpeaker = useContractWrite(
        contractData(),
        'speakerWithdraw',
        {
            args: [data.propId],
            overrides: {
                from: user.walletAddress
            },
            onSettled: (txn) => {
                console.log('submitted', txn);
            },
            onError: (error) => {
                setLoading(false);
            }
        }
    )

    const waitForTx1 = useWaitForTransaction({
        hash: withdrawPro.data?.hash,
        onSettled: (txn) => {
            console.log('settled', txn);
            fundWithdrawn();
        }
    })

    const waitForTx2 = useWaitForTransaction({
        hash: withdrawSpeaker.data?.hash,
        onSettled: (txn) => {
            console.log('settled', txn);
            fundWithdrawn();
        }
    })

    const handleClaim = async () => {
        setLoading(true);
        if (user.walletAddress === data.prop_starter) {
            withdrawPro.write();
        } else {
            withdrawSpeaker.write();
        }
    }

    return (
        <div className="bg-card rounded-xl p-4 flex flex-col">
            <div className="flex items-center gap-2">
                <MoneySend size='16' color='#ABECD6' />
                <p className="text-[#ABECD6] font-Lexend text-sm">Claim funds</p>
            </div>
            {isPast(getFundClaimDate(data).toISOString()) ?
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

export default FundClaimCardC;