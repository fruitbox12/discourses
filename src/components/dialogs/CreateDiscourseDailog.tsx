import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, SetStateAction, useRef } from "react";
import { useRouter } from 'next/router';
import Web3 from "web3";
import { ethers } from "ethers";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import UseAnimations from 'react-useanimations';
import loading from 'react-useanimations/lib/loading';
import { DiscourseIcon, FundDiscourseIcon } from '../utils/SvgHub';
import DiscourseHub from '../../web3/abi/DiscourseHub.json';
import Addresses from '../../web3/addresses.json';
import { CREATE_DISCOURSE } from '../../lib/mutations';
import { getSecNow } from '../../helper/TimeHelper';

async function getDiscourseContract() {
    return await new (window as any).web3.eth.Contract(
        DiscourseHub,
        Addresses.discourse_daimond
    )
}


const CreateDiscourseDialog = ({ open, setOpen, data }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, data: any }) => {
    let buttonRef = useRef(null);

    const [minting, setMinting] = useState(false);
    const [txn, setTxn] = useState("");
    const [funded, setFunded] = useState(false);
    const [ walletAddress, setWalletAddress ] = useState('');
    const [ error, setError] = useState({});
    const [ amount, setAmount ] = useState('0.01');
    const [ discourseId, setDiscourseId ] = useState('');

    const route = useRouter();

    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    const [createDiscourse, { data: cData }] = useMutation(CREATE_DISCOURSE, {
        context: {
            headers: {
                authorization: `Bearer ${user.token}`
            }
        }
    })

    const handleClose = () => {
        setOpen(false);
    }

    
    // useEffect(() => {
    //     if (joinDaoData) {
    //         setMinting(false);
    //         setPostMinted(true);
    //     }
    // }, [joinDaoData]);

    const load = async () => {
        const win = window as any;
        if (win.ethereum) {
            win.web3 = new Web3(win.ethereum);
            await win.ethereum.enable();
            (window as any).contract = await getDiscourseContract();
        } else {
            // Show metamask error
        }
    }

    useEffect(() => {
        if (cData) {
            setMinting(false);
            setFunded(true);
        }
    }, [cData])


    const handleFundClick = async () => {
        setMinting(true);
        await load();
        try {
            console.log('cp ', data.charityPercent, typeof data.charityPercent);
            console.log('fp ', data.fundingPeriod, typeof data.fundingPeriod);
            
            const tx = await (window as any).contract.methods.createProposalNoAddresses(
                data.speakers[0].username,
                data.speakers[1].username,
                data.title,
                +data.charityPercent,
                +data.fundingPeriod
            ).send({
                from: user.walletAddress,
                value: ethers.utils.parseEther(amount)
            });
            console.log(tx);
            
            setTxn(tx.transactionHash);

            createDiscourse({
                variables: {
                    discourseInput: {
                        speakers: data.speakers,
                        propId: +tx.events.CreateProposal.returnValues._propId,
                        description: data.description,
                        title: data.title,
                        prop_description: data.title,
                        prop_starter: user.walletAddress,
                        charityPercent: +data.charityPercent,
                        initTS: getSecNow(),
                        endTS: tx.events.CreateProposal.returnValues._endTs+"",
                        topics: data.topics,
                        initialFunding: ethers.utils.parseEther(amount)+"",
                        txnHash: tx.transactionHash
                    }
                },
                context: {
                    headers: {
                        authorization: `Bearer ${user.token}`
                    }
                },
                onError: (error) => {
                    console.log(error);
                    setError({
                        message: "Error in registering discourse. Please contact admin",
                        error: true
                    })
                    setMinting(false);
                },
                onCompleted: (data) => {
                    setMinting(false);
                    setFunded(true);
                    setDiscourseId(data.createDiscourse.id);
                }
            })

        } catch (e) {
            setMinting(false);
            console.log(e);
        }
    }




    return (


            <Dialog as='div' open={open} onClose={handleClose}
                initialFocus={buttonRef}
                className='fixed z-20 inset-0 w-screen h-screen overflow-hidden'>
                <div className="flex items-center justify-center h-screen backdrop-blur-sm overflow-hidden">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-0 w-screen h-screen overflow-hidden" />

                    <div className="relative bg-[#141515] border border-[#212427]  rounded-2xl max-w-sm w-full mx-auto px-6 py-4 sm:py-10 gap-4">
                        {/* Mint Post View */}
                        {!minting && !funded && <>
                            <Dialog.Title className="text-white text-base  font-bold tracking-wide flex items-center gap-2 w-max self-center mx-auto ">
                                <FundDiscourseIcon />

                                Fund Discourse
                            </Dialog.Title>
                            <Dialog.Description className="flex flex-col  w-full items-center  gap-4 text-center justify-between mt-4">
                                <p className='text-[#c6c6c6] text-medium text-xs max-w-[40ch] flex-[1] '>This is initial funding of the discourse required from creator. Need to fund min Ξ 0.01 </p>
                                <div className='flex flex-col items-center justify-center w-full gap-4'>
                                    <label htmlFor="amount" className='relative flex items-center'>
                                        <p className='absolute text-white m-auto inset-y-0 left-3 h-max'>Ξ</p>
                                        <input value={amount} onChange={(e) => setAmount(e.target.value) } type="number" id='amount' className=" input-s pl-8 text-white" placeholder='Stake Amount' />
                                    </label>
                                    <button ref={buttonRef} onClick={handleFundClick} className='button-s font-semibold tracking-wide px-6 py-3  text-xs bg-[#212427] rounded-lg outline-none'>Fund &rarr;</button>
                                </div>
                            </Dialog.Description>
                        </>
                        }
                        {/* Minting.. Post View */}
                        {minting  &&
                            <>
                                <Dialog.Title className="text-white text-base  font-bold tracking-wide flex items-center gap-2 w-max self-center mx-auto ">
                                    <FundDiscourseIcon />
                                    Creating Discourse
                                </Dialog.Title>
                                <Dialog.Description className="flex flex-col  w-full items-center  gap-4 text-center justify-between mt-4">
                                    <p className='text-[#c6c6c6] text-medium text-xs max-w-[40ch] flex-[1] '>Approve the transaction from metamask.<br /> Ξ {amount} will be funded to the discourse.</p>
                                    <div className='flex items-center justify-center gap-2'>
                                        <UseAnimations animation={loading} size={20} strokeColor="#ffffff" className='text-white' />
                                        <p className='text-sm text-white/50' >Please Wait...</p>
                                    </div>
                                </Dialog.Description>
                            </>
                        }
                        {/* Minted Post */}
                        {!minting && funded &&
                            <>
                            <Dialog.Title className="text-white text-base  font-bold tracking-wide flex items-center gap-2 w-max self-center mx-auto ">
                                <DiscourseIcon />

                                Discourse Created
                            </Dialog.Title>
                            <Dialog.Description className="flex flex-col  w-full items-center  gap-4 text-center justify-between mt-4">
                                <p className='text-[#c6c6c6] text-medium text-xs max-w-[40ch] flex-[1] '>Discourse created! Click Discourse button below to go to the discourse page.</p>
                                <div className='flex items-center justify-center w-full gap-10'>
                                    <a href={`https://rinkeby.etherscan.io/tx/${txn}`} target="_blank" className='text-xs text-green-300  ' rel="noreferrer" >Transaction ↗</a>
                                    { discourseId !== "" && <button onClick={() => route.push(`/${discourseId}`)} className='text-xs font-bold  text-gradient' >Discourse &rarr;</button>}
                                </div>
                            </Dialog.Description>
                            </>
                        }

                    </div>
                </div>
            </Dialog>
    );
}



export default CreateDiscourseDialog;