import { FC, useEffect, useState } from 'react';
import { AlignLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Input, Row, Col, message } from 'antd';
import firebase, { RootState } from '../../firebase/firebase';
import { RaffleFirebase, TicketFirebase } from '../raffles/interfaces';
import moment from 'moment';
import { OrderByOptions, useFirestoreConnect, WhereOptions } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import TicketsModal from './TicketsModal';
import { RouteComponentProps } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FullLoader from '../../components/FullLoader/FullLoader';
import TicketsModalBuy from './TicketsModalBuy';

interface MatchParams {
  raffleId: string;
}

const Tickets: FC<RouteComponentProps<MatchParams>> = ({match}) => {
  const [releasing, setReleasing] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [filter, setFilter] = useState("0");
  const [ticket, setTicket] = useState<TicketFirebase | null>(null);
  const [search, setSearch] = useState<string>("");
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<TicketFirebase[]>([]);
  const [where, setWhere] = useState<WhereOptions[]>([["raffleId", "==", match.params.raffleId]]);
  const [orderBy, setOrderBy] = useState<OrderByOptions>(['number', 'asc']);
  const [startAt, setStartAt] = useState(1);
  useFirestoreConnect(() => [{ collection: 'tickets', where: where,  orderBy: orderBy, startAt: startAt, limit: 5000 }]);
  const selectorTickets = useSelector((state: RootState) => state.firestore.ordered.tickets) as TicketFirebase[];
  const [limit, setLimit] = useState<number>(50);
  const [raffle, setRaffle] = useState<RaffleFirebase | null>(null)

  useEffect(() => {
    if(match.params.raffleId) {
      const getRaffle = async () => {
        const docRaffle = await firebase.firestore().collection("raffles").doc(match.params.raffleId).get();

        setRaffle({id: docRaffle.id, ...docRaffle.data()} as RaffleFirebase);
      }

      getRaffle();
    }
  }, [match]);

  useEffect(() => {
    if(selectorTickets && raffle !== null && loading) {
      try {
        const now = moment();

        setTickets(selectorTickets.map((ticket) => {
          const diff = ticket.reservationDate && ticket.status !== "Pagado" ? now.diff(moment(ticket.reservationDate.toDate()), "days") : null;
  
          return diff 
            ? 
            {
              ...ticket,
              status: "Vencido",
              raffle
            }
            : {...ticket, raffle};
        }));
      } catch (error) {
        console.log(error);
      } finally { 
        setLoading(false);
      }
    }
  }, [selectorTickets, raffle, loading]);

  if(loading) return <FullLoader />

  const onChangeFilter = (value: any) => {
    setFilter(value);
  }

  const getTickets = (tickets: TicketFirebase[]) => {
    if(filter === "0") return tickets.filter(ticket => ticket.number.toString().includes(search) || ticket.buyer.toString().includes(search));

    return tickets.filter(ticket => ticket.status === filter)
      .filter(ticket => ticket.number.toString().includes(search) || ticket.buyer.toString().includes(search));
  }

  const onScroll = (e: any) => {
    const bottom = (e.target.scrollHeight - e.target.scrollTop) < (e.target.clientHeight + 1);

    if (bottom && limit < 5000) { 
      setLimit(limit + 50)
    }
  }

  const releaseTickets = async () => {
    if(releasing) return;

    try {
      setReleasing(false);

      await Promise.all(tickets.filter(_ticket => _ticket.status === "Vencido").map(_ticket => {
        return firebase.firestore().collection("tickets").doc(_ticket.id)
          .update({ status: "Libre", reservationDate: null, buyer: "", phone: null, state: "" })
      }));

      setTickets(
        tickets.map(t => (
          t.status === "Vencido" 
          ? {...t, status: "Libre", reservationDate: null, buyer: "", phone: null, state: ""} 
          : t
      )));

      message.success("Boletos liberados con exito");
    } catch (error) {
      console.log(error);
    } finally {
      setReleasing(false)
    }
  }

  return (
    <div style={{marginTop: 20, padding: 20}}>
      Filtro de tickets
      <br />
      <Row>
        <Col>
          <Select value={filter} placeholder="Filtrar por" style={{width: 120, marginRight: 10}} onChange={(e) => onChangeFilter(e.target.value)}>
            <MenuItem value={"0"}>Todos</MenuItem>
            <MenuItem value="Libre">Libres</MenuItem>
            <MenuItem value="Reservado">Reservados</MenuItem>
            <MenuItem value="Vencido">Vencidos</MenuItem>
            <MenuItem value="Pagado">Pagados</MenuItem>
          </Select>
        </Col>
        <Col>
          <div>Total de boletos: {" " + getTickets(tickets).length}</div>
        </Col>
      </Row>
      {
        filter === "Vencido" && <Button 
          loading={releasing}
          type="primary"
          style={{marginTop: 10}}
          onClick={releaseTickets}
          >
          Liberar boletos vencidos
        </Button>
      }
     
      <br />
      <br />
      <Input 
        onChange={e => {
          setSearch(e.target.value) 
        }}
        placeholder="Buscar por número o comprador" 
      />
      <br />
      <br />
      <TableContainer component={Paper} style={{maxHeight: 500}} onScroll={onScroll}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Número</b></TableCell>
              <TableCell><b>Comprador</b></TableCell>
              <TableCell><b>Teléfono</b></TableCell>
              <TableCell><b>Estado</b></TableCell>
              <TableCell><b>Reserva</b></TableCell>
              <TableCell><b>Estado</b></TableCell>
              <TableCell><b>Recibo</b></TableCell>
              <TableCell><b>Comprar</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getTickets(tickets).slice(0, limit).map((row: TicketFirebase) => (
              <TableRow key={row?.id}>
                <TableCell component="th" scope="row">
                  {row.number.toString().padStart(4, "0")}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.buyer}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.phone}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.state}
                </TableCell>
                <TableCell component="th" scope="row">
                  { row.reservationDate ? moment(row.reservationDate.toDate()).format("DD/MM/YYYY hh:mm a") : "Sin reserva" }
                </TableCell>
                <TableCell component="th" scope="row">
                {
                  <Select error={row.status === "Vencido"} style={{width: 200}} value={row.status} onChange={async (e) => {
                    const { value } = e.target;

                    if(value === undefined || value === null) return;

                    try {
                      if(value === "Libre") {
                        setTickets(t =>
                          t.map(t => (
                            t?.id === row?.id 
                              ? {...t, status: value, reservationDate: null, buyer: "", phone: null, state: "" }
                              : t
                          )) as TicketFirebase[]
                        );
                      } else {
                        setTickets(t =>
                          t.map(t => (
                            t?.id === row?.id 
                              ? {...t, status: value }
                              : t
                          )) as TicketFirebase[]
                        );
                      }

                      await firebase.firestore().collection("tickets").doc(row.id)
                        .update(value === "Libre" ? { status: value, reservationDate: null, buyer: "", phone: null, state: "" } : {status: value} );
                    } catch (error) { 
                      console.log(error);
                    }
                  }}>
                    <MenuItem value="Libre">Libre</MenuItem>
                    <MenuItem value="Reservado" disabled>Reservado</MenuItem>
                    <MenuItem value="Vencido" disabled style={{color: "red"}}>Vencido</MenuItem>
                    <MenuItem value="Pagado" disabled={row.status === "Libre"}>Pagado</MenuItem>
                  </Select>
                }
                </TableCell>
                <TableCell>
                  { row.status === "Pagado" && <AlignLeftOutlined onClick={() => { setTicket(row); setOpenInfo(true); }} /> }
                </TableCell>
                <TableCell>
                  <ShoppingCartOutlined onClick={() => { setTicket(row); setOpenBuyModal(true); }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TicketsModal 
        open={openInfo} 
        onClose={() => setOpenInfo(false)} 
        ticket={ticket}
      />
      <TicketsModalBuy 
        open={openBuyModal}
        onClose={(saved: boolean, dataBuyer: any) => {

          if(saved) {
            setTickets(t =>
              t.map(t => (
                t?.id === ticket?.id 
                  ? {...t, status: "Pagado", reservationDate: dataBuyer.reservationDate, buyer: dataBuyer.buyer, phone: dataBuyer.phone, state: dataBuyer.state }
                  : t
              )) as TicketFirebase[]
            );
          }
          setOpenBuyModal(false);
          setTicket(null);
        }}
        idTicket={ticket?.id}
      />
    </div>
  )
}

export default Tickets;
