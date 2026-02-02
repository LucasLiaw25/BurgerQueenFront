export interface PixRequest {
  orderId: number;
}

export interface PaymentDTO {
  id: number;
  txid: string;
  status: string;
  link: string;
}