"use server";
//everything her eis the action or that are taken to make changes to the database
import { redirect } from "next/navigation";
import { Customers, Invoices, Status } from "@/db/schema";
import{db} from "@/db"
import { auth } from "@clerk/nextjs/server";
import {and,eq,isNull} from 'drizzle-orm'
import { revalidatePath } from 'next/cache';
import { headers } from "next/headers";
import Stripe from "stripe"
//this is stripe in order to send invoices
const stripe = new Stripe(String(process.env.STRIPE_API_SECRET))//this is so we can collect the key from env



export async function createAction(formData: FormData){
    const {userId,orgId} = await auth();//auth is used for authentication and authorization of users and await was needed
  
    if(!userId){// if I dont have a user Id I'm going to return
        //we want to check for the authenticated sessiosn for anything thats behind the auth wall
        //we also want to associate that data with the specific users to avoid data leaking to other users so user only see thteir data
        return;
    }
  //I dont know exactly what this does
  const value = Math.floor(parseFloat(String(formData.get('value'))))*100//multiply it by 100 to store as an in//we are getting the value data
  console.log("value",value)
  const description = formData.get('description') as string//get the description data
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  const [customer] = await db.insert(Customers)
  .values({//this is to bring the data from the other .ts file with the invoices function customer table
      name,
      email,
      userId,
      organizationId: orgId || null//for organization
   
  })
  .returning({
      id: Customers.id
  })

    const results = await db.insert(Invoices)
    .values({//this is to bring the data from the other .ts file with the invoices function
        value,
        description,
        userId,
        customerId: customer.id,
        status: "open",
        organizationId: orgId || null //for organization
    })
    .returning({
        id: Invoices.id
    })

    redirect(`/invoices/${results[0].id}`)//thid id the redirect short url I wanted to do in the previous clone
}
//evretyhhing being exported here is exported as an endpoint will be publicly available becarefull about the data being returned if exporting this functions


//we are updatinng the status of our invoices
// export async function updateStatusAction(formData:FormData){
//     const {userId,orgId} = await auth();//auth is used for authentication and authorization of users and await was needed
//     //I dont know exactly what this does

//     if(!userId){// if I dont have a user Id I'm going to return
//         //we want to check for the authenticated sessiosn for anything thats behind the auth wall
//         //we also want to associate that data with the specific users to avoid data leaking to other users so user only see thteir data
//         return;
//     }
//     const id =formData.get('id') as string
//     const status =formData.get('status') as Status //thi is to check it is acctually a valid value


//     //org set up
//     //let results
//     if(orgId){
//      await db.update(Invoices)
//     .set({status})
//     .where(
//         and(
//         //because we are going to be doing more than just equaling
//             eq(Invoices.id, Number.parseInt(id)),
//             eq(Invoices.organizationId, orgId)// the reason that works it because it looks for a user Id row and then looks for the invoice number and since there is no result we give the error 
//         )
//     )
//         }else{
//              await db.update(Invoices)
//     .set({status})
//     .where(
//         and(
//         //because we are going to be doing more than just equaling
//         eq(Invoices.id, Number.parseInt(id)),
//         eq((Invoices.userId), userId),
//         isNull(Invoices.organizationId)
//         )
//     )
// }

//     //     const updatedInvoice = await db.select()
//     //     .from(Invoices)
//     //     .where(eq(Invoices.id, Number.parseInt(id)))
//     //     .limit(1);
//     // console.log('Updated invoice:', updatedInvoice);


// revalidatePath(`/invoices/${id}`,"page")//is to refresh the page after updating the status

//       //console.log("results", results)

// }

////action 4
// src/app/actions.ts


// export async function updateStatusAction(formData: FormData) {
//   const { userId, orgId } = await auth(); // Ensure auth is awaited if it's asynchronous

//   if (!userId) {
//     console.error('Unauthorized access attempt');
//     return;
//   }

//   const id = formData.get("id") as string;
//   const status = formData.get("status") as string; // Ensure Status type is defined

