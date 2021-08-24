import firebase from '../firebase/firebase';

class ServiceFirebase {
  async getCollection(collection: string) {
    return await firebase.firestore().collection(collection).get();
  }
} 

export default ServiceFirebase;