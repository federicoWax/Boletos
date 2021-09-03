import { FC, useEffect, useState } from 'react';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import { Col, Row, Input, Avatar } from 'antd';
import { CheckOutlined, WhatsAppOutlined, CaretDownOutlined, MenuOutlined } from '@ant-design/icons';
import logoLogin from '../../assets/login.jpg';
import firebase from "../../firebase/firebase";
import { Image, Promotion, RaffleFirebase, TicketFirebase } from '../Raffles/interfaces';
import HomeModal from './HomeModal';
import moment from 'moment';
import 'moment/locale/es';
import FullLoader from '../../components/FullLoader/FullLoader';
import ServiceFirebase from '../../services/firebase';
import HomeModalInfo from './HomeModalInfo';
import { Drawer, List, Divider, ListItem, ListItemText, CircularProgress } from '@material-ui/core';
import { MdHelp, MdList } from 'react-icons/md';
import { useHistory } from 'react-router';
import Div100vh from 'react-div-100vh';

const serviceFirebase = new ServiceFirebase();
const nowFirebase = firebase.firestore.Timestamp.now();
interface SelectedPromotion {
  index: number | null;
  checked: boolean,
  countTickets: number
}

const Home: FC = () => {
  const [raffle, setRaffle] = useState<RaffleFirebase | null>(null);
  const [promotionSelected, setPromotionSeleted] = useState<SelectedPromotion>({index: null, checked: false, countTickets: 0});
  const [search, setSearch] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [open, setOpen] = useState<boolean>(false); 
  const [idsTicket, setIdsTicket] = useState<Array<string>>([]);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const history = useHistory();
  const [tickets, setTickets] = useState<TicketFirebase[]>([]);
  const [startAt, setStartAt] = useState<number>(1);
  const [gettingTickets, setGettingTickets] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const raffleDoc = await firebase.firestore()
          .collection("raffles").where("finalDate", ">", nowFirebase).where("active", "==", true).get();

        let _raffle = { id: raffleDoc.docs[0].id, ...raffleDoc.docs[0].data() } as RaffleFirebase;

        const docTickets = await firebase.firestore().collection("tickets").where("raffleId", "==", _raffle.id).orderBy("number").startAt(startAt).limit(200).get();
        
        _raffle.tickets = docTickets.docs.map((dt) => ({id: dt.id, selected: false, ...dt.data()}) as TicketFirebase);

        setRaffle(_raffle);  
      }
       catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    
    getData();
  }, []);

  useEffect(() => {
    const getTickets = async () => {
      if(gettingTickets) return;

      try {
        setGettingTickets(true);

        if(startAt > 1 && raffle !== null) {
          const docTickets = await firebase.firestore().collection("tickets").where("raffleId", "==", raffle.id).orderBy("number").startAt(startAt).limit(200).get();
            
          setRaffle({...raffle, tickets: [...raffle.tickets, ...docTickets.docs.map((dt) => ({id: dt.id, selected: false, ...dt.data()}) as TicketFirebase)]});  
        } 
      } catch (error) {
        console.log(error);
      } finally {
        setGettingTickets(false);
      }
    }

    getTickets();
  }, [startAt]);


  if(loading) return <FullLoader />;

  const getTickets = (tikets: TicketFirebase[] = []) => 
    tikets.filter(ticket => ticket.number.toString().includes(search));

  const onScroll = (e: any) => {
    if(gettingTickets) return;

    let bottom = false;
    const  ua = navigator.userAgent.toLowerCase(); 

    if (ua.indexOf('safari') != -1) { 
      if (ua.indexOf('chrome') > -1) {
        bottom = (e.target.scrollHeight - e.target.scrollTop) < (e.target.clientHeight + 1);
      } else {
        bottom = parseInt((e.target.scrollHeight - e.target.scrollTop).toString()) === e.target.clientHeight;
      }
    }

    if(bottom && startAt < 5000) {
      setStartAt(startAt + 200); 
    }
  }

  if(raffle === null) return null; 
  
  return (
    <Div100vh style={{color: "white", backgroundColor: "orangered", textAlign: "center", maxHeight: "100vh", overflowY: "auto"}} onScroll={onScroll}>
      <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <img alt="rifas-login" height={110} style={{objectFit: "cover"}} src={logoLogin}/>
        <List>
          <ListItem button key={"/lista"} onClick={() => history.push("/lista")}>
            <MdList style={{color: "orangered", marginRight: 10, fontSize: 20}} />
            <ListItemText primary="Lista" />
          </ListItem>
          <Divider />
          <ListItem button key={"/preguntas"} onClick={() => history.push("/preguntas")}>
            <MdHelp style={{color: "orangered", marginRight: 10, fontSize: 20}} />
            <ListItemText primary="Preguntas" />
          </ListItem>
          <Divider />
        </List>
      </Drawer>
      <div style={{
        textAlign: "center", 
        width: "100%", 
        backgroundColor: "black", 
        position: "fixed", 
        zIndex: 999,
        height: 65,
        paddingRight: 32
      }}>
        <img alt="rifas-login" height={60} src={logoLogin}/>
        <MenuOutlined onClick={() => setOpenDrawer(true)} style={{color: "white", float: "left", paddingLeft: 20, paddingTop: 15, fontSize: 30}} />
      </div>
      <div style={{paddingTop: 60}} onScroll={onScroll}>
        <div>
          <div style={{marginTop:5, fontSize: 30}}>
            { raffle.name.toUpperCase() }
          </div>
          <div style={{fontSize: 20, marginBottom: 5, marginTop: -10}}>
            { raffle.description.toUpperCase() }
          </div>
          <Row style={{backgroundColor: "white", color: "orangered"}}>
            <Col xs={3} sm={3} md={3}>
              <CaretDownOutlined style={{fontSize: 40}} />
            </Col>
            <Col style={{fontSize: 20, marginTop: 5}} xs={18} sm={18} md={18}>
              <b>LISTA DE BOLETOS ABAJO</b>
            </Col>
            <Col xs={3} sm={3} md={3}>
              <CaretDownOutlined style={{fontSize: 40}} />
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={9}></Col>
            <Col xs={24} sm={24} md={6}>
              <img 
                src={(raffle.image as Image).imageUrl} 
                alt="imagenCarro" 
                height={280} 
                style={{width: "100%", objectFit: "contain", padding: 10}}
              />
            </Col>
            <Col xs={24} sm={24} md={9}></Col>
          </Row>
          <div style={{ fontSize: 25, marginBottom: 5, marginTop: -10}}>
            <div>
              Precio Boleto: ${ raffle.priceTicket.toString().toUpperCase() }
            </div>
            {
              raffle.activeDate && <div style={{marginTop: -10}}>
              (SÓLO HASTA { moment(raffle.finalDate?.toDate()).format("DD/MMMM").toUpperCase() })
              </div>
            }
          </div>
          {
            raffle.promotions.length
            ?
              <div style={{backgroundColor: "white", color: "black", fontSize: 20, paddingBottom: 6}}>
              <Divider style={{margin: 0, padding: 0}}/>
              {
                raffle.promotions.map((promotion: Promotion, index: number) => (
                  <Row key={index}>
                    <Col sm={promotion.countTickets > 0 ? 20 : 24} xs={promotion.countTickets > 0 ? 20 : 24} md={promotion.countTickets > 0 ? 20 : 24}>
                      <b>{promotion.description}</b>
                    </Col>
                    {
                      promotion.countTickets > 0 
                      ?
                      <Col sm={4} xs={4} md={4}>
                        <Switch  
                          style={{color: "orangered"}}
                          checked={promotionSelected.index === index && promotionSelected.checked} 
                          onChange={(e) =>  {
                            setRaffle({
                              ...raffle,
                              tickets: raffle.tickets.map(t => ({...t, selected: false}))
                            });
                            setIdsTicket([]);
                            setPromotionSeleted({ index, checked: e.target.checked, countTickets: parseInt(promotion.countTickets.toString()) })
                          }} 
                        />
                      </Col>
                      :
                          null
                    }
                    
                    {index < raffle.promotions.length -1 && <Divider style={{margin: 0, padding: 0}}/> }
                  </Row>
                ))
              }
            </div>
            :
              null
          }
          <div style={{padding: 20}}>
            <Input
              value={search} 
              type="number" 
              placeholder="Busca tu boleto aqui" 
              onChange={(e) => { setSearch(e.target.value) }}
            />
          </div>
          <Box display="flex" justifyContent="center" style={{width: "100%", marginBottom: 10, marginTop: 5}}>
            <Box pr={1}>
              <div  
                style={{ 
                  height: 30,
                  cursor: "pointer", 
                  backgroundColor: "green",
                  borderRadius: 30,
                  width: 60,  
                }}  
              >
              </div>                    
            </Box>
            <Box pl={1} style={{marginTop: 4}}>
              <b>Verde - Libre</b>
            </Box>
          </Box>
          <Row style={{backgroundColor: "white", padding: 10}}>
          {
            getTickets(raffle.tickets).map((ticket: TicketFirebase) => (
              <Col sm={4} xs={4} md={4} key={ticket.id} style={{padding: 5}}>
                <div  
                  style={{ 
                    height: 30,
                    cursor: "pointer", 
                    backgroundColor: ticket.status === "Libre" ? "green" : "red",
                    borderRadius: 30
                  }}  
                  onClick={async () => {
                    const docTicket = await serviceFirebase.getDoc("tickets", ticket.id);
                    const _tiket = { id:docTicket.id, ...docTicket.data() } as TicketFirebase;

                    if(ticket.status !== "Libre" || _tiket.status !== "Libre") return;

                    let _idsTicket = [...idsTicket];

                    if(!idsTicket.includes(ticket.id)) {
                      _idsTicket = [..._idsTicket, ticket.id];

                      setIdsTicket(_idsTicket);
                      setTickets([...tickets, ticket]);

                    } else {
                      setIdsTicket(idsTicket.filter(it => it !== ticket.id));
                      setTickets(tickets.filter(t => t.id !== ticket.id));
                    }

                    if(!promotionSelected.checked || promotionSelected.countTickets === _idsTicket.length) {
                      setOpen(true);
                    }
                  }}
                >
                  <div style={{paddingTop: 4}}>
                  { idsTicket.includes(ticket.id) ? <CheckOutlined /> : ticket.status === "Libre" ? (ticket.number.toString().padStart(4, "0")) : "" }
                  </div>
                </div> 
              </Col>
            ))
          }
          </Row>
          <div style={{maxHeight: 80}}>
            <div>Cargando boletos...</div>
            <CircularProgress size={60} style={{color: "white", padding: 10}} />
          </div>
        </div>
      </div>
      <a
        href="https://wa.me/5216624334349"
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
        onClose={(_idsTicket: Array<string> | undefined, showInfo: boolean) => {
          if(_idsTicket) {
            setRaffle({
              ...raffle,
              tickets: raffle.tickets.map(t => ({...t, status: _idsTicket.includes(t.id) ? "Reservado" : t.status}))
            });
            setSearch("");
          } 

          setOpen(!open);
          
          if(showInfo) setOpenInfo(true);
        }}
        idsTicket={idsTicket}
      />
      <HomeModalInfo 
        tickets={tickets}
        open={openInfo}
        onClose={() => {
          setOpenInfo(false)
          setIdsTicket([]);
          setTickets([]);
        }} 
      />
    </Div100vh>
  )
}

export default Home;