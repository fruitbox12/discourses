import { gql } from "@apollo/client";

export const REFRESH_TOKEN = gql`
    mutation RefreshToken {
        refreshToken {
        token
        expired
        }
    }
`

export const VERIFY_SIG = gql`
    mutation VerifySignature($signature: String!, $walletAddress: String!) {
        verifySignature(signature: $signature, walletAddress: $walletAddress) {
            address
            username
            token
        }
    }
`

export const PARTICIPATE = gql`
    mutation Participate($id: ID!, $email: String!) {
        participate(id: $id, email: $email) {
            id
            title
            description
            speakers {
                address
                username
                name
            }
            propId
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
        }
    }
`

export const LINK_TWITTER = gql`
    mutation LinkTwitter($twitterHandle: String!, $twitterName: String!, $imageUrl: String!) {
        linkTwitter(twitterHandle: $twitterHandle, twitter_name: $twitterName, image_url: $imageUrl) {
            twitter_handle
            address
            connected
        }
    }
`

export const FUND_UPDATE = gql`
    mutation UpdateFunding($propId: Int!, $amount: String!, $txn: String!) {
        updateFunding(propId: $propId, amount: $amount, txn: $txn) {
            id
            title
            description
            speakers {
                name
                username
                address
            }
            propId
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
            }
            participants {
                address
                email
                twitter_handle
                timestamp
            }
        }
    }
`

export const CREATE_DISCOURSE = gql`
    mutation CreateDiscourse($discourseInput: DiscourseInput!) {
        createDiscourse(discourseInput: $discourseInput) {
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
        }
    }
`

export const SET_WALLETADDRESS = gql`
    mutation SetWalletAddress($propId: Int!) {
        setWalletAddress(propId: $propId) {
            id
            propId
            speakers {
                name
                username
                address
                confirmed
                isTwitterHandle
            }
        }
    }
`

export const SPEAKER_CONFIRMATION = gql`
    mutation SpeakerConfirmation($propId: Int!) {
        speakerConfirmation(propId: $propId) {
            id
            propId
            speakers {
                name
                username
                address
                confirmed
                isTwitterHandle
            }
        }
    }
`

// "slotInput": {
//     "propId": null,
//     "slots": [
//       {
//         "timestamp": null,
//         "accepted": null
//       }
//     ]
//   }

export const PROPOSE_SLOT = gql`
    mutation ProposeSlot($slotInput: SlotInput!) {
        proposeSlot(slotInput: $slotInput) {
            id
            propId
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

export const ACCEPT_SLOT = gql`
    mutation AcceptSlot($slotInput: SlotInput!) {
        acceptSlot(slotInput: $slotInput) {
            id
            propId
            proposed
            proposer {
                address
                timestamp
            }
        }
    }
`

export const END_MEET = gql`
    mutation EndMeet($propId: Int) {
        endMeet(propId: $propId)
    }
`

export const TERMINATE_PROPOSAL = gql`
    mutation TerminateDiscourse($propId: Int) {
        terminateDiscourse(propId: $propId)
    }
    
`

export const FUND_WITHDRAWN = gql`
    mutation FundWithdrawn($propId: Int) {
        fundWithdrawn(propId: $propId)
    }
`

export const ENTER_DISCOURSE = gql`
    mutation EnterDiscourse($propId: Int) {
        enterDiscourse(propId: $propId)
    }
`