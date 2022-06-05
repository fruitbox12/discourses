export const supportedChainIds = [
    80001, //Polygon
    1313161555, //aurora
]

export const getChainName = (chainId: number) => {
    switch (chainId) {
        case 80001:
            return 'Polygon Mumbai'
        case 1313161555:
            return 'Aurora Testnet'
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