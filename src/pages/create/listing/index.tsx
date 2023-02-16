import React, { useEffect, useState, useRef, ChangeEvent, ChangeEventHandler } from 'react';
import { useJsApiLoader, GoogleMap, MarkerF } from '@react-google-maps/api';
import { env } from '../../../env.mjs';
import { GridLoader } from 'react-spinners';
import { api } from '../../../utils/api';
import { getLatLng } from '../../../../helpers/get.lat.lng';
import Autocomplete from "react-google-autocomplete";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ICenterState {
    lat: number,
    lng: number
}

interface IDetailsState {
    ratePerNight: string
    name: string
    rooms: string
}

const index = () => {

    const firstRenderRef = useRef<boolean>(true)
    const mutation = api.product.createProduct.useMutation()

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        id: 'google-maps-script'
    });

    const [center, setCenter] = useState<ICenterState>({
        lat: 0,
        lng: 0
    });

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

    const { data, refetch } = api.geocoder.geocode.useQuery({
        latitude: center.lat,
        longitude: center.lng
    });

    const [address, setAddress] = useState<string>("");
    const [sendAddress, setSendAddress] = useState<string>("");

    const handleSubmit = (productDetails: any) => {
        mutation.mutate(productDetails);
    }

    const [roomDetails, setRoomDetails] = useState<IDetailsState>({
        ratePerNight: "",
        name: "",
        rooms: ""
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRoomDetails(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const [file, setFile] = useState<{ image: string | ArrayBuffer }>({
        image: ""
    })

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const imgFile = e!.target!.files![0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            if (fileReader.readyState === 2) {
                setFile(prevState => ({
                    ...prevState,
                    image: fileReader!.result!
                }))
            }
        };
        fileReader.readAsDataURL(imgFile!)
    }

    useEffect(() => {
        (async () => {
            const coords: any = await getLatLng();
            setCenter(prevState => ({
                ...prevState,
                lat: coords.coords.latitude,
                lng: coords.coords.longitude
            }))
        })()
    }, [])

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return
        };
        (async () => {
            const { data } = await refetch();
            setAddress(data!.address!)
        })()
    }, [JSON.stringify(center)])

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return
        };
        if (mutation.isError) {
            errorToast();
        } else if (mutation.isSuccess) {
            successToast();
        };
    }, [JSON.stringify(mutation)])

    return (
        <>
            <div
                className={`h-screen flex justify-center items-center p-${!isLoaded || !address ? "20" : "0"}`}
            >
                {
                    !isLoaded || !address ? (
                        <>
                            <GridLoader />
                        </>
                    ) : (
                        <>
                            <div
                                className='relative h-screen w-full bg-red-100'
                            >
                                <GoogleMap
                                    center={center}
                                    zoom={15}
                                    mapContainerStyle={{ width: "auto", height: "80vh" }}
                                    options={{ mapTypeControl: false, zoomControl: false, streetViewControl: false, fullscreenControl: false }}
                                >
                                    <MarkerF
                                        position={center}
                                    />
                                </GoogleMap>
                                <div
                                    className='flex justify-center absolute bottom-0 h-auto rounded-t-[30vh] bg-red-100 w-full'
                                >
                                    <div
                                        className='p-5 space-y-5'
                                    >
                                        <div
                                            className='flex justify-center items-center'
                                        >
                                            <text
                                                className='font-semibold text-3xl'
                                            >
                                                {address}
                                            </text>
                                        </div>
                                        <div
                                            className='flex justify-center items-center'
                                        >
                                            <input
                                                type="file"
                                                onChange={handleFileUpload}
                                                className='form-control
                                                block
                                                w-full
                                                px-3
                                                py-1.5
                                                text-base
                                                font-normal
                                                text-gray-700
                                                bg-white bg-clip-padding
                                                border border-solid border-gray-300
                                                rounded
                                                transition
                                                ease-in-out
                                                m-0
                                                focus:text-gray-700 
                                                focus:bg-white 
                                                focus:border-blue-600 
                                                focus:outline-none'
                                            />
                                        </div>
                                        <div
                                            className='flex justify-center items-center'
                                        >
                                            <input
                                                placeholder='Name'
                                                value={roomDetails.name}
                                                onChange={handleChange}
                                                name="name"
                                                className='w-96 h-10 p-5 rounded-md focus:outline-none'
                                            />
                                        </div>
                                        <div
                                            className='flex justify-center items-center'
                                        >
                                            <Autocomplete
                                                apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                                                style={{
                                                    width: '49vh', height: "5vh", padding: "2vh",
                                                    borderRadius: "1vh", outline: "none"
                                                }}
                                                onPlaceSelected={place => {
                                                    setCenter(prevState => ({
                                                        ...prevState,
                                                        lat: place!.geometry!.location!.lat()!,
                                                        lng: place!.geometry!.location!.lng()!
                                                    }));
                                                    setSendAddress(place!.formatted_address!);
                                                }}
                                                options={{
                                                    types: ["geocode", "establishment"],
                                                }}
                                            />
                                        </div>
                                        <div
                                            className='flex justify-center items-center'
                                        >
                                            <input
                                                placeholder='Rate'
                                                value={roomDetails.ratePerNight}
                                                onChange={handleChange}
                                                name="ratePerNight"
                                                inputMode="numeric"
                                                className='w-96 h-10 p-5 rounded-md focus:outline-none'
                                            />
                                        </div>
                                        <div
                                            className='flex justify-center items-center'
                                        >
                                            <input
                                                placeholder='Rooms'
                                                name="rooms"
                                                value={roomDetails.rooms}
                                                onChange={handleChange}
                                                inputMode='numeric'
                                                className='w-96 h-10 p-5 rounded-md focus:outline-none'
                                            />
                                        </div>
                                        <div
                                            className='flex justify-center items-center'
                                        >
                                            <button
                                                className='bg-indigo-500 w-40 text-white font-semibold h-10 
                                                transition hover:bg-indigo-300 rounded-md'
                                                onClick={() => {
                                                    const user = JSON.parse(localStorage.getItem("user")!)
                                                    let details = {
                                                        latitude: Number(center.lat),
                                                        longitude: Number(center.lng),
                                                        token: user.token,
                                                        address: sendAddress,
                                                        image: file.image
                                                    };
                                                    let productDetails = Object.assign(roomDetails, details);
                                                    console.log(productDetails, "details");
                                                    handleSubmit(productDetails);
                                                }}
                                            >
                                                Create Listing
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <ToastContainer />
                            </div>
                        </>
                    )
                }
            </div>
        </>
    )
}

export default index