import { useEffect, useState } from "react";
import { FC } from "react";
import { Button, Spin } from 'antd';
import ServiceFirebase from "../../services/firebase";
import { PlusOutlined } from '@ant-design/icons';
import RafflesModal from './RafflesModal';
import { Raffle } from "./interfaces";


const Raffles: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  useEffect(() => {
    let mounted = true;

    const getData = async () => {
      if(mounted) {
        try {
          const serviceFirebase = new ServiceFirebase(); 
          const docsTickets = await serviceFirebase.getCollection("tickets");

          if(!docsTickets.empty) {
            setRaffles(docsTickets.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Raffle))
          }

        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } 
    }

    getData();

    return () => { mounted = false };
  }, []);

  if(loading) return <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      WebkitTransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
    }}>    
      <Spin tip="Cargando..." />
    </div>

  return (
    <>
      <div style={{width: "100%"}}>
        <Button 
          style={{float: "right"}} 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Agregar Rifa
        </Button>
      </div>
      <br />
      <div style={{width: "100%"}}>
      {
        raffles.length
        ? <div>raffles</div>
        : <div style={{textAlign: "center", marginTop: 250}}> Sin Rifas Registradas </div>
      }
      </div>
      <RafflesModal 
        open={open}  
        onClose={() => setOpen(false)}
      />
    </>
  )
}

export default Raffles
