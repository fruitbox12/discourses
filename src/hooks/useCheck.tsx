import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { CHECK_TOKEN } from '../lib/queries'
import { useLazyQuery } from "@apollo/client";
import { setUser } from "../store/slices/userSlice";
import { useAccount, useDisconnect } from "wagmi";

const useCheck = () => {
    const dispatch = useDispatch();
    const { disconnect, disconnectAsync } = useDisconnect();
    const { data } = useAccount();
    const [ fetched, setFetched ] = useState(false);
    const user = useSelector((state: RootState) => state.user);
    const [checkToken, { error: checkTokenError }] = useLazyQuery(CHECK_TOKEN, {
        context: {
            headers: {
                authorization: `Bearer ${user.token}`
            }
        }, onCompleted: (data) => {
            setFetched(true);
        },
        onError: (error) => {
            setFetched(true);
        }
    });
    

    useEffect(() => {
        if (checkTokenError && !fetched) {
            dispatch(setUser({
                token: '',
                username: '',
                walletAddress: '',
                expiresAt: '',
                isLoggedIn: false,
                tConnected: false,
                t_handle: "",
                t_name: "",
                t_id: "",
                t_img: ""
            }));
        }
    }, [checkTokenError, dispatch, fetched]);

    useEffect(() => {
        if (user.expiresAt !== "") {
            let date = new Date(user.expiresAt);
            let now = new Date();
            console.log(date, now);

            if (date < now) {
                disconnect();
                dispatch(setUser({
                    token: '',
                    username: '',
                    walletAddress: '',
                    expiresAt: '',
                    isLoggedIn: false,
                    tConnected: false,
                    t_handle: "",
                    t_name: "",
                    t_id: "",
                    t_img: ""
                }));
            }
        } else {
            disconnectAsync().then(() => {
                // Do nothing
            })
        }
    }, [user]);

    

    return [data];
}

export default useCheck;