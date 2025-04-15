/* eslint-disable no-unused-vars */
declare module 'sslcommerz-lts' {
  export interface InitApiResponse {
    status: string;
    failedreason: string;
    sessionkey: string;
    GatewayPageURL: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: unknown;
  }

  export interface RefundRequestPayload {
    tran_id: string;
    refund_amount: number;
    refund_remarks?: string;
  }

  export interface RefundResponse {
    status: string;
    refund_ref_id?: string;
    failedreason?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: unknown;
  }

  export default class SSLCommerzPayment {
    constructor(storeId: string, storePassword: string, isLive: boolean);

    init(data: object): Promise<InitApiResponse>;

    validate(
      orderId: string,
      amount: number,
      currency: string,
    ): Promise<object>;

    transactionQuery(orderId: string): Promise<object>;

    transactionQueryByTransactionId(payload: {
      tran_id: string;
    }): Promise<unknown>;

    refundTransaction(payload: RefundRequestPayload): Promise<RefundResponse>; // <-- Add this line
  }
}
