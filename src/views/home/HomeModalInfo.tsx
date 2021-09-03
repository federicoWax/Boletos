import { Col, Row } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { FC } from 'react';
import { TicketFirebase } from '../Raffles/interfaces';

interface PropsHomeModalInfo {
  open: boolean;
  onClose: Function;
  tickets: TicketFirebase[];
}

const HomeModalInfo: FC<PropsHomeModalInfo> = ({open, onClose, tickets = []}) => {
  console.log(tickets);
  return (
    <Modal 
      visible={open}
      cancelButtonProps={{
        hidden: true
      }}
      onOk={() => onClose()}
      okText="Aceptar"
      okButtonProps={{
        style: {backgroundColor: "orangered"}
      }}
    >
      <div style={{fontWeight: "bold", fontSize: 18}}>
        <div style={{color: "orangered", marginTop: 10}}>
          El boleto sólo dura apartado 24 hrs en  el sitema, si no se realiza el pago saldrá a la venta.  
        </div>
        <div style={{backgroundColor: "orangered", color: "white", padding: 10, borderRadius: 10, marginTop: 10}}>
          TOMA CAPTURA DE ESTA PANTALLA Y ENVÍALO JUNTO CON TU COMPRBANTE DE PAGO AL WHATSAPP (662) 433 43 49
        </div>
      </div>
      <div style={{textAlign: "center", fontSize: 18, fontWeight: "bold"}}>
        Boletos reservados: 
      </div>

      <Row style={{backgroundColor: "white", padding: 10}} justify="center">
        {
          tickets.map((ticket: TicketFirebase) => (
            <Col sm={4} xs={4} md={2} key={ticket.id} style={{padding: 5}}>
              <div  
                style={{ 
                  width: 60,
                  height: 30,
                  cursor: "pointer", 
                  backgroundColor: ticket.status === "Libre" ? "green" : "red",
                  borderRadius: 30
                }}  
              >
                <div style={{paddingTop: 4, textAlign: "center", color: "white"}}>
                  { ticket.number.toString().padStart(4, "0") }
                </div>
              </div> 
            </Col>
          ))
        }
        </Row>
    </Modal>
  )
}

export default HomeModalInfo
