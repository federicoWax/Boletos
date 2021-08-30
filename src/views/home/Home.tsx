import { FC, useEffect, useState } from 'react';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import { Col, Row, Input, Avatar } from 'antd';
import { CheckOutlined, WhatsAppOutlined, CaretDownOutlined, MenuOutlined } from '@ant-design/icons';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import logoLogin from '../../assets/login.jpg';
import firebase, { RootState } from "../../firebase/firebase";
import { Image, Promotion, RaffleFirebase, TicketFirebase } from '../raffles/interfaces';
import HomeModal from './HomeModal';
import moment from 'moment';
import 'moment/locale/es';
import FullLoader from '../../components/FullLoader/FullLoader';
import ServiceFirebase from '../../services/firebase';
import HomeModalInfo from './HomeModalInfo';
import { Drawer, List, Divider, ListItem, ListItemText } from '@material-ui/core';
import { MdHelp, MdList } from 'react-icons/md';
import { useHistory } from 'react-router';

const serviceFirebase = new ServiceFirebase();
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
  const [idsTicket, setIdsTicket] = useState<Array<string>>([]);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const history = useHistory();
  
  useFirestoreConnect(() => [
    { collection: 'raffles', where: [["finalDate", ">", nowFirebase], ["active", "==", true]] }
  ]);
  const selectorRaffles = useSelector((state: RootState) => state.firestore.ordered.raffles) as RaffleFirebase[];

  useEffect(() => {
    if(selectorRaffles) {
      const getData = async () => {
        try {
          const _raffles = await Promise.all(selectorRaffles.map(async (sr) => {
            const docTickets = await firebase.firestore().collection("tickets").where("raffleId", "==", sr.id).orderBy("number").get();
            
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


  if(loading) return <FullLoader />;

  const getTickets = (tikets: TicketFirebase[] = []) => 
    tikets.filter(ticket => ticket.number.toString().includes(search));
  
  return (
    <div style={{color: "white", backgroundColor: "orangered", textAlign: "center"}}>
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
      <div style={{paddingTop: 60}}>
      {
        raffles.length
        ?
          raffles.map((raffle: RaffleFirebase)  => (
            <div key={raffle.id}>
              <div style={{fontSize: 30 }}>
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
                               setRaffles(raffles.map(r => ({
                                 ...r,
                                 tickets: raffle.id === r.id 
                                   ? r.tickets.map(t => ({...t, selected: false}))
                                   : r.tickets  
                               })));
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
                getTickets(raffle.tickets).map((ticket: TicketFirebase) => {
                  const key = ticket.number.toString().length;
                  
                  return (
                  <Col sm={4} xs={4} md={2} key={ticket.id} style={{padding: 5}}>
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
                        } else {
                          setIdsTicket(idsTicket.filter(it => it !== ticket.id));
                        }

                        if(!promotionSelected.checked  || promotionSelected.countTickets === _idsTicket.length) {
                          setOpen(true);
                        }
                      }}
                    >
                      <div style={{paddingTop: 4}}>
                      { idsTicket.includes(ticket.id) ? <CheckOutlined /> : ticket.status === "Libre" ? (ticket.number.toString().padStart(4, "0")) : "" }
                      </div>
                    </div> 
                  </Col>
                ) })
              }
              </Row>
            </div>
          ))
        :
          <div style={{textAlign: "center", marginTop: 300, fontSize: 20, backgroundColor: "orangered"}}> Sin Rifas Registradas </div>
      }
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
            const idRaffle = (raffles.find(r => r.tickets.some(t => _idsTicket.includes(t.id))))?.id;

            setRaffles(raffles.map(r => ({
              ...r,
              tickets: idRaffle === r.id 
                ? r.tickets.map(t => ({...t, status: _idsTicket.includes(t.id) ? "Reservado" : t.status}))
                : r.tickets  
            })));
            setIdsTicket([]);
            setSearch("");
          } else {
            setIdsTicket([]);
          }

          setOpen(!open);
          
          if(showInfo) setOpenInfo(true);
        }}
        idsTicket={idsTicket}
      />
      <HomeModalInfo 
        open={openInfo}
        onClose={() => setOpenInfo(false)}
      />
    </div>
  )
}

export default Home;