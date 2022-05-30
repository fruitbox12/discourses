import { useState } from "react";
import { useContractRead } from "wagmi";
import DiscourseHub from '../web3/abi/DiscourseHub.json'
const useGetProposals = () => {
    const abi = DiscourseHub;
    const { data, isError, isLoading } = useContractRead({
        addressOrName: '0x4459B1562493Dd44346C86615d87Bf9376f130ae',
        contractInterface: abi
        },
        'getTotalProposals'
    )

    console.log(data);
    

    return [data, isError, isLoading] as const;
}

export default useGetProposals;