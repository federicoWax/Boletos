import { FC, useState } from 'react';
import { Col, Form, Input, Modal, Row } from 'antd';
import ServiceFirebase from '../../services/firebase';
import firebase from '../../firebase/firebase';
import AlertC from '../../components/Alert/Alert';
import { Select } from 'antd';

const { Option } = Select;
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
  idTicket: string | undefined;
}
  
interface FormModal {
  buyer: string,
  phone: number | string,
  state: string | undefined;
}

const TicketsModalBuy: FC<RafflesModalProps> = ({open, idTicket = "", onClose}) => {
  const [formModal, setFormModal] = useState<FormModal>({buyer: "", phone: "", state: ""}); 
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [form] = Form.useForm();

  if(!idTicket) return null;

  const onAccept = async () => {
    if(saving) return;

    try {
      setSaving(true);
      
      const reservationDate = firebase.firestore.Timestamp.now();
      const dataBuyer = { status: "Pagado", reservationDate, ...formModal };
      await serviceFirebase.updateDoc("tickets", idTicket, dataBuyer);

      onClose(true, dataBuyer);  
      setMessage("Boleto comprado con exito!");
      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (error) { 
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
    <Modal
      title="Comprar boleto"
      okButtonProps={{
        style: {backgroundColor: "orangered"}
      }}
      visible={open}
      cancelText="Cancelar"
      okText="Comprar"
      onCancel={() => onClose(false)}
      onOk={() => 
        form.validateFields()
          .then(async () => {
            await onAccept();
          })
      } 
      confirmLoading={saving}
    > 
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
            <Form.Item
              label="Estado"
              name="state"
              rules={[{ required: true, message: 'Favor de seleccioanr el Estado' }]}
            >
              <Select onChange={(value) => setFormModal({...formModal, state: value?.toString()})}>
              {
                states.map((state) => (
                  <Option value={state} key={state}>{state}</Option>
                ))                
              }
              </Select>
            </Form.Item>
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

export default TicketsModalBuy;
