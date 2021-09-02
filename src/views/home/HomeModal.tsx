import { FC, useState } from 'react';
import { Col, Form, Input, Modal, Row } from 'antd';
import ServiceFirebase from '../../services/firebase';
import firebase from '../../firebase/firebase';
import AlertC from '../../components/Alert/Alert';
import { MenuItem, Select } from '@material-ui/core';

const states = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
	'Campeche',
	'Chiapas',
	'Chihuahua',
	'Coahuila de Zaragoza',
	'Colima',
	'Ciudad de México',
	'Durango',
	'Guanajuato',
	'Guerrero',
	'Hidalgo',
	'Jalisco',
	'Estado de Mexico',
	'Michoacan de Ocampo',
	'Morelos',
	'Nayarit',
	'Nuevo Leon',
	'Oaxaca',
	'Puebla',
	'Queretaro de Arteaga',
	'Quintana Roo',
	'San Luis Potosi',
	'Sinaloa',
  'Sonora',
	'Tabasco',
	'Tamaulipas',
	'Tlaxcala',
	'Veracruz de Ignacio de la Llave',
	'Yucatan',
	'Zacatecas',
];

const serviceFirebase = new ServiceFirebase();

interface RafflesModalProps {
  open: boolean,
  onClose: Function,
  idsTicket: string[]
}
  
interface FormModal {
  buyer: string,
  phone: number | string,
  state: string | undefined;
}

const HomeModal: FC<RafflesModalProps> = ({open, idsTicket, onClose}) => {
  const [formModal, setFormModal] = useState<FormModal>({buyer: "", phone: "", state: "Sonora"}); 
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [form] = Form.useForm();

  const onAccept = async () => {
    if(saving) return;

    try {
      setSaving(true);
      
      const reservationDate = firebase.firestore.Timestamp.now();

      await Promise.all(idsTicket.map((id) => 
        serviceFirebase.updateDoc("tickets", id, { status: "Reservado", reservationDate, ...formModal })
      ));

      setMessage("Reserva realizada con exito!");
      setTimeout(() => {
        setMessage("");
      }, 4000)
      onClose(idsTicket, true);  
    } catch (error) { 
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
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
        <div>
          (SI EL PAGO SERA CON TRANSEFERENCIA FAVOR DE PONER COMO CONCEPTO EL NÚMERO DEL BOLETO Y NOMBRE)
        </div>
      </div>
      <Form 
        form={form}
        layout="vertical"
      >
        <Row gutter={10}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Nombre"
              name="name"
              rules={[{ required: true, message: 'Favor de escribir el Nombre' }]}
            >
              <Input value={formModal.buyer} onChange={(e) => setFormModal({...formModal, buyer: e.target.value})} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Teléfono"
              name="phone"
              rules={[{ required: true, message: 'Favor de escribir el Teléfono' }]}
            >
              <Input type="number" value={formModal.phone} onChange={(e) => setFormModal({...formModal, phone: e.target.value})} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            * Estado
            <Select label="Estado" fullWidth value={formModal.state} onChange={(e) => {
              setFormModal({...formModal, state: e.target.value as string })
            }}>
            {
              states.map((state) => (
                <MenuItem value={state} key={state}>{state}</MenuItem>
              ))                
            }
            </Select>
          </Col>
        </Row>
      </Form>
    </Modal>
    <AlertC 
      open={Boolean(message)}
      onClose={() => setMessage("")}
      severity="success"
      message={message}
    />
    </>
  )
}

export default HomeModal;
