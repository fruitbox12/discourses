import { Dialog } from '@headlessui/react';
import { Dispatch, SetStateAction, useRef } from "react";
import { ethers } from "ethers";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useLazyQuery, useMutation } from '@apollo/client';
import UseAnimations from 'react-useanimations';
import loading from 'react-useanimations/lib/loading';
import { DiscourseIcon, FundDiscourseIcon } from '../utils/SvgHub';
import { FUND_UPDATE } from '../../lib/mutations';
import { GET_DISCOURSE_BY_ID } from '../../lib/queries';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { contractData } from '../../helper/ContractHelper';
import { TransactionReceipt } from '@ethersproject/abstract-provider';


const FundDiscourseDialog = ({ open, setOpen, discourse }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, discourse: any }) => {
    let buttonRef = useRef(null);

    const [minting, setMinting] = useState(false);
    const [txn, setTxn] = useState("");
    const [funded, setFunded] = useState(false);
    const [ amount, setAmount ] = useState('0.01');

    const user = useSelector((state: RootState) => state.user);
    
    const [ updateFund, { data: fData } ] = useMutation(FUND_UPDATE, {
        context: {
            headers: {
                authorization: `Bearer ${user.token}`
            }
        }
    })

    const [ fetchD ] = useLazyQuery(GET_DISCOURSE_BY_ID, { variables: { id: discourse.id } });

    const fund = useContractWrite(
        contractData(),
        'pledgeFunds',
        {
            args: [+discourse.propId],
            overrides: { from: user.walletAddress, value: ethers.utils.parseEther(amount) },
            onSettled: (txn) => {
                console.log('submitted:', txn);
            },
            onError: (error) => {
                console.log('error:', error);
                setMinting(false);
            }
        }
    )

    const waitForTxn = useWaitForTransaction({
        hash: fund.data?.hash,
        onSettled: (txn) => {
            console.log('settled:', txn);
            if (txn) {
                setTxn(txn?.transactionHash);
                writeFund(txn);
            }
        }
    })

    const writeFund = (txnData: TransactionReceipt) => {
        updateFund({
            variables: {
                propId: discourse.propId,
                amount: ethers.utils.parseEther(amount)+"",
                txn: txnData.transactionHash
            },
            onCompleted: (data) => {
                setMinting(false);
                setFunded(true);
                fetchD();
            },
            onError: (error) => {
                console.log(error);
                setMinting(false);
                // error handle
            }
        })
    }

    const handleClose = () => {
        setOpen(false);
    }

    

    const handleFundClick = async () => {
        setMinting(true);
        fund.write();
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
                                <p className='text-[#c6c6c6] text-medium text-xs max-w-[40ch] flex-[1] '>You are about to fund a discoures. Need to fund min Ξ 0.01 </p>
                                <div className='flex flex-col items-center justify-center w-full gap-4'>
                                    <label htmlFor="amount" className='relative flex items-center'>
                                        <p className='absolute text-white m-auto inset-y-0 left-3 h-max'>Ξ</p>
                                        <input value={amount} onChange={(e) => setAmount(e.target.value) } type="number" id='amount' className=" input-s pl-8 text-white" placeholder='Stake Amount' />
                                    </label>
                                    <button onClick={handleFundClick} ref={buttonRef} className='button-s font-semibold tracking-wide px-6 py-3  text-xs bg-[#212427] rounded-lg outline-none'>Fund &rarr;</button>
                                </div>
                            </Dialog.Description>
                        </>
                        }
                        {/* Minting.. Post View */}
                        {minting  &&
                            <>
                                <Dialog.Title className="text-white text-base  font-bold tracking-wide flex items-center gap-2 w-max self-center mx-auto ">
                                    <FundDiscourseIcon />
                                    Funding Discourse
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

                                Funded Discourse
                            </Dialog.Title>
                            <Dialog.Description className="flex flex-col  w-full items-center  gap-4 text-center justify-between mt-4">
                                <p className='text-[#c6c6c6] text-medium text-xs max-w-[40ch] flex-[1] '>Thanks for funding the discourse. You&apos;ll get notification once the stream is scheduled and speakers confirms.</p>
                                <div className='flex items-center justify-center w-full px-10 gap-10'>
                                    <a href={`https://rinkeby.etherscan.io/tx/${txn}`} target="_blank" className='text-xs font-bold  text-gradient' rel="noreferrer" >View Transaction ↗</a>
                                </div>
                            </Dialog.Description>
                            </>
                        }

                    </div>
                </div>
            </Dialog>
    );
}



export default FundDiscourseDialog;