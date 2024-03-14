"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { 
    Form,
     FormControl,
     FormDescription,
     FormField,
     FormItem,
    FormLabel,
    FormMessage
} from '../ui/form'
import { Textarea } from '../ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
// import { UserValidation } from '../../lib/validations/user'
import * as z from "zod"
// import { updateUser } from '../../lib/actions/user.actions'
import { usePathname, useRouter } from 'next/navigation'
import { BountyValidation } from '../../lib/validations/bounty'
import { createBounty } from '../../lib/actions/bounty.actions'

interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string
    },
    btnTitle: string
}
    

function PostBounty({ userId }: {userId: string}) {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(BountyValidation),
        defaultValues: {
            bounty:'',
            accountId: userId,
        }
    })

    const onSubmit = async (values: z.infer<typeof BountyValidation>) => {
       await createBounty({
        text: values.bounty,
        author: userId,
        communityId: null,
        path: pathname
       })

       router.push('/')
    }


  return (
    <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className=" mt-10 flex flex-col justify-start gap-10"
        >

<FormField
                    control={form.control}
                    name="bounty"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                            <FormLabel className="text-base-semibold text-light-2">
                               Content
                            </FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                <Textarea
                                rows={15} 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            <Button type="submit"
            className="bg-primary-500">
              Post Bounty
            </Button>
        </form>
    </Form>
  )
}

export default PostBounty;