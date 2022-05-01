import Head from "next/head";
import {
    useHMSActions, useHMSStore, selectIsConnectedToRoom,
    selectIsLocalAudioEnabled,
    selectCameraStreamByPeerID,
    selectRoomState,
    selectIsLocalVideoEnabled,
    selectPeers,
    HMSRoomState,
    useHMSNotifications,
    HMSNotificationTypes,
} from '@100mslive/react-sdk';
import { useEffect, useRef, useState } from "react";
import MeetLayout from "../../components/layout/MeetLayout";
import Meet from "../../components/actions/meet/Meet";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { is24hrOld } from "../../helper/TimeHelper";
import TokenErrorCard from "../../components/actions/meet/TokenErrorCard";
import { GET_DISCOURSES, GET_DISCOURSE_BY_ID } from "../../lib/queries";
import { isSpeakerWallet } from "../../helper/DataHelper";
import { Microphone2, MicrophoneSlash, Video, VideoSlash } from "iconsax-react";
import { shortAddress } from "../../helper/StringHelper";
import { CalendarDoneIcon } from "../../components/utils/SvgHub";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { clearMeet } from "../../store/slices/meetSlice";
import { END_MEET } from "../../lib/mutations";

const LivePage = () => {

    const route = useRouter();
    const dispatch = useDispatch();

    const { propId } = route.query;
    // console.log(propId);

    const hmsActions = useHMSActions();
    const [username, setUsername] = useState('');
    const [meetEnded, setMeetEnded] = useState(false);
    const [ meetingJoined, setMeetingJoined ] = useState(false);
    const [ discourseLocked, setDiscourseLocked ] = useState(false);
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
    const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);
    const meet = useSelector((state: RootState) => state.meet);
    const user = useSelector((state: RootState) => state.user);
    // const [token, setToken] = useState('');
    const [tokenError, setTokenError] = useState(false);
    const [ getDiscourses ] = useLazyQuery(GET_DISCOURSES);
    const [getDiscourse, { data: dData, loading: dLoading, error: dError }] = useLazyQuery(GET_DISCOURSE_BY_ID, {
        variables: {
            id: propId
        }
    });

    const notification = useHMSNotifications();

    useEffect(() => {
        if (!notification) {
            return;
        }

        if (notification.type === HMSNotificationTypes.ERROR) {

            console.log('new message', notification.data);
            if (notification.data.message === "room is not active") {
                setDiscourseLocked(true);
            }
        }

    }, [notification])


    useEffect(() => {
        if (meet.token == "" || !user.isLoggedIn) {
            setTokenError(true);
        } else {
            if (is24hrOld(new Date(meet.timeStamp))) {
                setTokenError(true);
            }
        }
    }, [meet])

    useEffect(() => {
        if (propId !== "") {
            getDiscourse();
        }
    }, [getDiscourse, propId])

    useEffect(() => {
        console.log(isConnected ? 'connected' : 'not connected');
    }, [isConnected]);


    const joinRoom = async () => {
        if (user.isLoggedIn && meet.token !== "") {
            const config = {
                userName: user.walletAddress,
                authToken: meet.token
            }

            try {
                hmsActions.join(config);
            } catch (e) {
                console.log("error joining room", e);
                
            }

        }
    }
    const peers = useHMSStore(selectPeers);
    const roomState = useHMSStore(selectRoomState);
    

    useEffect(() => {
        if (meet.token !== "" && dData && isSpeakerWallet(dData, user.walletAddress) && !meetEnded) {
            const config = {
                userName: user.walletAddress,
                authToken: meet.token,
                settings: {
                    isAudioMuted: true,
                    isVideoMuted: false
                }
            }
            try {

                hmsActions.preview(config);
            } catch (error) {
                console.log(error);
            }
        }

    }, [user.walletAddress, meet.token, dData])

    useEffect(() => {
        return () => {
            hmsActions.setLocalAudioEnabled(false);
            hmsActions.setLocalVideoEnabled(false);
            hmsActions.leave();
        }
    }, [])



    useEffect(() => {
        console.log(peers);
    }, [peers])

    useEffect(() => {
        if (roomState === HMSRoomState.Connected) {
            setMeetingJoined(true);
        }
        if (roomState === HMSRoomState.Disconnecting || roomState === HMSRoomState.Disconnected) {
            if (meetingJoined) {
                dispatch(clearMeet());
                setMeetEnded(true);
                getDiscourse();
                getDiscourses();
            }
        }
    }, [roomState])

    const getLocalPeer = () => {
        return peers.find((peer: any) => peer.isLocal === true);
    }

    const toggleVideo = async () => {
        await hmsActions.setLocalVideoEnabled(!videoEnabled);
    }
    const toggleAudio = async () => {
        await hmsActions.setLocalAudioEnabled(!audioEnabled);
    }


    return (
        <div className="w-full h-screen ">
            <Head>
                <title>Discourses by AGORA SQUARE</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/discourse_logo_fav.svg" />
            </Head>

            <MeetLayout>
                <div className='w-32 h-32 bg-gradient rounded-full blur-3xl fixed top-24 right-72 z-0 t-all' />

                {
                    meetEnded && <div className=' justify-center overflow-hidden w-full max-w-6xl flex gap-4 z-10 t-all'>
                        <div className="bg-card p-4 w-full max-w-sm rounded-xl flex flex-col items-center gap-2">
                            <CalendarDoneIcon />
                            <p className="text-white font-Lexend text-sm">Thanks for joining!</p>
                            <Link href={`/`}>
                                <a href="" className="text-gradient font-Lexend text-sm">&larr; back</a>
                            </Link>
                        </div>
                    </div>
                }

                {!meetEnded && <div className=' xl:aspect-video lg:max-h-[70vh] justify-center overflow-hidden w-full max-w-6xl flex gap-4 z-10 t-all'>
                    {/* error */}
                    {
                        (tokenError || !dData) &&
                        <TokenErrorCard />
                    }
                    {/* Preview */}
                    {!isConnected && !tokenError && dData &&
                        <div className="flex flex-col gap-4 mt-10 grow mx-20">

                            <div className="relative bg-card max-w-md mx-auto w-full flex flex-col items-center p-8 rounded-2xl">
                                {/* <img className="absolute right-2 h-[80%] bottom-0 z-0" src="/link_bg.svg" alt="" /> */}
                                <h3 className="text-white/70 text-center font-Lexend">Join Discourse</h3>
                                {/* { !isSpeakerWallet(dData, user.walletAddress) && <div className="flex flex-col p-4 my-2 rounded-xl z-10 w-max border border-[#212427]">
                                    <p className="font-Lexend text-[#c6c6c6] font-semibold">{dData.getDiscourseById.title}</p>
                                    <div className='flex items-center gap-1 mt-2'>
                                        
                                        <div className='flex items-center w-16 h-8 relative'>
                                            <div className='flex items-center w-8 h-8 rounded-xl ring-[3px] ring-[#141515] overflow-clip'>
                                                
                                                <img className="scale-105 w-8 h-8 object-cover object-center" src={`https://avatar.tobi.sh/${dData.getDiscourseById.speakers[0].name}`} alt="" />
                                            </div>
                                            <div className='flex items-center absolute left-[35%] w-8 h-8 rounded-xl ring-[3px] ring-[#141515] overflow-clip'>
                                                <img className="scale-105 w-8 h-8 object-cover object-center" src={`https://avatar.tobi.sh/${dData.getDiscourseById.speakers[1].name}`} alt="" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <a href="#" className='hover:text-white/60 text-[#c6c6c6] font-Lexend text-xs uppercase tracking-wide font-medium'>{dData.getDiscourseById.speakers[0].name}</a>
                                            <a href="#" className='hover:text-white/60 text-[#c6c6c6] font-Lexend text-xs uppercase tracking-wide font-medium'>{dData.getDiscourseById.speakers[1].name}</a>
                                        </div>
                                    </div>
                                </div> 
                                } */}

                                {/* Speaker */}
                                {
                                    getLocalPeer()?.roleName === "speaker" &&

                                    <div className="flex flex-col items-center gap-2 py-4">

                                        <div className="w-[60%] aspect-square relative rounded-xl overflow-clip">
                                            {!getLocalPeer() || !videoEnabled && <img className="w-[600px] h-[600px] object-cover object-center" src={`https://avatar.tobi.sh/${user.walletAddress}`} alt="" />}
                                            {getLocalPeer() && videoEnabled && <VideoTile peer={getLocalPeer()} />}
                                            <div className="z-10 absolute bg-[#141515] inset-x-2 p-2 bottom-2 rounded-xl flex items-center justify-between">

                                                <p className="text-white text-[10px] hidden sm:block sm:text-sm font-Lexend ">{shortAddress(user.walletAddress)}</p>

                                                <div className="flex items-center justify-center gap-2">
                                                    {getLocalPeer()?.roleName === "speaker" &&
                                                        <button onClick={() => toggleVideo()} className={`text-sm ${videoEnabled ? 'button-i-f' : 'button-i-f-e bg-[#fc8181]'}`}>
                                                            {!videoEnabled && <VideoSlash size='20' color="#000000" />}
                                                            {videoEnabled && <Video size='20' color="#c6c6c6" />}
                                                        </button>
                                                    }
                                                    {getLocalPeer()?.roleName === "speaker" &&
                                                        <button onClick={() => toggleAudio()} className={`text-sm ${audioEnabled ? 'button-i-f' : 'button-i-f-e bg-[#fc8181]'}`}>
                                                            {!audioEnabled && <MicrophoneSlash size='20' color="#000000" />}
                                                            {audioEnabled && <Microphone2 size='20' color="#c6c6c6" />}
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                }

                                {
                                    !getLocalPeer() && <>
                                    
                                {   !discourseLocked && <div className="flex flex-col items-center gap-2 py-4">

                                        <div className="w-10 h-10 aspect-square rounded-xl overflow-clip">
                                            <img className="w-full h-full object-cover object-center" src={`https://avatar.tobi.sh/${user.walletAddress}`} alt="" />
                                        </div>
                                        <p className="text-white text-sm font-Lexend ">{shortAddress(user.walletAddress)}</p>

                                    </div>}
                                {   discourseLocked && <div className="flex flex-col items-center gap-2 py-4">

                                        <p className="text-white text-sm font-Lexend ">This discourse has ended.</p>

                                    </div>}
                                    

                                    </>
                                }

                                {/* Public */}
                                {roomState !== "Connecting" && !discourseLocked && <button onClick={joinRoom} className="z-10 button-s text-sm font-Lexend">Enter</button>}
                                {roomState === "Connecting" && !discourseLocked && <button className="z-10 cursor-not-allowed button-s-d text-sm font-Lexend">wait..</button>}
                            </div>

                            <div className="w-full bg-card max-w-md mx-auto rounded-xl p-4 flex-col flex gap-2">
                                <p className="text-sm font-Lexend text-white">{dData.getDiscourseById.title}</p>
                                <p className="text-xs font-Lexend text-[#797979]">id: {dData.getDiscourseById.id}</p>
                            </div>
                        </div>
                    }
                    {/* Live */}
                    {
                        isConnected && !tokenError && dData &&
                        <Meet dData={dData.getDiscourseById} />
                    }
                </div>}

            </MeetLayout>

        </div>
    );
}


const VideoTile = ({ peer }: { peer: any }) => {
    const videoRef = useRef(null);
    const hmsActions = useHMSActions();
    const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));

    // console.log(peer);

    useEffect(() => {
        if (videoRef.current && videoTrack) {
            if (videoTrack.enabled) {
                hmsActions.attachVideo(videoTrack.id, videoRef.current);
            } else {
                hmsActions.detachVideo(videoTrack.id, videoRef.current);
            }
        }
    }, [videoTrack, hmsActions])


    return (
        <video className="rounded-xl w-full h-full object-cover" ref={videoRef} autoPlay muted playsInline ></video>
    )
}


export default LivePage;

