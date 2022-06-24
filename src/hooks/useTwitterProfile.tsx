import { useState, useMemo, useEffect } from "react";
import { fetchImage } from '../helper/ProfileImageHelper'

interface TwitterProfile {
    screen_name: string;
    name: string;
    profile_image_url: string;
}

const useTwitterProfile = (twitterHandle: string) => {
    const [profile, setProfile] = useState<TwitterProfile>({
        screen_name: twitterHandle,
        name: twitterHandle,
        profile_image_url: `https://avatar.tobi.sh/${twitterHandle}`
    });
    useMemo(() => fetchImage(twitterHandle).then(data => {
        setProfile({
            screen_name: data.screen_name!,
            name: data.name!,
            profile_image_url: data.profile_image_url!
        });
        return data;
    }).catch(err => {
        console.log(err);
        setProfile({
            screen_name: twitterHandle,
            name: twitterHandle,
            profile_image_url: `https://avatar.tobi.sh/${twitterHandle}`
        })
        return {
            screen_name: twitterHandle,
            name: twitterHandle,
            profile_image_url: `https://avatar.tobi.sh/${twitterHandle}`
        }
    }), [twitterHandle]);

    return profile;
}

export default useTwitterProfile;