//   if (!id || !status) {
//     console.error('Invalid data received');
//     return;
//   }

//   try {
//     // Update the invoice status
//     if (orgId) {
//       await db
//         .update(Invoices)
//         .set({ status })
//         .where(
//           and(eq(Invoices.id, Number.parseInt(id)), eq(Invoices.organizationId, orgId))
//         );
//     } else {
//       await db
//         .update(Invoices)
//         .set({ status })
//         .where(
//           and(eq(Invoices.id, Number.parseInt(id)), eq(Invoices.userId, userId), isNull(Invoices.organizationId))
//         );
//     }

//     console.log(`Invoice status updated for ID: ${id}`);

//     // Revalidate the path after ensuring all operations are complete
//     const pathToRevalidate = `/invoices/${id}`;
//     await revalidatePath(pathToRevalidate);
//     console.log(`Successfully revalidated ${pathToRevalidate}`);
//   } catch (error) {
//     console.error('Failed to update status or revalidate path:', error);
//   }
// }
////action 4





// /////actions 3 failed
// export async function updateStatusAction(formData: FormData) {
//   const { userId, orgId } = await auth(); // Ensure auth is awaited if it's asynchronous

//   if (!userId) {
//     console.error('Unauthorized access attempt');
//     return;
//   }

//   const id = formData.get("id") as string;
//   const status = formData.get("status") as string; // Ensure Status type is defined

//   if (!id || !status) {
//     console.error('Invalid data received');
//     return;
//   }

//   try {
//     if (orgId) {
//       await db
//         .update(Invoices)
//         .set({ status })
//         .where(
//           and(eq(Invoices.id, Number.parseInt(id)), eq(Invoices.organizationId, orgId))
//         );
//     } else {
//       await db
//         .update(Invoices)
//         .set({ status })
//         .where(
//           and(eq(Invoices.id, Number.parseInt(id)), eq(Invoices.userId, userId), isNull(Invoices.organizationId))
//         );
//     }

//     revalidatePath(`/invoices/${id}`);
//     console.log(`Successfully revalidated /invoices/${id}`);
//   } catch (error) {
//     console.error('Failed to update status:', error);
//   }
// }
// ////action 3



/////////action2
// export async function updateStatusAction(formData: FormData) {
//   const id = formData.get("id") as string;
//   const status = formData.get("status") as string; // Ensure Status type is defined

//   if (!id || !status) {
//     console.error('Invalid data received');
//     return;
//   }

//   try {
//     await db
//       .update(Invoices)
//       .set({ status })
//       .where(eq(Invoices.id, Number.parseInt(id)));

//     revalidatePath(`/invoices/${id}`);
//     console.log(`Successfully revalidated /invoices/${id}`);
//   } catch (error) {
//     console.error('Failed to update status:', error);
//   }
// }

////////////action2


///////////////////action ai 1

export async function updateStatusAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    console.error('Unauthorized user attempt to update status');
    return;
  }

  const id = formData.get('id') as string;
  const status = formData.get('status') as Status;

  if (!id || !status) {
    console.error('Invalid data received');
    return;
  }

  try {
    if (orgId) {
      await db
        .update(Invoices)
        .set({ status })
        .where(
          and(eq(Invoices.id, Number.parseInt(id)), eq(Invoices.organizationId, orgId))
        );
    } else {
      await db
        .update(Invoices)
        .set({ status })
        .where(
          and(eq(Invoices.id, Number.parseInt(id)), eq(Invoices.userId, userId), isNull(Invoices.organizationId))
        );
    }

    revalidatePath(`/invoices/${id}`,"page"); // Ensure this is reached only after successful update
    console.log(`Successfully revalidated /invoices/${id}`);
  } catch (error) {
    console.error('Failed to update status:', error);
  }
}

///////////////////// action a 1 



// ///////re try
// export async function updateStatusAction(formData: FormData){
//   const {userId} = await auth();//auth is used for authentication and authorization of users and await was needed

