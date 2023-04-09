import { z } from 'zod';

const RequestTransaction = z.object({
  order_id: z.string().min(8),
  gross_amount: z.number().gte(5000).lte(500000),
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  email: z.string().email()
});
const Transaction = z.object({
  redirect_url: z.string().url(),
  token: z.string().min(1)
});

type RequestTransactionType = z.infer<typeof RequestTransaction>;
type TransactionType = z.infer<typeof Transaction>;

export {
  RequestTransaction,
  Transaction,
  type RequestTransactionType,
  type TransactionType
};
