"use client";
import { useOptimistic } from "react";
import { Customers, Invoices } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { updateStatusAction, deleteInvoiceAction } from "@/app/action";
import { ChevronDown, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import Container from "@/components/Container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface InvoiceProps {
  invoice: typeof Invoices.$inferSelect & {
    customer: typeof Customers.$inferSelect//we are now updating the data  user clinet components
}}
export default function Invoice({ invoice }: InvoiceProps) {
  //this will be the client side and the page.tsx is the server compenents
  //async is not supported for client compontsents
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => {
      return String(newStatus);
      // this is so that is returns the status super fast without lag
    }
  );

  async function handleOnUpdateStatus(formData: FormData) {
    const originalStatus = setCurrentStatus;
    setCurrentStatus(formData.get("status")); //this gets the status data with optimistic
    try {
      await updateStatusAction(formData);
    } catch (e) {
      console.error(e);
      setCurrentStatus(originalStatus);
    }
  }

  return (
    <main className="w-full h-full ">
      <Container>
        <div className="flex justify-between mb-8">
          <h1 className="flex items-center gap-4 text-3xl font-bold">
            Invoices {invoice.id}
            <Badge
              className={cn(
                "rounded-full Capitalize",
                currentStatus === "open" && "bg-blue-500", //where invoice.status is we can replaces it with currentStatus
                currentStatus === "paid" && "bg-green-500",
                currentStatus === "void" && "bg-yellow-500",
                currentStatus === "uncollectible" && "bg-red-500" //cn is for adding dynamic actions
              )}
            >
              {currentStatus}
            </Badge>
          </h1>
          <div className="flex gap-4">
            <DropdownMenu>
              {/* Use a div instead of a button for the trigger */}
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2" variant="outline">
                  Change Status
                  <ChevronDown className="w-4 h-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {AVAILABLE_STATUSES.map((status) => {
                  return (
                    <DropdownMenuItem key={status.id}>
                      <form action={handleOnUpdateStatus}>
                        {/*{/*the change of status action is casted*/}
                        <input type="hidden" name="id" value={invoice.id} />
                        {/*the hidden input field is used to send the id of the invoice when you submit the form //we are grabbing the id to identify whcih invoice status are we updating*/}
                        <input type="hidden" name="status" value={status.id} />
                        {/*grabbing the status from our db*/}
                        <button>{status.label}</button>
                      </form>
                      {/*everytime we click on the dropdown menu it will render or update the status */}
                    </DropdownMenuItem> /*rendering the status lable*/
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/*dialog box to confirm deletion */}
            <Dialog>
              <DropdownMenu>
                {/* we are using this dropdown for delete*/}
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2" variant="outline">
                    <span className="sr-only">More Options</span>
                    <Ellipsis className="w-4 h-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                  <DialogTrigger asChild>
                     {/*the hidden input field is used to send the id of the invoice when you submit the form //we are grabbing the id to identify whcih invoice status are we updating*/}
                     <button className="flex items-center gap-2">
                        <Trash2 className="w-4 h-auto" />
                        Delete Invoice
                        </button>
                  </DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  
                     {/*this will take you to the public invoice*/}
                     <Link href={`/invoices/${invoice.id}/payment`} className="flex items-center gap-2">
                        <CreditCard className="w-4 h-auto" />
                        Payment
                        </Link>
                
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="bg-white">
                <DialogHeader >
                  <DialogTitle className="text-2xl">
                   Delete Invoice?
                    </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your invoice and remove your data from our servers.
                  </DialogDescription>
                  <DialogFooter>
                  <form className="flex justify-center"action={deleteInvoiceAction}>
                      {/*{/*the change of status action is casted*/}
                      <input type="hidden" name="id" value={invoice.id} />
                      <Button variant="destructive" className="flex items-center gap-2">
                        <Trash2 className="w-4 h-auto" />
                        Delete Invoice
                        </Button>
                    </form>
                    {/*everytime we click on the dropdown menu it will render or update the status */}
                    </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          <p></p>
        </div>
        <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>

        <p className="text-lg mb-8">
          {invoice.description}
          {/*this is the decription from our database*/}
        </p>
        <h2 className="font-bold text-lg mb-4">Billing Details</h2>

        <ul>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoice.id}</span>{" "}
            {/*check why is he using this instead.id*/}
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <span>{invoice.customer.name}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Email
            </strong>
            <span>{invoice.customer.email}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