//   if(!userId){// if I dont have a user Id I'm going to return
//       //we want to check for the authenticated sessiosn for anything thats behind the auth wall
//       //we also want to associate that data with the specific users to avoid data leaking to other users so user only see thteir data
//       return;
//   }

//   const id = formData.get('id') as string
//   const status = formData.get('status') as string

//   const results = await db.update(Invoices)
//     .set({status})//this is to bring the data from the other .ts file with the invoices function
//     .where(
//         and(
//             eq(Invoices.id,parseInt(id)),
//             eq(Invoices.userId,userId),
//             isNull(Invoices.organizationId)
//         )
//     )
//     revalidatePath(`/invoices/${id}`,"page")
// }
// ////retry














// export async function updateStatusAction(formData: FormData) {
//   const { userId, orgId } = await auth();

//   // Updating disabled for demo
//   if ( userId !== process.env.ME_ID ) return;

//   if (!userId) {
//     return;
//   }

//   const id = formData.get("id") as string;
//   const status = formData.get("status") as Status;

//   if (orgId) {
//     await db
//       .update(Invoices)
//       .set({ status })
//       .where(
//         and(
//           eq(Invoices.id, Number.parseInt(id)),
//           eq(Invoices.organizationId, orgId),
//         ),
//       );
//   } else {
//     await db
//       .update(Invoices)
//       .set({ status })
//       .where(
//         and(
//           eq(Invoices.id, Number.parseInt(id)),
//           eq(Invoices.userId, userId),
//           isNull(Invoices.organizationId),
//         ),
//       );
//   }

//   revalidatepath(`/invoices/${id}`, "page");
// }



//we are deleteing our invoices
export async function deleteInvoiceAction(formData:FormData){
    const {userId,orgId} = await auth();//auth is used for authentication and authorization of users and await was needed
    //I dont know exactly what this does

    if(!userId){// if I dont have a user Id I'm going to return
        //we want to check for the authenticated sessiosn for anything thats behind the auth wall
        //we also want to associate that data with the specific users to avoid data leaking to other users so user only see thteir data
        return;
    }
    const id =formData.get('id') as string



   //I removed the results
    
    if(orgId){
         await db.delete(Invoices)
        .where(
            and(
                //because we are going to be doing more than just equaling
                    eq(Invoices.id, parseInt(id)),
                    eq(Invoices.organizationId, orgId)// the reason that works it because it looks for a user Id row and then looks for the invoice number and since there is no result we give the error 
            )
        )

    }else{
        await db.delete(Invoices)
        .where(
            and(
                //because we are going to be doing more than just equaling
                    eq(Invoices.id, parseInt(id)),
                    eq((Invoices.userId), userId),
                    isNull(Invoices.organizationId)
            )
        )        
    }
redirect("/dashboard")//is to refresh the page after updating the status


}

//this function will create the payment for stripe

export async function createPayment(formData: FormData){
    const headersList = headers()//the headers comes from next js
    const origin = (await headersList).get("origin")
    const id = parseInt(formData.get('id') as string)

    const [result] = await db.select({
        status: Invoices.status,
        value: Invoices.value
     })
    .from(Invoices)
    .where(eq(Invoices.id,id))
    .limit(1)

//it comes from stripe
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data:{
                currency: 'usd',
                product: "prod_RItCn4Pcs1hGLl",//we created this Id by creating a new product inside of stripe
                unit_amount: result.value //we are taking the database value input in from invoice and tunring it into the amount
            },//collected from the create a session docs on stripe
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,//this url takes them back to the invoice page
        cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
      });

      if(!session.url){
        throw new Error("Invalid Session")
      }
     
      return redirect(session.url);
      

    // console.log('result',result)
}







// export async function createPayment(formData: FormData) {
//   // Payments disabled for demo
//   const { userId } = await auth();
//   if ( userId !== process.env.ME_ID ) return;

//   const headersList = headers();
//   const origin = (await headersList).get("origin");
//   const id = Number.parseInt(formData.get("id") as string);

//   const [result] = await db
//     .select({
//       status: Invoices.status,
//       value: Invoices.value,
//     })
//     .from(Invoices)
//     .where(eq(Invoices.id, id))
//     .limit(1);

