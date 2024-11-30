import { clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

// const isprotected = createRouteMatcher([
//     //this array is to protect routes
//     "/dashboard",
//     "invoices/:invoiceId",//Dyanmic Id
//     "invoices/new"
//     ])

const isPublic = createRouteMatcher([
    //this is the oposite instead of protecting certain pages we are protecting everything and giving public routes instead
    "/",
    '/sign-in(.*)',//another route for the customsign in .*) to catch evrything
    '/sign-up(.*)',
    "/invoices/(.*)/payment"//makes the payment page public
    ])
//this function takes two arguments auth,reques
export default clerkMiddleware(async(auth,request)=>{
    //we need to pass in a function to our clerk middleware

    //this if will pass the argument of request object
    //if its not public
    if(!isPublic(request)){
    //     //if the route is protected, we need to check if the user is authenticated
        await auth.protect()
    }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};



// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'



// const publicRoutes = createRouteMatcher(["/"])
// //this is the new middleware for clerk
// export default clerkMiddleware(async (auth,request)=>{
//     if (!publicRoutes(request)) {
//         await auth.protect()
//       }
// })

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }

// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)'])

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     await auth.protect()
//   }
// })

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// }