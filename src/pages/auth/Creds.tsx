import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import { api } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ICredsProps {
    register: boolean
    owner: boolean
}

interface ICreds {
    email: string
    password: string
    userType: string
}

const Creds: React.FC<ICredsProps> = ({ register, owner }) => {

    const firsRenderRef = useRef<boolean>(true);

    const successToast = () => {
        toast.success('Successful!', {
            position: toast.POSITION.BOTTOM_LEFT
        });
    };

    const errorToast = () => {
        toast.error("Error!", {
            position: toast.POSITION.BOTTOM_LEFT
        });
    };

    const [creds, setCreds] = useState<ICreds>({
        email: "",
        password: "",
        userType: owner ? "owner" : "customer"
    });

    let mutation: any;
    mutation = register ? api.auth.register.useMutation() : api.auth.login.useMutation();

    const handleSubmit = async () => {
        mutation.mutate(creds);
    }

    useEffect(() => {
        if (firsRenderRef.current) {
            console.log("ref run")
            firsRenderRef.current = false;
            return
        };
        if (mutation.isError) {
            console.log("running")
            errorToast();
        } else if (mutation.isSuccess) {
            console.log("running")
            successToast();
        };
    }, [JSON.stringify(mutation)])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCreds(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };


    return (
        <>
            <div
                className='w-1/2 h-96 border border-gray-300 rounded-md'
            >
                <div
                    className='flex justify-center items-center p-5'
                >
                    <text
                        className='font-semibold text-3xl'
                    >
                        {
                            register ? "Register to use RoomBros" : "Login to your RoomBros account"
                        }
                    </text>
                </div>
                <div
                    className='flex justify-center items-center'
                >
                    <div
                        className='w-full space-y-5'
                    >
                        <div
                            className='flex justify-center items-center'
                        >
                            <input
                                type="email"
                                name="email"
                                value={creds.email}
                                onChange={handleChange}
                                placeholder='email'
                                className='w-64 h-10 border border-gray-200 rounded-md focus:outline-none p-4'
                            />
                        </div>
                        <div
                            className='flex justify-center items-center'
                        >
                            <input
                                type="password"
                                name="password"
                                value={creds.password}
                                onChange={handleChange}
                                placeholder='password'
                                className='w-64 h-10 border border-gray-200 rounded-md focus:outline-none p-4'
                            />
                        </div>
                        <div
                            className='flex justify-center items-center'
                        >
                            <button
                                onClick={async () => await handleSubmit()}
                                className='bg-indigo-500 text-white w-60 h-10 rounded-md transition hover:bg-indigo-300'
                            >
                                {
                                    register ? "Register" : "Login"
                                }
                            </button>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    )
}

export default Creds