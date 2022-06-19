import { gql } from "@apollo/client"
export const PING = gql`
    query Ping {
        ping
    }
` 

export const GET_DISCOURSES = gql`
    query GetDiscourses {
        getDiscourses {
            id
            title
            description
            speakers {
                name
                username
                address
                confirmed
            }
            propId
            chainId
            prop_description
            prop_starter
            charityPercent
            initTS
            endTS
            funds {
                address
                amount
                timestamp
                txnHash
            }
            status {
                disputed
                completed
                terminated
                speakersConfirmation
            }
            discourse {
                room_id
                ended
                meet_date
                confirmation
            }
        }
    }
`

export const GET_DISCOURSE_BY_ID = gql`
    query GetDiscourseById($id: ID!) {
        getDiscourseById(id: $id) {
            id
            title
            description
            speakers {
                name
                username
                address
                confirmed
                isTwitterHandle
            }
            propId
            chainId
            prop_description
            prop_starter
            charityPercent
            initTS
            endTS
            topics
            funds {
                address
                amount
                timestamp
                txnHash
            }
            participants {
                address
                email
                twitter_handle
                timestamp
            }
            status {
                disputed
                completed
                terminated
                speakersConfirmation
                withdrawn
            }
            txnHash
            discourse {
                room_id
                ended
                meet_date
                confirmation
                c_timestamp
            }
        }

        getSlotById(id: $id) {
            id
            propId
            chainId
            proposed
            proposer {
                address
                timestamp
            }
            slots {
                timestamp
                accepted
            }
        }
    }


`

export const CHECK_TOKEN = gql`
    query CheckAuth {
        checkAuth {
            token
            expired
        }
    }
`

export const GET_NONCE = gql`
    query GetNonce($address: String!) {
        getNonce(walletAddress: $address) {
            nonce
            newUser
        }
    }
`

export const GET_USERDATA = gql`
    query GetUserData {
        getUserData {
            username
            walletAddress
            twitterConnected
            twitter {
                twitter_id
                twitter_handle
                image_url
                twitter_name
            }
        }
    }
`

export const CHECK_HANDLE = gql`
    query CheckTwitterLink($handle: String!) {
        checkTwitterLink(twitterHandle: $handle) {
            address
            twitter_handle
            connected
        }
    }
`

export const GET_TOKEN_BY_ID = gql`
    query GetMeetToken($id: ID!) {
        getMeetToken(id: $id) {
            token
            eat
            iat
        }
    }
`

export const GET_SESSIONS = gql`
    query GetSessions($id: ID!) {
        getSessions(id: $id) {
            id
            recordingStatus
            recordingUrl
            createdAt
        }
    }
`