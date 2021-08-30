import { FC, useEffect, useState } from 'react';
import { AlignLeftOutlined } from '@ant-design/icons';
import { Input, Select, Table, Typography } from 'antd';
import firebase, { RootState } from '../../firebase/firebase';
import { RaffleFirebase, TicketFirebase } from '../Raffles/interfaces';
import moment from 'moment';
import { OrderByOptions, useFirestoreConnect, WhereOptions } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import TicketsModal from './TicketsModal';
import { RouteComponentProps } from 'react-router-dom';

const { Option } = Select;

interface MatchParams {
  raffleId: string;
}

const Tickets: FC<RouteComponentProps<MatchParams>> = ({match}) => {
  const [ticket, setTicket] = useState<TicketFirebase | null>(null);
  const [search, setSearch] = useState<string>("");
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [tickets, setTickets] = useState<TicketFirebase[]>([]);
  const [ticketsSearch, setTicketsSearch] = useState<TicketFirebase[] | null>(null);
  const [where, setWhere] = useState<WhereOptions[]>([["number", ">", 0], ["raffleId", "==", match.params.raffleId]]);
  const [orderBy, setOrderBy] = useState<OrderByOptions>(['number', 'asc']);
  const [startAt, setStartAt] = useState(1);
  useFirestoreConnect(() => [{ collection: 'tickets', where: where,  orderBy: orderBy, startAt: startAt, limit: 10 }]);
  const selectorTickets = useSelector((state: RootState) => state.firestore.ordered.tickets) as TicketFirebase[];

  const columns = [
    {
      title: 'Sorteo',
      dataIndex: 'raffle',
      key: 'raffle',
      render: (raffle: RaffleFirebase) => raffle?.name
    },
    {
      title: 'Numero',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Comprador',
      dataIndex: 'buyer',
      key: 'buyer',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Fecha de reserva',
      dataIndex: 'reservationDate',
      key: 'reservationDate',
      render: (reservationDate: firebase.firestore.Timestamp | null) => <Typography.Text>
        { reservationDate ? moment(reservationDate.toDate()).format("DD/MM/YYYY hh:mm a") : "Sin reserva" }
      </Typography.Text>,
    },
    {
      title: 'Recibo',
      dataIndex: 'payInfo',
      key: 'payInfo', 
      render: (_: any, item: TicketFirebase) =>  item.status === "Pagado" && <AlignLeftOutlined onClick={() => { setTicket(item); setOpenInfo(true); }} />
    },
    {
      title: 'Estatus',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, item: TicketFirebase) => {
        const now = moment();
        const diff = item.reservationDate && item.status !== "Pagado" ? now.diff(moment(item.reservationDate.toDate()), "days") : null;
  
        return <Select value={diff ? "Vencido" : status} style={{width: 200}} onChange={async (value: string) => {
          try {
            await firebase.firestore().collection("tickets").doc(item.id)
              .update(value === "Libre" ? { status: value, reservationDate: null, buyer: "", phone: null } : {status: value} );
          } catch (error) { 
            console.log(error);
          }
        }}>
          <Option value="Libre">Libre</Option>
          <Option value="Reservado" disabled>Reservado</Option>
          <Option value="Vencido" disabled style={{color: "red"}}>Vencido</Option>
          <Option value="Pagado" disabled={item.status === "Libre"}>Pagado</Option>
        </Select>
      },
    }, 
  ];

  useEffect(() => {
    if(selectorTickets) {
      const getData = async () => {
        const _tickes = await Promise.all(selectorTickets.map(async (ticket) => {
          const raffle = await firebase.firestore().collection("raffles").doc(ticket.raffleId).get();

          return {...ticket, raffle: { id: raffle.id, ...raffle.data() } as RaffleFirebase }
        }));

        setTickets(_tickes);
      }

      getData();
    }
  }, [selectorTickets]);

  const onChangeFilter = (value: string) => {
    setTickets([]);

    if(value === "Vencidos") {
      setOrderBy(['reservationDate', 'asc']);

      setWhere([
      ["reservationDate", "!=", null], 
      ["reservationDate", "<", firebase.firestore.Timestamp.fromDate(new Date(moment().add(-1, "days").toDate()))],
      ["raffleId", "==", match.params.raffleId]
    ]);
    } else {
      setOrderBy(['number', 'asc']);
      setWhere(
        value 
        ? [["status",  "==" , value], ["raffleId", "==", match.params.raffleId]]
        : [["number", ">", 0], ["raffleId", "==", match.params.raffleId]]
      )
    }
  }

  const onSearch = async () => {
    const docsTickes = await firebase.firestore().collection("tickets").where("number", "==", parseInt(search)).get();

    const _tickes = await Promise.all(docsTickes.docs.map(async (ticket) => {
      const raffle = await firebase.firestore().collection("raffles").doc(ticket.data().raffleId).get();

      return { id:ticket.id, ...ticket.data(), raffle: { id: raffle.id, ...raffle.data() } as RaffleFirebase } as TicketFirebase
    }));

    setTicketsSearch(_tickes);
  }

  return (
    <div style={{marginTop: 20, padding: 20}}>
      Filtro de tickets
      <br />
      <Select defaultValue="Todos" placeholder="Filtrar por" style={{width: 120}} onChange={onChangeFilter}>
        <Option value={0}>Todos</Option>
        <Option value="Libre">Libres</Option>
        <Option value="Reservado">Reservados</Option>
        <Option value="Vencidos">Vencidos</Option>
        <Option value="Pagado">Pagados</Option>
      </Select>
      <br />
      <br />
      <Input.Search 
        enterButton 
        onSearch={onSearch} 
        onChange={e => {
          if(!e.target.value) {
            setTicketsSearch(null);
          }
          
          setSearch(e.target.value) 
        }}
        placeholder="Buscar por número" 
      />
      {
        search && ticketsSearch !== null
        ?
          <Table 
            rowKey="id" 
            dataSource={ticketsSearch} 
            columns={columns} 
            style={{overflowX: "auto", marginTop: 20}}
            pagination={false}
          />
        :
          <Table 
            rowKey="id" 
            dataSource={tickets} 
            columns={columns} 
            style={{overflowX: "auto", marginTop: 20}}
            pagination={{
              total: 5000,
              pageSize: 10,
              onChange: (page) => {
                if(page === 1) {
                  setStartAt(page);
                } else {
                  let _startAt = (page -1).toString();
                  setStartAt(parseInt(_startAt + "0"))
                }
              }
            }}
          />
      }
      <TicketsModal 
        open={openInfo} 
        onClose={() => setOpenInfo(false)} 
        ticket={ticket}
      />
    </div>
  )
}

export default Tickets;
