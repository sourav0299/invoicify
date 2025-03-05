"use client"
import { useEffect, useState } from "react"
import axios from "axios"

export default function parties(){
    const [location , setLocation] = useState({city: "" , state: "" , pincode: ""})

    const getlocation = async() => {
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition(
                async(position) => {
                const { latitude, longitude } = position.coords;

                try{
                    const API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
                    const response = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
                    );
                    if(response.data.results.length > 0){
                        const details = response.data.results[0].components;
                        setLocation({
                            city: details.city || details.town || details.village || "",
                            state: details.state || "",
                            pincode: details.postcode || "",
                        });
                    }
                }catch (error){
                    console.error("error", error);
                }
            },
            (error) => {
                console.error("error getting location: ", error); 
            }
        );
        }else {
            console.error("geolocation is not supported by this browser")
        }
    }

    return(
        <>
            <div className="">Parites</div>
            <button className="" onClick={getlocation}>Click here</button>
            <div className="">{location.city}, {location.state}, {location.pincode}</div>
        </>
    )
}