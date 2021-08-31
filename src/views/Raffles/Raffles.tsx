import { FC, useEffect, useState } from "react";
import moment from "moment";
import { Button, Switch, Table, Typography, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import RafflesModal from './RafflesModal';
import { Raffle, RaffleEditFirebase, Image, RaffleFirebase } from "./interfaces";
import firebase from "../../firebase/firebase";
import RafflesModalEdit from "./RafflesModalEdit";
import { MdConfirmationNumber } from 'react-icons/md';
import { useHistory } from "react-router";

const { confirm } = Modal;

const Raffles: FC = () => {
  const history = useHistory();
  const [open, setOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [raffle, setRaffle] = useState<RaffleEditFirebase | null>(null);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
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
      render: (finalDate: firebase.firestore.Timestamp) => <Typography.Text>{moment(finalDate.toDate()).format("DD/MM/YYYY hh:mm a")}</Typography.Text>,
    },
    {
      title: 'Imagen principal',
      dataIndex: 'image',
      key: 'image',
      render: (image: Image) => <img src={image.imageUrl} alt="imagenCarro" height={100} style={{ borderRadius: 30 }}/>,
    },
    {
      title: 'Activa',
      dataIndex: 'active',
      key: 'edit',
      render: (_: any, item: RaffleEditFirebase) => <Switch checked={item.active} onChange={async () => {
        await firebase.firestore().collection("raffles").doc(item.id).update({active: !item.activeDate});
      }} />,
    },
    {
      title: 'Fecha activa',
      dataIndex: 'activeDate',
      key: 'edit',
      render: (_: any, item: RaffleEditFirebase) => <Switch checked={item.activeDate} onChange={async () => {
        await firebase.firestore().collection("raffles").doc(item.id).update({activeDate: !item.activeDate});
      }} />,
    },
    {
      title: 'Boletos',
      dataIndex: 'activeDate',
      key: 'edit',
      render: (_: any, item: RaffleEditFirebase) => <MdConfirmationNumber onClick={() => history.push("/boletos/" + item.id)} />
    },
    {
      title: 'Editar',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, item: RaffleEditFirebase) => <EditOutlined onClick={() => { setOpenEdit(true); setRaffle(item); }} />,
    },
    {
      title: 'Eliminar',
      dataIndex: 'delete',
      key: 'delete',
      render: (_: any, item: RaffleEditFirebase) => <DeleteOutlined onClick={() => { setOpenDelete(true); showConfirm(item); }} />,
    },
  ];

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
        } 
      } 
    }

    getData();

    return () => { mounted = false };
  }, []);

  
  function showConfirm(raffle: RaffleEditFirebase) {

    confirm({
      visible: openDelete,
      title: '¿Seguro que desea borrar este Rifa?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: "Aceptar",
      cancelText: "Cancelar",
      async onOk() {
        if(deleting) return;

        try {
          setDeleting(true);

          const tickets = await firebase.firestore().collection("tickets").where("raffleId", "==", raffle.id).get();

          await Promise.all(tickets.docs.map(doc => firebase.firestore().collection("tickets").doc(doc.id).delete()));

          await firebase.firestore().collection("raffles").doc(raffle.id).delete();

          message.success("Rifa eliminada con exito");
        } catch (error) {
          console.log(error);
        } finally {
          setDeleting(false);
          setOpenDelete(false);
        }
      },
    });
  }

  return (
    <div style={{ padding: 30 }}>
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
        ? <Table rowKey="id" dataSource={raffles} columns={columns} style={{overflowX: "auto"}}/>
        : <div style={{textAlign: "center", marginTop: 250}}> Sin Rifas Registradas </div>
      }
      </div>
      <RafflesModal 
        open={open}  
        onClose={() => setOpen(false)}
      />
      <RafflesModalEdit 
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        raffleProp={raffle}
      />
    </div>
  )
}

export default Raffles
