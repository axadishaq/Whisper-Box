import { ArrowLeft } from "lucide-react";
import Link from "next/link";
const NotFound = () => {
   return (
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
         <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
               404
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-muted-foreground md:text-4xl dark:text-white">
               Something&apos;s missing.
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
               Sorry, we can&apos;t find that page. You&apos;ll find lots to
               explore on the home page.
            </p>
            <Link
               href="/"
               className="inline-flex gap-2 border font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">
               <ArrowLeft /> Back to Homepage
            </Link>
         </div>
      </div>
   );
};

export default NotFound;
