import { WriteContractArgs } from '@wagmi/core'
import abi from '../web3/abi/DiscourseHub.json'
export const contractData = (chainId: number): WriteContractArgs => {
    let data : WriteContractArgs = {
        addressOrName: getContractAddressByChainId(chainId),
        contractInterface: abi
    }
    return data
}

const getContractAddressByChainId = (chainId: number) => {
    switch (chainId) {
        case 80001:
            return '0x4459B1562493Dd44346C86615d87Bf9376f130ae'
        case 1313161555:
            return '0xDdeEa46a3b23Ef146dD9E6338Dd2136fF1a1C8cc'
        default:
            return '0x4459B1562493Dd44346C86615d87Bf9376f130ae'
    }
}