import LoadingSpinner from "../utils/LoadingSpinner";
import { SpeakerConfirmationIcon } from "../utils/SvgHub";
import { useState } from "react";
import { formatDate, getTime, getTimeFromDate } from "../../helper/TimeHelper";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useMutation, useLazyQuery } from "@apollo/client";
import { SET_WALLETADDRESS, SPEAKER_CONFIRMATION } from "../../lib/mutations";
import { GET_DISCOURSE_BY_ID } from "../../lib/queries";
import DiscourseHub from '../../web3/abi/DiscourseHub.json';
import Addresses from '../../web3/addresses.json';
import Web3 from "web3";
import { ethers } from "ethers";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { contractData } from "../../helper/ContractHelper";


const getDiscourseContract = async () => {
    return await new (window as any).web3.eth.Contract(
        DiscourseHub,
        Addresses.discourse_daimond
    )
}

const SpeakerConfirmationCard = ({ data }: { data: any }) => {

    const [loading, setLoading] = useState(false);

    const user = useSelector((state: RootState) => state.user);

    const getSpeakerIndex = (speakers: any) => {
        if (speakers.length >= 2) {
            if (speakers[0].username === user.t_handle) {
                return 0;
            }
            if (speakers[1].username === user.t_handle) {
                return 1;
            }
        }
        return -1;
    }

    const getSpeaker = (speakers: any) => {
        const index = getSpeakerIndex(speakers);
        if (index !== -1) {
            return speakers[index];
        }
        return null;
    }

    const speakerAddressSet = (speakers: any) => {
        if (speakers.length >= 2) {
            const speaker = speakers.find((s: any) => s.username === user.t_handle);
            if (speaker.address === user.walletAddress) {
                return true;
            }
        }
        return false;
    }

    ///////////////////////////////
    ///////  Logics  //////////////
    ///////////////////////////////

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

    const [ refetch ] = useLazyQuery(GET_DISCOURSE_BY_ID, {
        variables: {
            id: data.id
        }
    });

    const [ setWalletAddress ] = useMutation(SET_WALLETADDRESS, {
        context: {
            headers: {
                authorization: `Bearer ${user.token}`
            }
        }
    })

    const [ speakerConfirmation ] = useMutation(SPEAKER_CONFIRMATION, {
        context: {
            headers: {
                authorization: `Bearer ${user.token}`
            }
        }
    })

    const confirmSpeaker = useContractWrite(
        contractData(),
        'speakerConfirmation',
        {
            args: [data.propId],
            overrides: { from: user.walletAddress },
            onSettled: (txn) => {
                console.log('submitted:', txn);
            },
            onError: (error) => {
                setLoading(false);
            }
        }
    )

    const waitForTxn = useWaitForTransaction(
        {
            hash: confirmSpeaker.data?.hash,
            onSettled: (txn) => {
                console.log('settled:', txn);
                if (txn) {
                    speakerConfirmation({
                        variables: {
                            propId: data.propId,
                        },
                        onCompleted: () => {
                            setLoading(false);
                            refetch();
                        },
                        onError: (error) => {
                            setLoading(false);
                            console.log('Something went wrong', error);
                        }
                    })
                }
            }
        }
    )

    const handleConfirmation = async () => {
        confirmSpeaker.write();
    }

    const handleClick = async () => {
        setLoading(true);
        if (speakerAddressSet(data.speakers)) {
            handleConfirmation();
        } else {
            setWalletAddress({
                variables: {
                    propId: data.propId
                },
                onCompleted: (data) => {
                    handleConfirmation();
                },
                onError: (error) => {
                    console.log('Something went wrong', error);
                    setLoading(false);
                }
            })
        }
    }


    return (
        <div className="bg-gradient rounded-xl p-4 flex flex-col">
            <div className="flex items-center gap-2">
                <SpeakerConfirmationIcon />
                <p className="text-[#212221] font-Lexend font-semibold text-sm">Speaker Confirmation</p>
            </div>
            <p className="text-[#212221] font-medium text-[10px] mt-2">
                You need to confirm your participation before <span className="font-semibold underline">{formatDate(getTime(data.endTS))} • {getTimeFromDate(getTime(data.endTS))}</span>
            </p>
            <div className="flex items-center justify-between">

                {!loading && <button onClick={handleClick} className="button-s w-max mt-2">
                    <p className="text-[10px] text-gradient font-bold">Confirm</p>
                </button>}

                {loading && <button disabled className="button-s-d w-max mt-2">
                    <p className="text-[10px] text-gradient font-bold">Please wait..</p>
                </button>}

                {loading && <LoadingSpinner strokeColor="#212221" />}
            </div>
        </div>
    );
}

export default SpeakerConfirmationCard;