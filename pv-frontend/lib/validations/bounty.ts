import * as z from 'zod';

export const BountyValidation = z.object({
    bounty: z.string().min(1).min(3, { message: 'Minimum 3 characters'}),
    accountId: z.string(),
})

export const CommentValidation = z.object({
    bounty: z.string().min(1).min(3, { message: 'Minimum 3 characters'}),
})