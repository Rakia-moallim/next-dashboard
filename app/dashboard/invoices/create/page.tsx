import { fetchCustomers } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/invoices/create-form";



export default async function Page(){
  const customers = await fetchCustomers();
  return (
    <main>
        <Breadcrumbs breadcrumbs={[{label: 'Invoice', href: '/dashboard/invoices'},
        {label: 'Create Invoice', href: '/dashboard/invoices', active: true,},
        ]}/>
        {/* <form customers={customers}/> */}
        <Form customers={customers}/>
    </main>
  );
}