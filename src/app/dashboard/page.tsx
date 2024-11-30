import { db } from "@/db";
import {auth} from "@clerk/nextjs/server"
import { cn } from "@/lib/utils";
import  {Invoices,Customers}  from "@/db/schema";
import { CirclePlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Container from "@/components/Container"
import {eq,and,isNull} from 'drizzle-orm'//this is the equals function used to filter out the data based on user id
  

export default async function Dashboard() {
  const {userId, orgId} = await auth()//this is so that the data dosent merge with the other users and have to doit in every page I want to separet user data 
  //if else statement to retrict the data shwing in some organizations
  if (!userId) return;//if user Id dosent exist

  let results;

  if(orgId){
     results = await db.select()
    .from(Invoices) // this is so that we can render our table dta base in the static table and make it dynamic
    .innerJoin(Customers,eq(Invoices.customerId,Customers.id))
    .where(eq(Invoices.organizationId,orgId))//equals function eq()
    //cheks that all the invoices has the same orgId
  }else{
     results = await db.select()
    .from(Invoices) // this is so that we can render our table dta base in the static table and make it dynamic
    .innerJoin(Customers,eq(Invoices.customerId,Customers.id))
    .where(
      and(
      eq(Invoices.userId,userId),

      isNull(Invoices.organizationId)//Checks that the org ID is null
    )
    )//equals function eq()
  }

 const invoices = results?.map(({invoices, customers})=> {
    /// this is so that the email and name data will display in the dashboard
    return{
    ...invoices,
    customer: customers
    
  };
});



  return (
    <main className=" h-full">
      <Container>{/*this coinater is the thing we created to adjust the header so I can get rid of the max-w-5xl mx-auto from abaove*/}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p>
          <Button className="inline-flex gap-2" variant="ghost" asChild>
            <Link href="/invoices/new">
              <CirclePlus className="h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </p>
      </div>
      <Table>
        {/*this is a shadcn component table its the table you see to manage the invoices*/}
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] p-4">Date</TableHead>
            <TableHead className="p-4">Customer</TableHead>
            <TableHead className="p-4">Email</TableHead>
            <TableHead className="text-center p4">Status</TableHead>
            {/*this is the colum that will be created*/}
            <TableHead className="text-right p-4">
              {/*padding adjustment*/}
              Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {invoices.map((result) => {
            {/*this results.map take the data from the db and presents it in the html and css table cell*/}
            return (
              <TableRow key={result.id}>
                {/*I need to have the key = results.id which is the id we created for the database and the css field below*/}
                <TableCell className="font-medium text-left p-0">
                  <Link
                    href={`/invoices/${result.id}`}
                    className="block p-4 font-semibold"
                  >
                    {new Date(result.createTs).toLocaleDateString()}
                    {/*dynamic date*/}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-0">
                  <Link
                    href={`/invoices/${result.id}`}
                    className="block p-4 font-semibold"
                  >
                    {result.customer.name}{/*name rendered dynamically*/}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-0">
                  <Link href={`/invoices/${result.id}`} className="block p-4">
                    {/*span controls the specific text*/}
                    {result.customer.email} 
                  </Link>
                </TableCell>
                <TableCell className="text-center p-0">
                  <Link className="block p-4" href={`/invoices/${result.id}`}>
                    <Badge className={cn("rounded-full Capitalize",
result.status === "open" && "bg-blue-500",
result.status === "paid" && "bg-green-500",
result.status === "void" && "bg-yellow-500",
result.status === "uncollectible" && "bg-red-500"//cn is for adding dynamic actions
          )}>
                      {/*this is the pill for the open*/}
            {result.status}
                      {/*this is the id/status we gave to our database in place of the static open text*/}
                    </Badge>
                  </Link>
                </TableCell>
                {/*this data needs to generate dynamicaly*/}
                <TableCell className="text-right p-0">
                  <Link
                     href={`/invoices/${result.id}`}
                    className="block p-4 font-semibold"
                  >
                    ${(result.value / 100).toFixed(2)}
                    {/*we need to dived it by 100 because we are saving it as int times 100 */}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
          {/*this is so that the data can be looped and presented in the front end*/}
        </TableBody>
      </Table>
      </Container>
    </main>
  );
}
