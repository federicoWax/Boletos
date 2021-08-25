import { useEffect, useState } from "react";
import { FC } from "react";
import { Button, Spin, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import RafflesModal from './RafflesModal';
import { Raffle } from "./interfaces";
import firebase from "../../firebase/firebase";
import { Image } from "./interfaces";
import moment from "moment";


const columns = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Descripción',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Fecha de cierre',
    dataIndex: 'finalDate',
    key: 'finalDate',
    render: (finalDate: firebase.firestore.Timestamp) => <Typography.Text>{moment(finalDate.toDate()).format("DD/MM/YYYY")}</Typography.Text>,
  },
  {
    title: 'Imagen principal',
    dataIndex: 'image',
    key: 'image',
    render: (image: Image) => <img src={image.imageUrl} alt="imagenCarro" height={100} style={{ borderRadius: 30 }}/>,
  },
];

const Raffles: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  useEffect(() => {
    let mounted = true;

    const getData = async () => {
      if(mounted) {
        try {
          firebase.firestore().collection("raffles").onSnapshot((snapshot) => {
            if(!snapshot.empty) {
              setRaffles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Raffle))
            }
          });
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
      <br />
      <div style={{width: "100%"}}>
      {
        raffles.length
        ? <Table dataSource={raffles} columns={columns} />
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
