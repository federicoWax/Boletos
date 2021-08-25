
import firebase from "../../firebase/firebase";

export interface Promotion {
  description: string,
  discount: number | string,
  countTickets: number | string
}
  
export interface Ticket {
  number: number,
  buyer: string,
  status: string
}

export interface PaymentMethod {
  typePayment: string,
  description: string,
  number: string
}
  
export interface Image {
  imageUrl: string,
  imagePath: string,
}
   
export interface Raffle {
  id: string;
  name: string;
  description: string;
  finalDate: firebase.firestore.Timestamp | null,
  promotions: Promotion[],
  paymentMethods: PaymentMethod[],
  images: Image[],
  image: Image | File| null | undefined,
  active: boolean,
  priceTicket: number,
  countTickets: number | string
}