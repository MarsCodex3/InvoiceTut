import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import {eq,and,isNull} from "drizzle-orm"
import { notFound } from "next/navigation";
import {auth} from "@clerk/nextjs/server"
import Invoice from "./Invoices";

//cehck what is this InvoicePage({params}: {params: {invoiceId}}
export default async function InvoicePage({ params }: { params: { invoiceId: string } }) {
  const { invoiceId } = await params; // Await the params object before using its properties NEW
  const {userId,orgId} = await auth()//this is so that the data dosent merge with the other users and have to doit in every page I want to separet user data 
  if (!userId) return;//if user Id dosent exist
  const parsedInvoiceId = parseInt(invoiceId); // Then parse the invoiceId as a number NEW
  //const invoiceId = await parseInt(params.invoiceId)//we are wrapping it because we want to use it as number OLD COBY FAYOCK WAY
  
  if (isNaN(/*invoiceId*/ parsedInvoiceId)){
    throw new Error("Invalid Invoice ID")
  }

  //this if is to check whcih invoices to create to send ti each org

  let result;
if(orgId){
   [result] = await db.select()
  .from(Invoices)
  .innerJoin(Customers,eq(Invoices.customerId,Customers.id))//combining the tables to present the data
  .where(
    and(//because we are going to be doing more than just equaling
    eq(Invoices.id, /*invoiceId*/parsedInvoiceId),
    eq(Invoices.organizationId,orgId)// the reason that works it because it looks for a user Id row and then looks for the invoice number and since there is no result we give the error 
    )
  )
  .limit(1)//because we shoudl only have one result //eq is from drizzle and this is trying to find/get the Id from invoices
}else{
  [result] = await db.select()
  .from(Invoices)
  .innerJoin(Customers,eq(Invoices.customerId,Customers.id))//combining the tables to present the data
  .where(
    and(//because we are going to be doing more than just equaling
    eq(Invoices.id, /*invoiceId*/parsedInvoiceId),
    eq(Invoices.userId,userId),// the reason that works it because it looks for a user Id row and then looks for the invoice number and since there is no result we give the error 
    isNull(Invoices.organizationId)
    )
  )
  .limit(1)//because we shoudl only have one result //eq is from drizzle and this is trying to find/get the Id from invoices
}


 
  console.log("result",result)

  if(!result){
    notFound()//if resultn not found give 404
  }

  const invoice = {//this is to unest the data 
    ...result.invoices,
    customer: result.customers
  }

  return <Invoice invoice={invoice}/> // we are using the recent page we created to bring the ui since its a cleint comenent and this page is server side
}
