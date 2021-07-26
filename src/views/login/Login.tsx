import { ChangeEvent, FC, useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import logoLogin from '../../assets/login.png';
import firebase from '../../firebase/firebase';

interface Account {
  email: string;
  passowrd: string;
}

const Login : FC = () => {
  const [account, setAccount] = useState<Account>({email: "", passowrd: ""});
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async () => {
    if(loading) return;

    try {
      setLoading(true);
      
      await firebase.auth().signInWithEmailAndPassword(account.email, account.passowrd);
    } catch (error) {
      console.log(error);
      message.error("Error, datos incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{marginTop: "15vh"}}>
      <Row justify="center">
        <Col style={{width: 400}}>
          <img alt="botes-login" height={250} style={{width: "90%", marginBottom: 20, paddingLeft: 40}} src={logoLogin}/>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Correo"
              name="email"
              rules={[{ required: true, message: 'Favor de escribir el correo.' }]}
            >
              <Input value={account.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setAccount({...account, email: e.target.value})} />
            </Form.Item>
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Favor de escribir la contraseña.' }]}
            >
              <Input.Password value={account.passowrd} onChange={(e: ChangeEvent<HTMLInputElement>) => setAccount({...account, passowrd: e.target.value})} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default Login;