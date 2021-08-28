import { FC, useState } from 'react';
import { Col, Form, Input, message, Modal, Row } from 'antd';
import ServiceFirebase from '../../services/firebase';
import firebase from '../../firebase/firebase';

const serviceFirebase = new ServiceFirebase();

interface RafflesModalProps {
  open: boolean,
  onClose: Function,
  idsTicket: string[]
}
  
interface FormModal {
  name: string,
  phone: number | string
}

const HomeModal: FC<RafflesModalProps> = ({open, idsTicket, onClose}) => {
  const [formModal, setFormModal] = useState<FormModal>({name: "", phone: ""}); 
  const [saving, setSaving] = useState<boolean>(false);
  const [form] = Form.useForm();

  const onAccept = async () => {
    if(saving) return;

    try {
      setSaving(true);
      
      const reservationDate = firebase.firestore.Timestamp.now();

      await Promise.all(idsTicket.map((id) => 
        serviceFirebase.updateDoc("tickets", id, { buyer: formModal.name, phone: formModal.phone, status: "Reservado", reservationDate })
      ));

      message.success("Reserva realizada con exito!")
      onClose(idsTicket);  
    } catch (error) { 
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      okButtonProps={{
        style: {backgroundColor: "orangered"}
      }}
      visible={open}
      cancelText="Cancelar"
      okText="Reservar"
      onCancel={() => onClose()}
      onOk={() => 
        form.validateFields()
          .then(async () => {
            await onAccept();
          })
      } 
      confirmLoading={saving}
      
    > 
      <div style={{textAlign: "center", fontWeight: "bold" }}>
        <div style={{color: "red", fontSize: 20}}>Lea esta nota porfavor!!</div>
        <div>
          Haga su pago como se le indica de lo contrario no se hara válido.
        </div>
        <div>
          INDENTIFICA CUÁL ES PARA DEPÓSITO Y CUÁL ES PARA TRANSFERENCIA
        </div>
        <div style={{color: "blueviolet", fontSize: 20}}>
          BANAMEX
        </div>
        <div>
          5204167396381097
        </div>
        <div>
          ÚNICAMENTE TRANSFERENCIA 
        </div>
        <div>
          JOSÉ SALVADOR PALAFOX VILLEGAS
        </div>
        <div style={{color: "blueviolet", fontSize: 20}}>
          COPPEL
        </div>
        <div>
          4169160496127128
        </div>
        <div>
          DEPÓSITO EN OXXO O EN CUALQUIER COMERCIO
        </div>
        <div style={{color: "blueviolet", fontSize: 20}}>
          BBVA
        </div>
        <div>
          4152313712554000
        </div>
        <div>
          Únicamente transferencia 
        </div>
        <div>
          José Salvador Palafox Villegas
        </div>
      </div>
      <Form 
        form={form}
        layout="vertical"
      >
        <Row>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Nombre"
              name="name"
              rules={[{ required: true, message: 'Favor de escribir el Nombre' }]}
            >
              <Input value={formModal.name} onChange={(e) => setFormModal({...formModal, name: e.target.value})} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} style={{marginTop: -5, marginBottom: -28}}>
            <Form.Item
              label="Teléfono"
              name="phone"
              rules={[{ required: true, message: 'Favor de escribir el Teléfono' }]}
            >
              <Input type="number" value={formModal.phone} onChange={(e) => setFormModal({...formModal, phone: e.target.value})} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default HomeModal;
