import moment from 'moment';
import { FC, useEffect, useState } from 'react'
import logoLogin from '../../assets/login.jpg';
import firebase from "../../firebase/firebase";
import { Raffle, Image } from '../Raffles/interfaces';

const Home: FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  useEffect(() => {
    let mounted = true;

    const getData = async () => {
      if(mounted) {
        try {
          firebase.firestore().collection("raffles")
          .where("finalDate", ">", firebase.firestore.Timestamp.now())
          .onSnapshot((snapshot) => {
            if(!snapshot.empty) {
              setRaffles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Raffle))
            }
          });
        } catch (error) {
          console.log(error);
        } 
      } 
    }

    getData();

    return () => { mounted = false };
  }, []);

  return (
    <div style={{color: "white", backgroundColor: "orangered"}}>
      <div style={{textAlign: "center", width: "100%", backgroundColor: "black"}}>
        <img alt="rifas-login" height={100} style={{ }} src={logoLogin}/>
      </div>
      <div>
      {
         
          raffles.length
          ?
            raffles.map((raffle: Raffle)  => (
              <div key={raffle.id}>
                <div style={{textAlign: "center", fontSize: 30, fontWeight: "bold"}}>
                  { raffle.name.toUpperCase() }
                </div>
                <div style={{textAlign: "center", fontSize: 20, fontWeight: "bold"}}>
                  { raffle.description.toUpperCase() }
                </div>
                <div>
                  <img src={(raffle.image as Image).imageUrl} alt="imagenCarro" height={250} style={{width: "100%", objectFit: "fill"}}/>
                </div>
                <div style={{textAlign: "center", fontSize: 20, fontWeight: "bold"}}>
                  Precio Boleto: ${ raffle.priceTicket.toString().toUpperCase() }
                  <br/>
                  Fecha del sorteo: { moment(raffle.finalDate?.toDate()).format("DD/MM/YYYY") }
                </div>

              </div>
            ))
          :

            <div style={{textAlign: "center", marginTop: 250}}> Sin Rifas Registradas </div>
      }
      </div>
    </div>
  )
}

export default Home
