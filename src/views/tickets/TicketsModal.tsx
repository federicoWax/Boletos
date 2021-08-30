import { Divider } from '@material-ui/core';
import { Row, Col } from 'antd';
import Modal from 'antd/lib/modal/Modal'
import moment from 'moment';
import { FC } from 'react'
import logoLogin from '../../assets/login.jpg';
import { TicketFirebase } from '../raffles/interfaces';

interface PropsTicketsModal {
  open: boolean;
  onClose: Function
  ticket: TicketFirebase | null
}

const TicketsModal: FC<PropsTicketsModal> = ({open, onClose, ticket}) => {
  if(ticket === null) return null;

  return (
    <Modal
      cancelButtonProps={{
        hidden: true
      }}
      visible={open}
      okText="Cerrar"
      onOk={() => onClose()}
    >
      <div style={{
        textAlign: "center", 
        width: "100%", 
        backgroundColor: "black", 
        zIndex: 999,
        height: 65,
      }}>
        <img alt="rifas-login" height={60} src={logoLogin}/>
      </div>
      <Divider style={{marginTop: 20}} />
      <div style={{fontSize: 20}}>
        <Row gutter={20}>
          <Col>BOLETO: </Col> <Col style={{color: "red"}}>{ ticket?.number.toString().padStart(4, "0") } - {ticket?.number + 5000}</Col>
        </Row>
        <Divider />
        <Row gutter={20} style={{marginTop: 20}}>
          <Col xs={8} sm={8} md={8}>SORTEO: </Col> <Col xs={16} sm={16} md={16} style={{color: "red"}}>{ ticket.raffle?.name.toUpperCase() + "(" + ticket.raffle.description.toUpperCase() + ")"}</Col>
        </Row> 
        <Row gutter={20} style={{marginTop: 20}}>
          <Col>NOMBRE: </Col> <Col style={{color: "red"}}>{ ticket.buyer.toUpperCase()}</Col>
        </Row> 
        <Row gutter={20} style={{marginTop: 20}}>
          <Col>ESTADO: </Col> <Col style={{color: "red"}}>{ ticket.state?.toUpperCase()}</Col>
        </Row> 
        <Row gutter={20} style={{marginTop: 20}}>
          <Col>PAGADO: </Col> <Col style={{color: "red"}}>SI</Col>
        </Row> 
        <Row gutter={20} style={{marginTop: 20}}>
          <Col>FECHA DE COMPRA: </Col> <Col style={{color: "red"}}>{ moment(ticket.reservationDate?.toDate()).format("DD/MM/YYYY hh:mm:ss a") }</Col>
        </Row> 
          <div style={{textAlign: "center", marginTop: 10}}>
            <img 
              alt="rifas-login" 
              height={120} 
              style={{ padding: 10,  borderRadius: "25%"}} 
              src={ ticket.raffle.image instanceof File || ticket.raffle.image === null || ticket.raffle.image === undefined ? "" : ticket?.raffle?.image?.imageUrl}
            /> 
          </div>
      </div>

    </Modal>
  )
}

export default TicketsModal
