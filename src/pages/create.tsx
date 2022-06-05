import Layout from "../components/layout/Layout";
import Branding from "../components/utils/Branding";
import Head from 'next/head'
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { PercentageSquare, Timer, Timer1 } from "iconsax-react";
import { Listbox } from '@headlessui/react'
import { useRouter } from "next/router";
import TopBar from "../components/topbar/TopBar";
import FundDiscourseDialog from "../components/dialogs/FundDiscourseDialog";
import { CloseIcon, Polygon16 } from "../components/utils/SvgHub";
import CreateDiscourseDialog from "../components/dialogs/CreateDiscourseDailog";
import { CreateObj, ToastTypes } from "../lib/Types";
import AppContext from "../components/utils/AppContext";
import { uuid } from "uuidv4";
import ChainTag from "../components/utils/ChainTag";
import { useNetwork } from "wagmi";
import BDecoration from "../components/utils/BDecoration";


const timeDuration = [
    { id: 1, sec: 1209600, value: "14 Days", title: "14 Days ~ (1209600s)", unavailable: false },
    { id: 2, sec: 2592000, value: "1 Month", title: "1 Month ~ (2592000s)", unavailable: false },
    { id: 3, sec: 7776000, value: "3 Months", title: "3 Months ~ (7776000s)", unavailable: false },
    { id: 4, sec: 10386000, value: "6 Months", title: "6 Months ~ (10386000s)", unavailable: false },
    { id: 5, sec: 31536000, value: "1 Year", title: "1 Year ~ (31536000s)", unavailable: false },
    { id: 6, sec: 3600, value: "1 Hour", title: "1 Hour ~ (3600s)", unavailable: false },
    { id: 7, sec: 7200, value: "2 Hours", title: "2 Hours ~ (7200s)", unavailable: false },
    { id: 8, sec: 1800, value: "1/2 Hour", title: "1/2 Hour ~ (1800s)", unavailable: false },
]

let mockD: CreateObj = {
    speakers: [
        {
            name: "",
            username: "",
            confirmed: false,
            isTwitterHandle: true,
            address: "0x00",
        },
        {
            name: "",
            username: "",
            confirmed: false,
            isTwitterHandle: true,
            address: "0x00"
        }
    ],
    propId: 0,
    description: "",
    title: "",
    prop_description: "",
    prop_starter: "0x00",
    charityPercent: 0,
    initTS: "",
    endTS: "",
    topics: [],
    initialFunding: "0.01",
    fundingPeriod: 0
}

