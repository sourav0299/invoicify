   import Link from 'next/link';
   import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
   import { auth } from "@clerk/nextjs/server";
   
   const Navbar = async () => {
     const { userId } = await auth();
   
     return (
       <nav className="bg-gray-800 text-white p-4">
         <div className="container mx-auto flex justify-between items-center">
           <Link href="/" className="text-xl font-bold">
             Invoicefy
           </Link>
           <div className="space-x-4">
             <Link href="/" className="hover:text-gray-300">
               Home
             </Link>
             <Link href="/dashboard" className="hover:text-gray-300">
               Dashboard
             </Link>
             <Link href="/invoices" className="hover:text-gray-300">
               Invoices
             </Link>
           </div>
           <div>
             {userId ? (
               <div className="flex items-center space-x-4">
                 <UserButton afterSignOutUrl="/" />
                 <SignOutButton>
                   <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                     Sign out
                   </button>
                 </SignOutButton>
               </div>
             ) : (
               <SignInButton mode="modal">
                 <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                   Sign in
                 </button>
               </SignInButton>
             )}
           </div>
         </div>
       </nav>
     );
   };
   
   export default Navbar;