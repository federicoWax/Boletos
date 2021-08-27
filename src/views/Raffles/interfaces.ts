
import firebase from "../../firebase/firebase";

export interface Promotion {
  description: string,
  discount: number | string,
  countTickets: number | string,
}
  
export interface Ticket {
  number: number,
  buyer: string,
  status: string,
  reservationDate: firebase.firestore.Timestamp | null,
  phone: number | null
}

export interface TicketFirebase {
  id: string,
  number: number,
  buyer: string,
  status: string,
  reservationDate: firebase.firestore.Timestamp | null,
  phone: number | null,
  raffleId: string,
  selected: boolean
}
export interface Image {
  imageUrl: string,
  imagePath: string,
}
   
export interface Raffle {
  id?: string;
  name: string;
  description: string;
  finalDate: firebase.firestore.Timestamp | null,
  promotions: Promotion[],
  images: Image[],
  image: Image | File| null | undefined,
  active: boolean,
  priceTicket: number,
  countTickets: number | string,
}

export interface RaffleFirebase {
  id: string;
  name: string;
  description: string;
  finalDate: firebase.firestore.Timestamp | null,
  promotions: Promotion[],
  images: Image[],
  image: Image | File| null | undefined,
  active: boolean,
  priceTicket: number,
  countTickets: number | string,
  tickets: TicketFirebase[],
}