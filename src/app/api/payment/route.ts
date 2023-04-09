import { NextResponse } from "next/server";

type RequestData = {
  order_id: string;
  gross_amount: number;
  first_name: string;
  last_name: string;
  email: string;
};

type Transaction = {
  redirect_url: string;
  token: string;
};

export async function POST(request: Request) {
  try {
    const reqData: RequestData = await request.json();
    const midtransClient = require("midtrans-client");
    const snap = new midtransClient.Snap({
      isProduction: process.env.IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });
    const transaction: Transaction = await snap.createTransaction({
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
    return NextResponse.json({
      ...transaction,
      error: false,
      error_message: null,
    });
  } catch (err) {
    console.debug('err');
    console.debug(err);
    return NextResponse.json({
      error: true,
      error_message: "Unable to connect to Payment Service",
      data: null,
    });
  }
}
