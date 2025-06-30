// // export default function InvoicePage() {
// //   return <p>Invoices Dashboard Page</p>;
// // }

// import Pagination from "@/app/ui/invoices/pagination";
// import Search from "@/app/ui/search";
// import Table from "@/app/ui/invoices/table";
// import { lusitana } from "@/app/ui/fonts";
// import { CreateInvoice } from "@/app/ui/invoices/buttons";
// import { Suspense } from "react";
// import { InvoiceSkeleton } from "@/app/ui/skeletons";
// import { fetchInvoicesPages } from "@/app/lib/data";
// import type { Metadata } from "next";

// interface PageProps{
//   searchParams?: {
//     query?: string;
//     page?: string;
//   };
//   }

// export default async function Page({searchParams}: PageProps)
//   {
//   // const searchParams = await props.searchParams;
//   const query = searchParams?.query || "";
//   const currentPage = Number(searchParams?.page) || 1;
//   const totalPages = await fetchInvoicesPages(query);

//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder="Search invoices.." />
//         <CreateInvoice />
//       </div>

//       <Suspense key={query + currentPage} fallback={<InvoiceSkeleton />}>
//         <Table query={query} currentPage={currentPage} />
//       </Suspense>

//       <div className="mt-5 flex justify-center">
//         <Pagination totalPages={totalPages} />
//       </div>
//     </div>
//   );
// }

import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { InvoiceSkeleton } from "@/app/ui/skeletons";
import { fetchInvoicesPages } from "@/app/lib/data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices.." />
        <CreateInvoice />
      </div>

      <Suspense key={query + currentPage} fallback={<InvoiceSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
