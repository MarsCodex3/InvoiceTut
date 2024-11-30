"use client"
import { useFormStatus } from "react-dom"
import { Button} from "@/components/ui/button"
import { LoaderCircle } from 'lucide-react';
//all of this is to create that dum loader circle

const SubmitButton =()=>{
    //What is desctructuring
    const {pending} = useFormStatus()
    console.log("Pending",pending)
    return(
        <Button className=" relative w-full font-semibold">
            <span className= {pending ? "text-transparent":''}>{/* we need a ternatry because typescript cries*/}Submit</span>{/*this is the submit button*/}
            {pending && (
                <span className="absolute flex items-center justify-center w-full h-full text-gray-400">
                    <LoaderCircle className="animate-spin"/>
                    </span>
            )}
    
          </Button>
    )
}

export default SubmitButton