//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product: "prod_RItCn4Pcs1hGLl",
//           unit_amount: result.value,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
//   });

//   if (!session.url) {
//     throw new Error("Invalid Session");
//   }

//   redirect(session.url);
// }




























// "use server";

// import { auth } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import Stripe from "stripe";

// import { db } from "@/db";
// import { Customers, Invoices, type Status } from "@/db/schema";
// import { and, eq, isNull } from "drizzle-orm";
// import { headers } from "next/headers";


// const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));


// export async function createAction(formData: FormData) {
//   const { userId, orgId } = await auth();

//   // Creation disabled for demo
//   if ( userId !== process.env.ME_ID ) return;

//   if (!userId) {
//     return;
//   }

//   const value = Math.floor(
//     Number.parseFloat(String(formData.get("value"))) * 100,
//   );
//   const description = formData.get("description") as string;
//   const name = formData.get("name") as string;
//   const email = formData.get("email") as string;

//   const [customer] = await db
//     .insert(Customers)
//     .values({
//       name,
//       email,
//       userId,
//       organizationId: orgId || null,
//     })
//     .returning({
//       id: Customers.id,
//     });

//   const results = await db
//     .insert(Invoices)
//     .values({
//       value,
//       description,
//       userId,
//       customerId: customer.id,
//       status: "open",
//       organizationId: orgId || null,
//     })
//     .returning({
//       id: Invoices.id,
//     });

  

//   redirect(`/invoices/${results[0].id}`);
// }

// export async function updateStatusAction(formData: FormData) {
//   const { userId, orgId } = await auth();

//   // Updating disabled for demo
//   if ( userId !== process.env.ME_ID ) return;

//   if (!userId) {
//     return;
//   }

//   const id = formData.get("id") as string;
//   const status = formData.get("status") as Status;

//   if (orgId) {
//     await db
//       .update(Invoices)
//       .set({ status })
//       .where(
//         and(
//           eq(Invoices.id, Number.parseInt(id)),
//           eq(Invoices.organizationId, orgId),
//         ),
//       );
//   } else {
//     await db
//       .update(Invoices)
//       .set({ status })
//       .where(
//         and(
//           eq(Invoices.id, Number.parseInt(id)),
//           eq(Invoices.userId, userId),
//           isNull(Invoices.organizationId),
//         ),
//       );
//   }

//   revalidatePath(`/invoices/${id}`, "page");
// }

// export async function deleteInvoiceAction(formData: FormData) {
//   const { userId, orgId } = await auth();

//   // Deleting disabled for demo
//   if ( userId !== process.env.ME_ID ) return;

//   if (!userId) {
//     return;
//   }

//   const id = formData.get("id") as string;

//   if (orgId) {
//     await db
//       .delete(Invoices)
//       .where(
//         and(
//           eq(Invoices.id, Number.parseInt(id)),
//           eq(Invoices.organizationId, orgId),
//         ),
//       );
//   } else {
//     await db
//       .delete(Invoices)
//       .where(
//         and(
//           eq(Invoices.id, Number.parseInt(id)),
//           eq(Invoices.userId, userId),
//           isNull(Invoices.organizationId),
//         ),
//       );
//   }

//   redirect("/dashboard");
// }

// export async function createPayment(formData: FormData) {
//   // Payments disabled for demo
//   const { userId } = await auth();
//   if ( userId !== process.env.ME_ID ) return;

//   const headersList = headers();
//   const origin = (await headersList).get("origin");
//   const id = Number.parseInt(formData.get("id") as string);

//   const [result] = await db
//     .select({
//       status: Invoices.status,
//       value: Invoices.value,
//     })
//     .from(Invoices)
//     .where(eq(Invoices.id, id))
//     .limit(1);

//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product: "prod_QusOUzstGsvmvf",
//           unit_amount: result.value,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
//   });

//   if (!session.url) {
//     throw new Error("Invalid Session");
//   }

//   redirect(session.url);
// }












