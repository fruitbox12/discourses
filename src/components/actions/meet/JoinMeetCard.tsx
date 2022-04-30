import { Clock, Verify } from "iconsax-react";
import { formatDate, getTimeFromDate, isFuture, isPast } from "../../../helper/TimeHelper";
import { ArrowGRightIcon, ArrowRightIcon, HappeningIconGreen } from "../../utils/SvgHub";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { GET_DISCOURSE_BY_ID, GET_TOKEN_BY_ID } from "../../../lib/queries";
import { useEffect, useState } from "react";
import { setMeet } from "../../../store/slices/meetSlice";
import { useRouter } from "next/router";
import { discouresEnded } from "../../../helper/DataHelper";
import DiscourseHub from '../../../web3/abi/DiscourseHub.json';
import Addresses from '../../../web3/addresses.json';
import Web3 from "web3";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ENTER_DISCOURSE } from "../../../lib/mutations";

const getDiscourseContract = async () => {
    return await new (window as any).web3.eth.Contract(
        DiscourseHub,
        Addresses.discourse_daimond
    )
}

const JoinMeetCard = ({ data }: { data: any }) => {
    const dispatch = useDispatch();
    const route = useRouter();

    const [loading, setLoading] = useState(false);

    var d = data.discourse
    const isMeetHappening = () => {
        if (d.room_id !== "" && !d.ended) {
            return true;
        }
        return false;
    }

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

    const user = useSelector((state: RootState) => state.user);
    const meet = useSelector((state: RootState) => state.meet);

    const [getMeetToken, { data: tokenData, loading: tLoading, error: tError }] = useLazyQuery(GET_TOKEN_BY_ID, {
        variables: {
            id: data.id
        },
        context: {
            headers: {
                authorization: `Bearer ${user.token}`
            }
        }
    })

    const [ refetch ] = useLazyQuery(GET_DISCOURSE_BY_ID, {
        variables: {
            id: data.id
        }
    })

    const [ enterMeet ] = useMutation(ENTER_DISCOURSE, {
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
            joinMeet();
        }
    })


    const speakerEntered = () => {
        if (data.discourse.confirmation[0] === user.walletAddress || data.discourse.confirmation[1] === user.walletAddress) {
            return true;
        }
        return false;
    }
    
    const userIsSpeaker = () => {
        if (data.speakers[0].address === user.walletAddress || data.speakers[1].address === user.walletAddress) {
            return true;
        }
        return false;
    }

    const handleJoinMeet = () => {
        setLoading(true);
        if (!userIsSpeaker()) {
            if (meet.token !== "" && !isPast(meet.timeStamp) && meet.propId === data.propID) {
                route.push("/live/"+data.id)
                setLoading(false);
            } else {
                getMeetToken();
            }
        } else {
            if (speakerEntered()) {
                joinMeet();
            } else {
                enterDiscourse();
            }
        }
    }

    const joinMeet = () => {
        if (!tLoading) {
            if (meet.token !== "" && !isPast(meet.timeStamp) && meet.propId === data.propID) {
                route.push("/live/"+data.id)
                setLoading(false);
            } else {
                getMeetToken();
            }
        }
    }

    const enterDiscourse = async () => {
        await loadWeb3();
        try {
            const tx = await (window as any).contract.methods.enterDiscourse(data.propId).send({ from : user.walletAddress });
            console.log(tx);

            enterMeet();
            
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }
    

    useEffect(() => {
        if(tokenData) {
            dispatch(setMeet({
                propId: data.propId,
                dId: data.id,
                token: tokenData.getMeetToken.token,
                timeStamp: tokenData.getMeetToken.eat
            }))
            setLoading(false);
            route.push("/live/"+data.id)
        }
    }, [tokenData])



    return (
        <>
            {isMeetHappening() && isPast(d.meet_date) &&
                <div className="bg-card rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <HappeningIconGreen />
                        <p className="text-gradient-g font-Lexend font-bold text-sm">Happening Now</p>
                    </div>
                    <p className="text-[#c6c6c6] text-[10px]">
                        Discourse started at <b>{formatDate(new Date(d.meet_date))}</b> • <b>{getTimeFromDate(new Date(d.meet_date))}</b>
                    </p>
                    {user.isLoggedIn && <button onClick={handleJoinMeet} className="button-s flex items-center gap-2 w-max bg-gradient-g">
                        <p className="text-gradient-g text-sm font-Lexend text-[#212427] font-medium">{loading ? 'wait..': "join"}</p>
                        { !loading && <ArrowRightIcon />}
                    </button>}
                    {
                        !user.isLoggedIn &&
                        <p className="text-yellow-200/70 text-[10px] font-medium bg-yellow-200/10 px-2 rounded-md mt-2 py-1">Connect your wallet to join the discourse.</p>
                    }
                </div>
            }

            {isFuture(d.meet_date) &&
                <div className="bg-card rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Clock size='18' color="#c6c6c6" />
                        <p className="text-[#c6c6c6] font-Lexend font-bold text-sm">Scheduled</p>
                    </div>
                    <p className="text-[#c6c6c6] text-[10px]">
                        Discourse scheduled on <b>{formatDate(new Date(d.meet_date))}</b> at <b>{getTimeFromDate(new Date(d.meet_date))}</b>
                    </p>
                </div>
            }

            {
                isPast(d.meet_date) && !isMeetHappening() && discouresEnded(data) &&
                <div className="bg-card rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Verify size='18' color="#ABECD6" />
                        <p className="text-[#ABECD6] font-Lexend text-sm">Happened</p>
                    </div>
                    <p className="text-[#c6c6c6] text-[10px]">
                        Discourse completed on <b>{formatDate(new Date(d.meet_date))}</b>
                    </p>
                </div>
            }
        </>
    );
}

export default JoinMeetCard;