import { FC, useEffect, useState } from 'react';
import { Modal, Row, Col, Form, Input, DatePicker, Typography, Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Promotion, RaffleEditFirebase } from './interfaces';
import firebase from "../../firebase/firebase";
import moment from 'moment';
import ServiceFirebase from '../../services/firebase';

const serviceFirebase = new ServiceFirebase();

interface RafflesModalProps {
  open: boolean,
  onClose: Function,
  raffleProp: RaffleEditFirebase | null
}

const RafflesModalEdit: FC<RafflesModalProps> = ({open, onClose, raffleProp}) => {
  const [raffle, setRaffle] = useState<RaffleEditFirebase | null>(raffleProp);
  const [saving, setSaving] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if(raffleProp) {
      form.setFieldsValue(raffleProp);
      setRaffle(raffleProp);
    }
  }, [raffleProp, form])

  if(raffle === null) return null;

  const update = async () => {
    if(!raffle.image) {
      message.error("Favor de seleccionar una Imagen para la Rifa");
      return;
    };

    if(saving) return;

    try {
      setSaving(true);

      const _rafle = {...raffle};

      if(_rafle.image && _rafle.image instanceof File) {
        const path = "/carros";
        const url = await serviceFirebase.uploadFirebase(path, _rafle.image);

        _rafle.image = {
          imagePath: path,
          imageUrl: url,
        };
      }

      const id = _rafle.id;
      
      delete _rafle.id; 

      await firebase.firestore().collection("raffles").doc(id).update(_rafle);

      message.success("Rifa guardada con exito");
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
      onClose();
    }
  }

  const onCancel = () => {
    onClose();
  }

  return (
    <Modal  
      destroyOnClose={true}
      confirmLoading={saving}
      title={"Editar rifa"} 
      visible={open} 
      onOk={() => 
        form.validateFields()
        .then(update)
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
          <Col xs={24} sm={24} md={6}>
            <DatePicker 
              style={{width: "100%", marginTop: 30}}
              showTime 
              placeholder="" 
              onChange={(e) => setRaffle({...raffle, finalDate: e !== null ? firebase.firestore.Timestamp.fromDate(e.toDate()) : null }) }
              value={moment(raffle.finalDate?.toDate())}
            />
          </Col>
          <Col xs={12} sm={12} md={12}>
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
          <Input
            style={{marginTop: 20}} 
            type="file" 
            accept="image/png, image/gif, image/jpeg" 
            onChange={(e) => setRaffle({...raffle, image: e.target.files?.item(0) })} 
          />
          { 
            raffle.image
              ? 
                <img 
                  alt="rifas-login" 
                  height={120} 
                  style={{ padding: 10,  borderRadius: "25%"}} 
                  src={raffle.image instanceof File ? URL.createObjectURL(raffle.image) : raffle.image.imageUrl}
                /> 
              : null
          }
        </Row>
      </Form>
    </Modal>
  )
}

export default RafflesModalEdit;