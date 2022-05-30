import { WriteContractArgs } from '@wagmi/core'
import abi from '../web3/abi/DiscourseHub.json'
export const contractData = (): WriteContractArgs => {
    let data : WriteContractArgs = {
        addressOrName: '0x4459B1562493Dd44346C86615d87Bf9376f130ae',
        contractInterface: abi
    }
    return data
}