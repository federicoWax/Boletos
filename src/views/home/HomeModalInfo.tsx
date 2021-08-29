import Modal from 'antd/lib/modal/Modal';
import { FC } from 'react';

interface PropsHomeModalInfo {
  open: boolean;
  onClose: Function;
}

const HomeModalInfo: FC<PropsHomeModalInfo> = ({open, onClose}) => {
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
          TOMA CAPTURA DE PANTALLA Y ENVÍALO JUNTO CON TU COMPRBANTE DE PAGO AL WHATSAPP (662) 433 43 49
        </div>
      </div>
    </Modal>
  )
}

export default HomeModalInfo