const CreateDiscoursePage = () => {

    const route = useRouter();

    const [selectedDuration, setSelectedDuration] = useState(timeDuration[0])
    const [topicCount, setTopicCount] = useState(3)
    const [openFundDialog, setOpenFundDialog] = useState(false);
    const [formError, setFormError] = useState("");
    const [newDiscourse, setNewDiscourse] = useState<CreateObj>(mockD);
    const { addToast, loggedIn } = useContext(AppContext);
    const [notified, setNotified] = useState(false);
    const { activeChain } = useNetwork();

    useEffect(() => {
        if (!loggedIn) {
            route.push("/");
        }
    },[loggedIn, route])

    const handleSubmit = () => {
        if (speakerOne.length > 0 && speakerTwo.length > 0 && title.length > 0 && description.length > 0 && checkTopics(topics)) {
            setNewDiscourse(getData());
            setOpenFundDialog(true)
        } else {
            setFormError("Please fill all the details")
        }
    }

    useEffect(() => {
        var timerTask = setTimeout(() => {
            setFormError("")
        }, 6000);
        if (formError === "") {
            clearTimeout(timerTask)
        }
    }, [formError]);

    const checkTopics = (topics: Array<string>) => {
        if (topics.length === 0) {
            return false
        } else if (topics.length === topicCount) {
            if (topics.every(topic => topic.length > 0)) {
                return true
            }
            return false
        } else {
            return false
        }
    }

    const handleTopicChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const newTopics: Array<string> = [...topics]
        newTopics[index] = e.target.value
        setTopics(newTopics)
    }


    // Form values states
    const [speakerOne, setSpeakerOne] = useState("");
    const [speakerTwo, setSpeakerTwo] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [charityPercent, setCharityPercent] = useState("");
    const [fundingPeriod, setFundingPeriod] = useState(selectedDuration.sec);
    const [topics, setTopics] = useState<Array<string>>([]);

    const handleTopicAdd = () => {
        if (checkTopics(topics)) {
            setTopicCount(prev => prev + 1)
        }
    }

    const getData = () => {
        let data: CreateObj = {
            speakers: [
                {
                    name: speakerOne,
                    username: speakerOne,
                    confirmed: false,
                    isTwitterHandle: true,
                    address: "0x00",
                },
                {
                    name: speakerTwo,
                    username: speakerTwo,
                    confirmed: false,
                    isTwitterHandle: true,
                    address: "0x00"
                }
            ],
            propId: 0,
            description: description,
            title: title,
            prop_description: title,
            prop_starter: "0x00",
            charityPercent: 0,
            initTS: "",
            endTS: "",
            topics: topics,
            initialFunding: "0.01",
            fundingPeriod: selectedDuration.sec
        }

        return data;
    }

    return (
        <div className="w-full">
            <Head>
                <title>New Discourse</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/discourse_logo_fav.svg" />
            </Head>
            <Layout>

                <BDecoration />

                <div className='w-full min-h-screen flex flex-col py-10 gap-4 z-10 '>
                    {/* TopSection */}

                    <TopBar />

                    <div className="flex flex-col w-max self-center md:justify-between mt-10 mx-10 lg:mx-0 gap-4">

                        <div className="flex items-center justify-between w-full">
                            <h3 className='text-white font-semibold '>Start a Discourse</h3>
                            <ChainTag chainId={activeChain?.id!} />
                        </div>

                        {formError !== "" && <div className="bg-card p-4 rounded-xl max-w-xl flex justify-between items-center">
                            <p className="text-xs text-yellow-300">{formError}</p>
                            <button onClick={() => setFormError("")} className="rounded hover:bg-white/20"><CloseIcon /></button>
                        </div>}

                        <CreateDiscourseDialog open={openFundDialog} setOpen={setOpenFundDialog} data={newDiscourse} />

                        {/* Speaker input */}
                        <label className="text-xs text-white/60" htmlFor="speaker1">Invite speakers for discussion</label>
                        <p className="text-yellow-200/70 text-[10px] font-medium bg-yellow-200/10 px-2 rounded-md py-1">Our twitter search is not ready yet so make sure twitter handle is correct.</p>
                        <div className="w-full max-w-xl flex flex-col sm:flex-row items-center relative justify-between gap-4">
                            <div className="w-full bg-card flex gap-2 flex-1 border border-[#212427] rounded-xl py-2 px-4">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 14.252V16.342C13.0949 16.022 12.1263 15.9239 11.1754 16.0558C10.2245 16.1877 9.3192 16.5459 8.53543 17.1002C7.75166 17.6545 7.11234 18.3888 6.67116 19.2414C6.22998 20.094 5.99982 21.04 6 22L4 21.999C3.99969 20.7779 4.27892 19.5729 4.8163 18.4764C5.35368 17.3799 6.13494 16.4209 7.10022 15.673C8.0655 14.9251 9.18918 14.4081 10.3852 14.1616C11.5811 13.9152 12.8177 13.9457 14 14.251V14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z" fill="#6A6A6A" />
                                </svg>

                                <input id="speaker1" value={speakerOne} onChange={(e) => setSpeakerOne(e.target.value)} className="grow bg-transparent outline-none border-none text-white/80 text-xs font-medium" type="text" placeholder="Twitter handle " />
                            </div>
                            <div className="absolute inset-x-0 z-10 w-max hidden sm:flex mx-auto">
                                <svg width="36" height="16" viewBox="0 0 36 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 8C0 3.58172 3.58172 0 8 0L27.2 0C31.6183 0 35.2 3.58172 35.2 8C35.2 12.4183 31.6183 16 27.2 16L8 16C3.58172 16 0 12.4183 0 8Z" fill="#212221" />
                                    <path d="M17.3568 4.31383L14.4512 11.2002H12.3904L9.49756 4.31383H11.5584L13.4656 8.99863L15.4368 4.31383H17.3568Z" fill="url(#paint0_linear_14_5)" />
                                    <path d="M21.0284 11.3026C20.4566 11.3026 19.8977 11.2344 19.3516 11.0978C18.8054 10.9528 18.3702 10.7736 18.046 10.5602L18.7116 9.12663C19.0188 9.32289 19.39 9.48503 19.8252 9.61303C20.2604 9.73249 20.687 9.79223 21.1052 9.79223C21.95 9.79223 22.3724 9.58316 22.3724 9.16503C22.3724 8.96876 22.2572 8.82796 22.0268 8.74263C21.7964 8.65729 21.4422 8.58476 20.9644 8.52503C20.4012 8.43969 19.9361 8.34156 19.5692 8.23063C19.2022 8.11969 18.8822 7.92343 18.6092 7.64183C18.3446 7.36023 18.2124 6.95916 18.2124 6.43863C18.2124 6.00343 18.3361 5.61943 18.5836 5.28663C18.8396 4.94529 19.2065 4.68076 19.6844 4.49303C20.1708 4.30529 20.7425 4.21143 21.3996 4.21143C21.886 4.21143 22.3681 4.26689 22.846 4.37783C23.3324 4.48023 23.7334 4.62529 24.0492 4.81303L23.3836 6.23383C22.7777 5.89249 22.1164 5.72183 21.3996 5.72183C20.9729 5.72183 20.6529 5.78156 20.4396 5.90103C20.2262 6.02049 20.1196 6.17409 20.1196 6.36183C20.1196 6.57516 20.2348 6.72449 20.4652 6.80983C20.6956 6.89516 21.0625 6.97623 21.566 7.05303C22.1292 7.14689 22.59 7.24929 22.9484 7.36023C23.3068 7.46263 23.6182 7.65463 23.8828 7.93623C24.1473 8.21783 24.2796 8.61036 24.2796 9.11383C24.2796 9.54049 24.1516 9.92023 23.8956 10.253C23.6396 10.5858 23.2641 10.8461 22.7692 11.0338C22.2828 11.213 21.7025 11.3026 21.0284 11.3026Z" fill="url(#paint1_linear_14_5)" />
                                    <defs>
                                        <linearGradient id="paint0_linear_14_5" x1="9.49756" y1="5.8923" x2="23.9414" y2="10.2631" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#84B9D1" />
                                            <stop offset="1" stopColor="#D2B4FC" />
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_14_5" x1="9.49756" y1="5.8923" x2="23.9414" y2="10.2631" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#84B9D1" />
                                            <stop offset="1" stopColor="#D2B4FC" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                            </div>
                            <div className="w-full bg-card flex gap-2 flex-1 border border-[#212427] rounded-xl py-2 px-4">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 14.252V16.342C13.0949 16.022 12.1263 15.9239 11.1754 16.0558C10.2245 16.1877 9.3192 16.5459 8.53543 17.1002C7.75166 17.6545 7.11234 18.3888 6.67116 19.2414C6.22998 20.094 5.99982 21.04 6 22L4 21.999C3.99969 20.7779 4.27892 19.5729 4.8163 18.4764C5.35368 17.3799 6.13494 16.4209 7.10022 15.673C8.0655 14.9251 9.18918 14.4081 10.3852 14.1616C11.5811 13.9152 12.8177 13.9457 14 14.251V14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z" fill="#6A6A6A" />
                                </svg>

                                <input value={speakerTwo} onChange={(e) => setSpeakerTwo(e.target.value)} className="grow bg-transparent outline-none border-none text-white/80 text-xs font-medium" type="text" placeholder="Twitter handle " />
                            </div>
                        </div>

                        {/* Title input */}
                        <label className="text-xs text-white/60" htmlFor="title">Title for the discussion</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-xl input-s" id="title" type="text" placeholder="Title" />

                        <label className="text-xs text-white/60" htmlFor="description">Description for the discussion</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="max-w-xl input-s" id="description" placeholder="Description" />

                        <div className="flex flex-col gap-2 sm:gap-1 sm:flex-row max-w-xl w-full sm:items-center justify-between">
                            <div className="flex-1 flex items-center gap-2">
                                <PercentageSquare size={24} color="#6a6a6a" />
                                <input disabled value="Non-Charity" onChange={(e) => setCharityPercent(e.target.value)} className="input-s-d grow" type="text" placeholder="Charity %" />
                            </div>
                            <div className="flex-1 sm:flex-auto flex items-center gap-2">
                                <Timer1 size={24} color="#6a6a6a" />
                                <Listbox as="div" className="w-full relative" value={selectedDuration} onChange={setSelectedDuration}>
                                    <Listbox.Button className="text-white/80 px-4 py-2 bg-card hover:ring-2 ring-[#84B9D1]/50 t-all rounded-xl text-sm w-full" >Funding Period : {selectedDuration.value}</Listbox.Button>
                                    <Listbox.Options className="absolute right-0 mt-2 flex flex-col bg-card gap-2 overflow-clip rounded-xl" as="div">
                                        {
                                            timeDuration.map((time) => (
                                                <Listbox.Option as="span" className="cursor-pointer py-2 px-6 hover:bg-[#141515] text-white/80 text-sm"
                                                    key={time.id}
                                                    value={time}
                                                    disabled={time.unavailable}
                                                >{
                                                        ({ active, selected }) => (
                                                            <span className={`${active ? 'bg-[#141515]' : ''} ${selected ? 'text-white/30' : ''}`} >{time.title}</span>
                                                        )
                                                    }
                                                </Listbox.Option>
                                            ))
                                        }
                                    </Listbox.Options>
                                </Listbox>
                            </div>
                        </div>

                        <label className="text-xs text-white/60" htmlFor="description">to keep the conversation active, please enter atleast 3 sub-topic</label>

                        <div className="flex flex-col max-w-xl gap-2">
                            {
                                Array.from({ length: topicCount }).map((_, index) => {

                                    return <input key={index} value={topics[index] ? topics[index] : ""} onChange={(e) => handleTopicChange(e, index)} className="input-s text-white/80 text-xs" type="text" placeholder="---" />
                                })
                            }
                            <button onClick={handleTopicAdd} className="self-end  w-max button-o  text-white/60 text-xs border border-[#212427] flex items-center gap-2">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 5.16675V0.166748H6.66667V5.16675H11.6667V6.83342H6.66667V11.8334H5V6.83342H0V5.16675H5Z" fill="#C6C6C6" />
                                </svg>
                                Add More
                            </button>
                        </div>

                        <button onClick={handleSubmit} className="button-s max-w-xl text-sm">
                            Submit and Stake
                        </button>

                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default CreateDiscoursePage;