import { FC, useState } from 'react';
import { Modal, Row, Col, Form, Input, DatePicker, Typography, Divider, Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { PaymentMethod, Promotion, Raffle, Ticket } from './interfaces';
import firebase from "../../firebase/firebase";
import moment from 'moment';
import ServiceFirebase from '../../services/firebase';

const serviceFirebase = new ServiceFirebase();
interface RafflesModalProps {
  open: boolean,
  onClose: Function,
}

const INIT_RAFFLE = {
  id: "",
  name: "",
  description: "",
  finalDate: null,
  promotions: [],
  paymentMethods: [],
  images: [],
  image: null,
  active: true,
  priceTicket: 0,
  countTickets: 0
}

const RafflesModal: FC<RafflesModalProps> = ({open, onClose}) => {
  const [raffle, setRaffle] = useState<Raffle>(INIT_RAFFLE);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState<boolean>(false);

  const add = async () => {
    if(!raffle.image) {
      message.error("Favor de seleccionar una Imagen para la Rifa");
      return;
    };

    if(saving) return;

    try {
      setSaving(true);

      const _rafle = {...raffle};
      const tickets: Ticket[] = [];

      if(!_rafle.image) {
        _rafle.image = {
          imagePath: "",
          imageUrl: "",
        };
      } else {
        const path = "/carros";
        const url = await serviceFirebase.uploadFirebase(path, _rafle.image as File);

        _rafle.image = {
          imagePath: path,
          imageUrl: url,
        };
      }
      
      for (let i = 0; i < _rafle.countTickets; i++) {
        tickets.push({
          buyer: "",
          status: "Libre",
          number: i + 1 
        });
      }

      await serviceFirebase.add("raffles", _rafle, "tickets", tickets);

      message.success("Rifa guardada con exito");
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
      form.resetFields();
      setRaffle(INIT_RAFFLE);
      onClose();
    }
  }

  
  const update = async () => {
    onClose();
  }

  const onCancel = async () => {
    form.resetFields();
    setRaffle(INIT_RAFFLE);
    onClose();
  }

  return (
    <Modal  
      destroyOnClose={true}
      confirmLoading={saving}
      title={raffle.id ? "Editar rifa" : "Agregar rifa"} 
      visible={open} 
      onOk={() => 
        form.validateFields()
        .then(async () => {
          raffle.id ? await update() : await add();
        })
        .catch(() => {})
      } 
      onCancel={onCancel} 
      width={1000}
      cancelText="Cerrar"
      okText="Guardar"
    >
      <Form 
        form={form}
        layout="vertical" 
        style={{overflowY: "auto", overflowX: "hidden", maxHeight: 500}}
      >
        <Row gutter={10}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Nombre"
              name="name"
              rules={[{ required: true, message: 'Favor de escribir el Nombre' }]}
            >
              <Input 
                value={raffle.name} 
                onChange={(e) => setRaffle({...raffle, name: e.target.value}) }
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Form.Item
              label="Fecha Cierre"
              name="finalDate"
              rules={[{ required: true, message: 'Favor de seleccionar la Fecha de Cierre' }]}
            >
              <DatePicker 
                placeholder="" 
                onChange={(e) => setRaffle({...raffle, finalDate: e !== null ? firebase.firestore.Timestamp.fromDate(e.toDate()) : null }) }
                value={raffle.finalDate === null ? raffle.finalDate : moment(raffle.finalDate?.toDate())}
              />
            </Form.Item>
          </Col>
          <Col xs={6} sm={6} md={6}>
            <Form.Item
              label="Boletos"
              name="countTickets"
              rules={[{ required: true, message: 'Favor de escribir la Cantidad de boletos' }]}
            >
              <Input 
                type="number" 
                min="1"
                value={raffle.countTickets} 
                onChange={(e) => setRaffle({...raffle, countTickets: parseInt(e.target.value)}) }
              />
            </Form.Item>
          </Col>
          <Col xs={6} sm={6} md={6}>
            <Form.Item
              label="Precio"
              name="priceTicket"
              rules={[{ required: true, message: 'Favor de escribir el Precio del boleto' }]}
            >
              <Input 
                type="number" 
                min="1"
                value={raffle.priceTicket} 
                onChange={(e) => setRaffle({...raffle, priceTicket: parseFloat(e.target.value)}) }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label="Descripción"
              name="description"
              rules={[{ required: true, message: 'Favor de escribir la Descripción' }]}
            >
              <Input.TextArea 
                value={raffle.description} 
                onChange={(e) => setRaffle({...raffle, description: e.target.value}) }
                rows={3}  
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Row>
              <Col xs={20} sm={20} md={20}>
                <Typography.Text>Promociones</Typography.Text>
              </Col>
              <Col xs={4} sm={4} md={4}>
                <Button 
                  icon={<PlusOutlined />} 
                  type="primary"
                  onClick={() => setRaffle({...raffle, promotions: [...raffle.promotions, { description: "", discount: 0, countTickets: 0 }] })} 
                />
              </Col>
              <Col xs={24} sm={24} md={24}>
              {
                raffle.promotions.map((promotion: Promotion, index: number) => (
                  <Row key={index} gutter={10}>
                    <Col xs={20} sm={20} md={20}>
                      <Form.Item label="Descripción">
                        <Input.TextArea 
                          rows={2} 
                          value={promotion.description} 
                          onChange={(e) => 
                            setRaffle({
                              ...raffle, 
                              promotions: raffle.promotions.map((p, i) => ({...p, description: i === index ? e.target.value : p.description}))
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <Button 
                        icon={<DeleteOutlined />} 
                        style={{backgroundColor: "red", color: "white", marginTop: 30}}
                        onClick={() => setRaffle({...raffle, promotions: raffle.promotions.filter((p, i) => i !== index) })} 
                      />
                    </Col>
                    <Col xs={12} sm={12} md={12}>
                      <Form.Item label="Descuento">
                        <Input 
                          onChange={(e) => 
                            setRaffle({
                              ...raffle, 
                              promotions: raffle.promotions
                                .map((p, i) => ({...p, discount: i === index ? e.target.value ? parseFloat(e.target.value) : e.target.value : p.discount}))
                            })
                          }
                          value={promotion.discount} 
                          type="number" 
                          min="1" 
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={12}>
                      <Form.Item label="Cantidad de boletos">
                        <Input 
                          onChange={(e) => 
                            setRaffle({
                              ...raffle, 
                              promotions: raffle.promotions
                                .map((p, i) => ({...p, countTickets: i === index ? e.target.value ? parseInt(e.target.value) : e.target.value : p.countTickets}))
                            })
                          }
                          value={promotion.countTickets} 
                          type="number" 
                          min="1" 
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))
              }
              </Col>
            </Row>
          </Col>
          <Divider />
          <Col xs={24} sm={24} md={24}>
            <Row>
              <Col xs={20} sm={20} md={20}>
                <Typography.Text>Metodos de pago</Typography.Text>
              </Col>
              <Col xs={4} sm={4} md={4}>
                <Button 
                  icon={<PlusOutlined />} 
                  type="primary"
                  onClick={() => setRaffle({...raffle, paymentMethods: [...raffle.paymentMethods, { description: "", number: "", typePayment: "" }] })} 
                />
              </Col>
              <Col xs={24} sm={24} md={24}>
              {
                raffle.paymentMethods.map((paymentMethod: PaymentMethod, index: number) => (
                  <Row key={index} gutter={10}>
                    <Col xs={20} sm={20} md={20}>
                      <Form.Item label="Tipo de pago">
                        <Input 
                          value={paymentMethod.typePayment} 
                          onChange={(e) => 
                            setRaffle({
                              ...raffle, 
                              paymentMethods: raffle.paymentMethods.map((p, i) => ({...p, typePayment: i === index ? e.target.value : p.typePayment}))
                            })
                          } 
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <Button 
                        icon={<DeleteOutlined />} 
                        style={{backgroundColor: "red", color: "white", marginTop: 30}}
                        onClick={() => setRaffle({...raffle, paymentMethods: raffle.paymentMethods.filter((p, i) => i !== index) })} 
                      />
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                      <Form.Item  label="Descripción">
                        <Input.TextArea 
                          rows={2} 
                          value={paymentMethod.description}
                          onChange={(e) => 
                            setRaffle({
                              ...raffle, 
                              paymentMethods: raffle.paymentMethods.map((p, i) => ({...p, description: i === index ? e.target.value : p.description}))
                            })
                          } 
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                      <Form.Item label="Numero de cuenta o tarjeta">
                        <Input 
                          value={paymentMethod.number} 
                          onChange={(e) => 
                            setRaffle({
                              ...raffle, 
                              paymentMethods: raffle.paymentMethods.map((p, i) => ({...p, number: i === index ? e.target.value : p.number}))
                            })
                          } 
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))
              }
              </Col>
              <Divider />
              <Input type="file" accept="image/png, image/gif, image/jpeg" onChange={(e) => setRaffle({...raffle, image: e.target.files?.item(0) })} />
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default RafflesModal;