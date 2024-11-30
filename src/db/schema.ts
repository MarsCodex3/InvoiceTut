//this page is used to create tables and values for our db using drizzle
import { integer, pgTable,serial,timestamp,text, pgEnum } from "drizzle-orm/pg-core";

import {AVAILABLE_STATUSES} from "@/data/invoices"

export type Status = typeof AVAILABLE_STATUSES[number]["id"] //accessing the array to  change status
const statuses = AVAILABLE_STATUSES.map(({id}) =>id)as Array<Status>

export const statusEnum =pgEnum("status", statuses as [Status, ...Array<Status>] )//what is an enum//check what this is exaactly doing

export const Invoices = pgTable('invoices',{
//this is for what data I would like to have so I want to have a date,name,email etc
id: serial("id").primaryKey().notNull(), //primary key uniqly idetifies each element//a unique value for evrey invoice
createTs: timestamp("createTs").defaultNow().notNull(),//not null means always a value//create time stamp
status: statusEnum("status").notNull(),
value: integer("value").notNull(),
description: text("description").notNull(),
userId: text("userId").notNull(),
organizationId:text("uorganizationId"),//thi is the field on our data for orgIDs
customerId: integer("customerId").notNull().references(()=> Customers.id)
})

/*"generate": "drizzle-kit generate" this is from drizzle
    "migrate": "drizzle-kit migrate"*/



//this table creates data for users and emails
    export const Customers = pgTable('customers',{
    id: serial("id").primaryKey().notNull(), //primary key uniqly idetifies each element//a unique value for evrey invoice
    createTs: timestamp("createTs").defaultNow().notNull(),//not null means always a value//create time stamp
    name: text("name").notNull(),
    email: text("email").notNull(),
    userId: text("userId").notNull(),
    organizationId:text("organizationId")
    })