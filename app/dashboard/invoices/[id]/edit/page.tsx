import { customers, invoices } from "@/app/lib/placeholder-data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
// import Form from "@/app/ui/invoices/create-form";
import Form from "@/app/ui/invoices/edit-form"
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function page(props: {params: Promise<{id: string}>}){
     
    const params = await props.params;
    const id = params.id;
    const[invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ])

    if (!invoice){
        notFound();
    }

    return(
        <main>
            <Breadcrumbs breadcrumbs={[
                {label: 'Invoice', href: '/dashboard/invoices'},
                {label: 'Edit Invoice', href: '/dashboard/invoics/${id}/edit', active: true,},  
            ]}/>
            {/* {<Form invoice={invoices} customers={customers}/> } */}
            <Form invoice={invoice} customers={customers}/>
        </main>
    );
}