import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from 'pg';
import { Invoices,Customers } from "@/db/schema";


const pool = new Pool({ 
    connectionString: process.env.XATA_DATABASE_URL,//this is how to connect my xata url to this file 
    max: 20
});
//these are the tables being created in the schema.ts file
export const db = drizzle(pool,{
    schema:{
        Invoices,//invoices is the exported function fron schema.ts
        Customers
        }

});//need to export because then it needs to be imported to the other files