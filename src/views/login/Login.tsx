import { FC, useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import logoLogin from '../../assets/login.jpg';
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
          <div style={{textAlign: "center"}}>
            <img alt="rifas-login" height={250} style={{ marginBottom: 20, borderRadius: "25%"}} src={logoLogin}/>
          </div>
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
              <Input value={account.email} onChange={(e) => setAccount({...account, email: e.target.value})} />
            </Form.Item>
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Favor de escribir la contraseña.' }]}
            >
              <Input.Password value={account.passowrd} onChange={(e) => setAccount({...account, passowrd: e.target.value})} />
            </Form.Item>
            <Form.Item>
              <div style={{textAlign: "center"}}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Entrar
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default Login;