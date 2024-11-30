import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (

      <main className="flex flex-col justify-center items-center text-center min-h-screen max-w-5xl mx-auto gap-6" >
        <h1 className="text-5xl font-bold">
          Invoice
          </h1>
        <p>
        
          <Button asChild>{/*this is the sign in button the aschild passes all the features down*/}
            <Link href="/dashboard">
              Sign In 
            </Link>
          </Button>
        </p>
      </main>
  );
}
