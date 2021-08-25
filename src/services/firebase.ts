import firebase from '../firebase/firebase';

class ServiceFirebase {
  async getCollection(collection: string) {
    return await firebase.firestore().collection(collection).get();
  }

  async add(collection: string, data: any, subCollection: string, dataSubCollection: any[]) {
    const ref = await firebase.firestore().collection(collection).add(data);

    await Promise.all(dataSubCollection.map((item) => ref.collection(subCollection).add(item)));
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