"use server";
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
// import { redirect } from 'next/dist/server/api-utils';
import { redirect } from "next/navigation";
import { error } from "console";
//import { signIn } from "next-auth/react";
import {signIn} from '@/auth'
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please enter a Customer. ',
  }),
  amount: z.coerce.number().gt(0, {message: 'Please enter an amount greater than $0.'}),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: 'Please select an invoice status'
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State ={
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
}
export async function createInvoice(priviteState: State, formData: FormData) {

  // const rawFormData ={
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // };
  // console.log(rawFormData);
  // console.log(typeof rawFormData.amount);

  const validatedFields = CreateInvoice.safeParse({
  //const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if(!validatedFields.success){
    return{
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice',
    };
  }

  const {customerId, amount, status} = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
  } catch (error) {
     return{
      message: 'Database Error: Failed to Create Invoice.',
     };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function UpdateInvoice(id: string, priviteState: State, formData: FormData) {
 const UpdateInvoiceSchema = FormSchema.omit({ date: true });

  const validatedFields = UpdateInvoiceSchema.safeParse({
    id,
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if(!validatedFields.success){
    return{
       errors: validatedFields.error.flatten().fieldErrors,
       message: 'Missing Fields to Update Invoce.'
    };
  }

  const {customerId, amount, status} = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
        
        UPDATE invoices
        
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} 
        WHERE id = ${id}
        
        `;
  } catch (error) {
    return{ message: 'Database Error: Failed to Update the Invoice'}
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  //throw new Error('Failed to Delete Invoice');
    try{
      await sql`DELETE FROM invoices  WHERE id = ${id};`;
      revalidatePath("/dashboard/invoices");
    }catch(error){
        console.error("Failed to delete Invoice:", error);
        throw new Error('Failed to Delete Invoice');

    }
}


export async function authenticate(priviteState: string | undefined, formData: FormData){
  
  try{
     await signIn('credentials', formData);
  }
  catch(error){
     if(error instanceof AuthError){
          switch(error.type){
            case 'CredentialsSignin':
              return 'Invalid credentials.';
              default:
                return 'Something went wrong.';
          }
     }
     throw error;
  }

}