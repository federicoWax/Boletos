import firebase from '../firebase/firebase';

class ServiceFirebase {
  async getCollection(collection: string) {
    return await firebase.firestore().collection(collection).get();
  }

  async getDoc(collection: string, id: string) {
    return await firebase.firestore().collection(collection).doc(id).get();
  }

  async addWithRelation(collection: string, data: any, relationCollection: string, propRelation: string, dataSubCollection: any[]) {
    const ref = await firebase.firestore().collection(collection).add(data);

    return await Promise.all(dataSubCollection.map((item) => firebase.firestore().collection(relationCollection).add({...item, [propRelation]: ref.id})));
  }

  async updateDoc(collection: string, id: string, data: any) {
    return await firebase.firestore().collection(collection).doc(id).update(data); 
  }

  async uploadFirebase(path: string, file: File) {
    try {
      const _file = await firebase.storage().ref(path + "/" + new Date().toString() + " - " + file.name ).put(file);
      return _file.ref.getDownloadURL();
    } catch (error) {
      return null;
    }
  }
} 

export default ServiceFirebase;