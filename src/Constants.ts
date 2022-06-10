export const supportedChainIds = [
    1313161555, //aurora
    80001, //Polygon
    4 //Rinkeby
]

export const getChainName = (chainId: number) => {
    switch (chainId) {
        case 80001:
            return 'Polygon Mumbai'
        case 1313161555:
            return 'Aurora Testnet'
        case 4:
            return 'Rinkeby Testnet'
        default:
            return 'Unknown'
    }
}

export const getCurrencyName = (chainId: number) => {
    switch (chainId) {
        case 80001:
            return 'MATIC'
        case 1313161555:
            return 'ETH'
        default:
            return 'ETH'
    }
}

export const rpcUrl = (chainId: number) => {
    switch (chainId) {
        case 80001:
            return { http: 'https://polygon-mumbai.g.alchemy.com/v2/ksqleRX25aRSLQ9uawfAwVTlQ8gKLULj'}
        case 1313161555:
            return { http: 'https://aurora-testnet.infura.io/v3/a4d6ff8d0a7c4b93a9a4ac41adc048c8'};
        case 4:
            return {  http: 'https://eth-rinkeby.alchemyapi.io/v2/WvYNyDhms47fYoy5xazaVd7VpkT7G0QP'};
        default:
            return null;

    }
}

export const getSwitchNetwork = (chainId: number) => {
    switch (chainId) {
        case 80001:
            return 1313161555
        case 1313161555:
            return 80001
        default:
            return 80001
    }
}