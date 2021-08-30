import firebase from "../../firebase/firebase";

export interface Promotion {
  description: string;
  price: number | string;
  countTickets: number | string;
}
  
export interface Ticket {
  number: number;
  buyer: string;
  status: string;
  reservationDate: firebase.firestore.Timestamp | null;
  phone: number | null;
  state: string;
}

export interface TicketFirebase {
  id: string;
  number: number;
  buyer: string;
  status: string;
  reservationDate: firebase.firestore.Timestamp | null;
  phone: number | null;
  raffleId: string;
  selected: boolean;
  raffle: RaffleFirebase;
  state: string
}
export interface Image {
  imageUrl: string;
  imagePath: string;
}
   
export interface Raffle {
  id?: string;
  name: string;
  description: string;
  finalDate: firebase.firestore.Timestamp | null;
  promotions: Promotion[];
  images: Image[];
  image: Image | File| null | undefined;
  active: boolean;
  priceTicket: number;
  countTickets: number | string;
  activeDate: boolean;
}

export interface RaffleFirebase {
  id: string;
  name: string;
  description: string;
  finalDate: firebase.firestore.Timestamp | null;
  promotions: Promotion[];
  images: Image[];
  image: Image | File| null | undefined;
  active: boolean;
  priceTicket: number;
  countTickets: number | string;
  tickets: TicketFirebase[];
  activeDate: boolean;
}

export interface RaffleEditFirebase {
  id?: string;
  name: string;
  description: string;
  finalDate: firebase.firestore.Timestamp | null;
  promotions: Promotion[];
  images: Image[];
  image: Image | File | null | undefined;
  active: boolean;
  priceTicket: number;
  activeDate: boolean;
}