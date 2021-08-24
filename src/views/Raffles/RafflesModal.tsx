import { FC, useEffect, useState } from 'react';
import { Modal, Row, Col, Form, Input, DatePicker } from 'antd';

interface RafflesModalProps {
  open: boolean,
  onClose: Function
}

const RafflesModal: FC<RafflesModalProps> = ({open, onClose}) => {
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
      <Form layout="vertical">
        <Row gutter={10}>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              label="Nombre"
              name="name"
              rules={[{ required: true, message: 'Favor de escribir el Nombre!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              label="Descripción"
              name="description"
              rules={[{ required: true, message: 'Favor de escribir la Descripción!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              label="Fecha Cierre"
              name="finalDate"
              rules={[{ required: true, message: 'Favor de seleccionar la Fecha de Cierre!' }]}
            >
              <DatePicker placeholder="" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default RafflesModal;
