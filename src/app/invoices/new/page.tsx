//this is the create invoice input page
"use client"
import SubmitButton from "@/components/SubmitButton"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
//import { Button } from "@/components/ui/button";
import { createAction } from "@/app/action";
import { SyntheticEvent, useState, /*startTransition*/ } from "react";
import Form from "next/form"
import Container from "@/components/Container";
export default function Home() {
    const [state, setState]=useState('ready')//this will help cut of people from spamming the sumbit by stopping the request when oending
 

    //what is SyntheticEvent
    //  async function handleOnSubmit (event: SyntheticEvent){
    //   console.log("1. Handler started");
    //     event.preventDefault();//we are preventing anything from happening
    //     if (state === 'pending')return;
    //     setState('pending');// prvent future form submissions
    //      const target = event.target as HTMLFormElement;//this gets the form element 

    //      //What is a start transition
    //      startTransition(async ()=>{//this for creating a loding circle
    //       const formData = new FormData(target);//we pass the target which is my form it also grabs the form data
    //      console.log("3. Form submitted");
    //     await createAction(formData)//action is expecting to have formData just as action={createAction}
    //     console.log("4. Action completed")
    

    //      })
         
        
    // }


    //what is SyntheticEvent
     async function handleOnSubmit (event: SyntheticEvent){
      console.log("1. Handler started");
        
        if (state === 'pending'){
          event.preventDefault();//we are preventing anything from happening
          return;
        }
        setState('pending');// prvent future form submissions
      }
        
  //const results = await db.execute(sql`SELECT current_database()`)//calling the data base to check its is working
  //console.log('results',results)
  return (
    <main className="h-full">
      <Container>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
            Create Invoice
            </h1>
      </div>

      <Form action={createAction} onSubmit={handleOnSubmit} className="grid gap-4 max-w-xs">
        <div>
          <Label htmlFor="name" className="block font-semibold text-small mb-2">
            Billing Name
          </Label>
          <Input id="name" name="name" type="text" />
        </div>
        <div>
          <Label
            htmlFor="email"
            className="block font-semibold text-small mb-2"
          >
            Billing Email
          </Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div>
          <Label
            htmlFor="value"
            className="block font-semibold text-small mb-2"
          >
            Value
          </Label>
          <Input id="value" name="value" type="value" />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="block font-semibold text-small mb-2"
          >
            Description
          </Label>
          <Textarea id="description" name="description"></Textarea>
          {/*id and name are to identify the input from the user so we can then store it in db*/}
        </div>
        <div>
          <SubmitButton/>{/*the button was moved to a different component cutom*/}
        </div>
      </Form>
      </Container>
    </main>
  );
}
