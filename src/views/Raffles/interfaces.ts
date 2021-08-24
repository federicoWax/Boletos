
import firebase from "../../firebase/firebase";

export interface Promotion {
  description: string,
  discount: number,
  countTickets: number
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
  finalDate: firebase.firestore.Timestamp,
  promotions: Promotion[],
  tickets: Ticket[],
  payments: PaymentMethod[],
  images: Image[],
  image: Image,
  status: boolean
}