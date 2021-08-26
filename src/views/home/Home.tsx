import { FC, useEffect, useState } from 'react';
import { Col, Row, Radio, Input, Divider, Tag, Spin } from 'antd';
import logoLogin from '../../assets/login.jpg';
import firebase, { RootState } from "../../firebase/firebase";
import { Image, Promotion, RaffleFirebase, TicketFirebase } from '../Raffles/interfaces';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

const nowFirebase = firebase.firestore.Timestamp.now();

const Home: FC = () => {
  const [raffles, setRaffles] = useState<RaffleFirebase[]>([]);
  const [promotionSelected, setPromotionSeleted] = useState<number | null>(null);
  const [search, setSearch] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [startAt, setStartAt] = useState<number>(1);

  useFirestoreConnect(() => [
    { collection: 'raffles', where: [["finalDate", ">", nowFirebase]] } // or `todos/${props.todoId}`
  ])
  const selectorRaffles = useSelector((state: RootState) => state.firestore.ordered.raffles) as RaffleFirebase[]

  useEffect(() => {
    if(selectorRaffles) {
      const getData = async () => {
        try {
          const _raffles = await Promise.all(selectorRaffles.map(async (sr) => {
            const docTickets = await firebase.firestore().collection("tickets").where("raffleId", "==", sr.id).orderBy("number").startAt(1).limit(50).get();
            
            return { ...sr, tickets: docTickets.docs.map((dt) => ({id: dt.id, ...dt.data()}) as TicketFirebase) }
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
  }, [startAt])

  if(loading) return <div style={{
    position: "absolute",
    left: "50%",
    top: "50%",
    WebkitTransform: "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)",
  }}>    
    <Spin tip="Cargando..." />
  </div>;

  const onScrollTickets = async (e: any, raffle: RaffleFirebase) => {
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
                          <Radio  
                            checked={index === promotionSelected} 
                            onChange={() => setPromotionSeleted(index)} 
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
                <Input type="number" placeholder="Busca tu boleto aqui" onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Row style={{backgroundColor: "white", padding: 10, maxHeight: 300, overflowY: "auto"}} onScroll={(e) => onScrollTickets(e, raffle)} >
              {
                raffle.tickets.sort((a, b) => (a.number > b.number) ? 1 : -1).map((ticket: TicketFirebase) => (
                  <Col sm={4} xs={4} md={4} key={ticket.id} style={{padding: 5}}>
                    <Tag style={{minWidth: 50}} color="green">{ticket.number}</Tag> 
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
    </div>
  )
}

export default Home;