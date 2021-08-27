import { FC, useEffect, useState } from 'react';
import { Col, Row, Switch, Input, Divider, Tag, Spin, Avatar, message } from 'antd';
import { ShoppingCartOutlined, CheckOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import logoLogin from '../../assets/login.jpg';
import firebase, { RootState } from "../../firebase/firebase";
import { Image, Promotion, RaffleFirebase, TicketFirebase } from '../Raffles/interfaces';
import HomeModal from './HomeModal';

const nowFirebase = firebase.firestore.Timestamp.now();

interface SelectedPromotion {
  index: number | null;
  checked: boolean,
  countTickets: number
}

const Home: FC = () => {
  const [raffles, setRaffles] = useState<RaffleFirebase[]>([]);
  const [promotionSelected, setPromotionSeleted] = useState<SelectedPromotion>({index: null, checked: false, countTickets: 0});
  const [search, setSearch] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [open, setOpen] = useState<boolean>(false); 
  const [startAt, setStartAt] = useState<number>(1);
  const [idsTicket, setIdsTicket] = useState<Array<string>>([]);
  
  useFirestoreConnect(() => [
    { collection: 'raffles', where: [["finalDate", ">", nowFirebase]] }
  ]);
  const selectorRaffles = useSelector((state: RootState) => state.firestore.ordered.raffles) as RaffleFirebase[];

  useEffect(() => {
    if(selectorRaffles) {
      const getData = async () => {
        try {
          const _raffles = await Promise.all(selectorRaffles.map(async (sr) => {
            const docTickets = await firebase.firestore().collection("tickets").where("raffleId", "==", sr.id).orderBy("number").startAt(1).limit(50).get();
            
            return { ...sr, tickets: docTickets.docs.map((dt) => ({id: dt.id, selected: false, ...dt.data()}) as TicketFirebase) }
          }));

          setRaffles(_raffles);  
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
      
      getData();
    }
  }, [selectorRaffles]);

  useEffect(() => {
    if(startAt > 1) {
      const getData = async () => {
        try {
          if(raffles.length >= 100) return;

          const _raffles = await Promise.all(raffles.map(async (sr) => {
            
            const docTickets = await firebase.firestore().collection("tickets").where("raffleId", "==", sr.id).orderBy("number").startAt(startAt).limit(50).get();
            
            return { ...sr, tickets: [...sr.tickets, ...docTickets.docs.map((dt) => ({id: dt.id, ...dt.data()}) as TicketFirebase)] }
          }));
    
          setRaffles(_raffles);  
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
      getData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAt]);

  if(loading) return <div style={{
    position: "absolute",
    left: "50%",
    top: "50%",
    WebkitTransform: "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)",
  }}>    
    <Spin tip="Cargando..." />
  </div>;

  const onScrollTickets = async (e: any) => {
    const bottom = parseInt((e.target.scrollHeight - e.target.scrollTop).toString()) === e.target.clientHeight;

    if (bottom && startAt < 50) { 
      setStartAt(startAt + 50);
    }
  }
  
  return (
    <div style={{color: "white", backgroundColor: "orangered", textAlign: "center"}}>
      <div style={{textAlign: "center", width: "100%", backgroundColor: "black"}}>
        <img alt="rifas-login" height={100} style={{ }} src={logoLogin}/>
      </div>
      <div>
      {
        raffles.length
        ?
          raffles.map((raffle: RaffleFirebase)  => (
            <div key={raffle.id}>
              <div style={{fontSize: 30, fontWeight: "bold"}}>
                { raffle.name.toUpperCase() }
              </div>
              <div style={{fontSize: 20, fontWeight: "bold", marginBottom: 5}}>
                { raffle.description.toUpperCase() }
              </div>
              <Row>
                <Col md={9}></Col>
                <Col md={6}>
                  <img src={(raffle.image as Image).imageUrl} alt="imagenCarro" height={280} style={{width: "100%", objectFit: "fill"}}/>
                </Col>
                <Col span={9}></Col>
              </Row>
              <div style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5}}>
                Precio Boleto: ${ raffle.priceTicket.toString().toUpperCase() }
              </div>
              {
                raffle.promotions.length
                ?
                  <div style={{backgroundColor: "white", color: "black", fontSize: 20, paddingBottom: 6}}>
                    <b>¡¡PROMOCIONES!!</b>
                  <Divider style={{margin: 0, padding: 0}}/>
                  {
                    raffle.promotions.map((promotion: Promotion, index: number) => (
                      <Row key={index}>
                        <Col sm={20} xs={20} md={20}>
                          {index + 1}.- {promotion.description}
                        </Col>
                        <Col sm={4} xs={4} md={4}>
                          <Switch  
                            checked={promotionSelected.index === index && promotionSelected.checked} 
                            onChange={(e) =>  {
                              setRaffles(raffles.map(r => ({
                                ...r,
                                tickets: raffle.id === r.id 
                                  ? r.tickets.map(t => ({...t, selected: false}))
                                  : r.tickets  
                              })));
                              setIdsTicket([]);
                              setPromotionSeleted({ index, checked: e, countTickets: parseInt(promotion.countTickets.toString()) })
                            }} 
                          />
                        </Col>
                        {index < raffle.promotions.length -1 && <Divider style={{margin: 0, padding: 0}}/> }
                      </Row>
                    ))
                  }
                </div>
                :
                  null
              }
              <div style={{padding: 20}}>
                <Row gutter={20}>
                  <Col xs={20} sm={20} md={20}>
                    <Input type="number" placeholder="Busca tu boleto aqui" onChange={(e) => setSearch(e.target.value)} />
                  </Col>
                  <Col xs={4} sm={4} md={4}>
                    <Avatar 
                      style={{ 
                        cursor: "pointer",
                        backgroundColor: '#00FF04', 
                        height: 40,
                        width: 40,
                        marginTop: -6
                      }}
                    >
                      <ShoppingCartOutlined 
                        onClick={() => {
                          if(promotionSelected.checked && promotionSelected.countTickets > idsTicket.length) {
                            const missing = promotionSelected.countTickets - idsTicket.length;
                            message.error("Favor de seleccionar "+ missing + " boletos para hacer válida la promoción!");
                            return; 
                          }

                          if(!idsTicket.length) {
                            message.error("Favor de seleccionar un boleto!");
                            return;
                          }

                          setOpen(true);
                        }} 
                        style={{fontSize: 32, marginTop: 4, marginRight: 2}}
                      />
                    </Avatar>
                  </Col>
                </Row>
              </div>
              <Row style={{backgroundColor: "white", padding: 10, maxHeight: 300, overflowY: "auto"}} onScroll={onScrollTickets}>
              {
                raffle.tickets.map((ticket: TicketFirebase) => (
                  <Col sm={4} xs={4} md={4} key={ticket.id} style={{padding: 5}}>
                    <Tag  
                      style={{minWidth: 50, cursor: "pointer"}} 
                      color={ticket.status === "Libre" ? "green" : "red"} 
                      onClick={() => {
                        if(ticket.status !== "Libre") return;

                        if(!ticket.selected && promotionSelected.checked && promotionSelected.countTickets === raffle.tickets.filter(t => t.selected).length) {
                          message.info("Tienes una promoción seleccionada, no puedes seleccioanr otro boleto.");
                          return;
                        }
                        
                        if(!ticket.selected) {
                          setIdsTicket([...idsTicket, ticket.id]);
                        } else {
                          setIdsTicket(idsTicket.filter(it => it !== ticket.id));
                        }
                        
                        setRaffles(raffles.map(r => ({
                          ...r,
                          tickets: raffle.id === r.id 
                            ? r.tickets.map(t => ({...t, selected: t.id === ticket.id ? !t.selected : t.selected}))
                            : r.tickets  
                        }))) 
                      }}
                    >
                    { ticket.selected ? <CheckOutlined /> : ticket.number }
                    </Tag> 
                  </Col>
                ))
              }
              </Row>
            </div>
          ))
        :
          <div style={{textAlign: "center", marginTop: 250}}> Sin Rifas Registradas </div>
      }
      </div>
      <a
        href="https://wa.me/5216621744987"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Avatar 
          style={{
            position: "fixed",
            cursor: "pointer",
            backgroundColor: '#00FF04', 
            bottom: "40px",
            right: "40px",
            height: 50,
            width: 50
          }}
        >
          <WhatsAppOutlined  style={{fontSize: 30, marginTop: 9}}/>
        </Avatar>
      </a>
      <HomeModal 
        open={open}
        onClose={(_idsTicket: Array<string> | undefined) => {
          if(_idsTicket) {
            const idRaffle = (raffles.find(r => r.tickets.some(t => _idsTicket.includes(t.id))))?.id;

            setRaffles(raffles.map(r => ({
              ...r,
              tickets: idRaffle === r.id 
                ? r.tickets.map(t => ({...t, status: _idsTicket.includes(t.id) ? "Reservado" : t.status}))
                : r.tickets  
            })));
            setIdsTicket([]);
          }

          setOpen(!open)

        }}
        idsTicket={idsTicket}
      />
    </div>
  )
}

export default Home;