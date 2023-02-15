import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Creds from '../Creds';
import { GridLoader } from "react-spinners"

const Auth = () => {

    const router = useRouter();
    const { pid, type } = router.query;
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        if (!router.isReady) {
            return
        };
        setShow(true)
    }, [router.isReady])

    return (
        <>
            <div
                className='h-screen p-20 flex justify-center items-center'
            >
                {!show ? (
                    <>
                        <GridLoader />
                    </>
                ) : (
                    <>
                        {
                            pid === "register" ? (
                                <>
                                    {
                                        type === "owner" ? (
                                            <>
                                                <Creds register={true} owner={true} />
                                            </>
                                        ) : (
                                            <>
                                                <Creds register={true} owner={false} />
                                            </>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    {
                                        type === "owner" ? (
                                            <>
                                                <Creds register={false} owner={true} />
                                            </>
                                        ) : (
                                            <>
                                                <Creds register={false} owner={false} />
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </>
                )}
            </div>
        </>
    )
}

export default Auth