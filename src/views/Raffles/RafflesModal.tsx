import { FC, useEffect, useState } from 'react';
import { Modal, Row, Col, Form, Input, DatePicker, Typography, Divider, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { PaymentMethod, Promotion } from './interfaces';

interface RafflesModalProps {
  open: boolean,
  onClose: Function
}

const RafflesModal: FC<RafflesModalProps> = ({open, onClose}) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const onOk = async () => {
    onClose();
  }

  const onCancel = async () => {
    onClose();
  }

  return (
    <Modal  
      title="Agregar rifa" 
      visible={open} 
      onOk={onOk} 
      onCancel={onCancel} 
      width={1000}
      cancelText="Cerrar"
      okText="Guardar"
    >
      <Form layout="vertical" style={{overflowY: "auto", overflowX: "hidden", maxHeight: 500}}>
        <Row gutter={10}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Nombre"
              name="name"
              rules={[{ required: true, message: 'Favor de escribir el Nombre!' }]}
            >
              <Input/>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Form.Item
              label="Fecha Cierre"
              name="finalDate"
              rules={[{ required: true, message: 'Favor de seleccionar la Fecha de Cierre!' }]}
            >
              <DatePicker placeholder="" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Form.Item
              label="Cantidad de boletos"
              name="countTickets"
              rules={[{ required: true, message: 'Favor de escribir la Cantidad de boletos!' }]}
            >
              <Input type="number" min="1"/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label="Descripción"
              name="description"
              rules={[{ required: true, message: 'Favor de escribir la Descripción!' }]}
            >
              <Input.TextArea rows={3}  />
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
                  onClick={() => setPromotions([...promotions, { description: "", discount: 0, countTickets: 0 } as Promotion])} 
                />
              </Col>
              <Col xs={24} sm={24} md={24}>
              {
                promotions.map((promotion: Promotion, index: number) => (
                  <Row key={index} gutter={10}>
                    <Col xs={20} sm={20} md={20}>
                      <Form.Item label="Descripción">
                        <Input.TextArea rows={2} value={promotion.description} />
                      </Form.Item>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <Button 
                        icon={<DeleteOutlined />} 
                        style={{backgroundColor: "red", color: "white", marginTop: 30}}
                        onClick={() => setPromotions(promotions.filter((p, i) => i !== index))} 
                      />
                    </Col>
                    <Col xs={12} sm={12} md={12}>
                      <Form.Item label="Descuento">
                        <Input value={promotion.discount} type="number" min="1" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={12}>
                      <Form.Item label="Cantidad de boletos">
                        <Input value={promotion.countTickets} type="number" min="1" />
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
                  onClick={() => setPaymentMethods([...paymentMethods, { description: "", number: "", typePayment: "" } as PaymentMethod])} 
                />
              </Col>
              <Col xs={24} sm={24} md={24}>
              {
                paymentMethods.map((paymentMethod: PaymentMethod, index: number) => (
                  <Row key={index} gutter={10}>
                    <Col xs={20} sm={20} md={20}>
                      <Form.Item label="Tipo de pago">
                        <Input value={paymentMethod.typePayment} />
                      </Form.Item>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <Button 
                        icon={<DeleteOutlined />} 
                        style={{backgroundColor: "red", color: "white", marginTop: 30}}
                        onClick={() => setPaymentMethods(paymentMethods.filter((p, i) => i !== index))} 
                      />
                    </Col>
                    <Col xs={24} sm={24} md={24} style={{marginTop: -15}}>
                      <Form.Item label="Descripción">
                        <Input.TextArea rows={2} value={paymentMethod.description} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} style={{marginTop: -15}}>
                      <Form.Item label="Numero de cuenta o tarjeta">
                        <Input value={paymentMethod.number} />
                      </Form.Item>
                    </Col>
                  </Row>
                ))
              }
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default RafflesModal;
