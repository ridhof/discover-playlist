import {
  RequestTransaction,
  RequestTransactionType,
  Transaction,
  TransactionType
} from '../../schema/index';

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const reqData: RequestTransactionType = await request.json();
    RequestTransaction.parse(reqData);
    const midtransClient = require("midtrans-client");
    const snap = new midtransClient.Snap({
      isProduction: process.env.IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });
    const transaction: TransactionType = await snap.createTransaction({
      transaction_details: {
        order_id: reqData.order_id,
        gross_amount: reqData.gross_amount
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: reqData.first_name,
        last_name: reqData.last_name,
        email: reqData.email
      },
    });
    Transaction.parse(transaction);
    return NextResponse.json({
      ...transaction,
      error: false,
      error_message: null,
    });
  } catch (err) {
    return NextResponse.json({
      error: true,
      error_message: "Unable to connect to Payment Service",
      data: null,
    });
  }
}
