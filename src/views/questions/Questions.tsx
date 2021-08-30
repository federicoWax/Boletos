import { FC, useState } from 'react';
import { WhatsAppOutlined, FacebookOutlined } from '@ant-design/icons';
import { Box, Divider, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { MdHelp, MdList } from 'react-icons/md';
import { MenuOutlined } from '@ant-design/icons';
import logoLogin from '../../assets/login.jpg';
import { useHistory } from 'react-router-dom';

const Questions: FC = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const history = useHistory();
  
  return (
    <div>
       <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <img alt="rifas-login" height={110} style={{objectFit: "cover"}} src={logoLogin}/>
        <List>
          <ListItem button key={"/lista"} onClick={() => history.push("/lista")}>
            <MdList style={{color: "orangered", marginRight: 10, fontSize: 20}} />
            <ListItemText primary="Lista" />
          </ListItem>
          <Divider />
          <ListItem button key={"/preguntas"} onClick={() => history.push("/preguntas")}>
            <MdHelp style={{color: "orangered", marginRight: 10, fontSize: 20}} />
            <ListItemText primary="Preguntas" />
          </ListItem>
          <Divider />
        </List>
      </Drawer>
      <div style={{
        textAlign: "center", 
        width: "100%", 
        backgroundColor: "black", 
        position: "fixed", 
        zIndex: 999,
        height: 65,
        paddingRight: 32
      }}>
        <img alt="rifas-login" height={60} src={logoLogin}/>
        <MenuOutlined onClick={() => setOpenDrawer(true)} style={{color: "white", float: "left", paddingLeft: 20, paddingTop: 15, fontSize: 30}} />
      </div>
      <div 
        style={{
          paddingTop: 80, 
          color: "white", 
          backgroundColor: "orangered", 
          textAlign: "center", 
          fontSize: 30,
          paddingBottom: 18
        }}
      >
        PREGUNTAS FRECUENTES
      </div>
      <div style={{textAlign: "center", color: "orangered", marginTop: 20, fontSize: 20}}>
        ¿CÓMO SE ELIGE A LOS GANADORES?
      </div>
      <div style={{paddingLeft: 20, paddingRight: 20, textAlign: "center"}}>
        <div>
          Todos nuestros sorteos se realizan en base a la <a href="https://www.lotenal.gob.mx/Comercial/index.html">Lotería Nacional para la Asistencia Pública mexicana.</a>
          El ganador de Sorteos Salazar será el participante cuyo boleto coincida con las últimas cuatro cifras del 
          primer premio ganador de la Lotería Nacional (las fechas serán publicadas en nuestra página oficial).
        </div>
        <div 
          style={{ 
            color: "orangered", 
            fontSize: 20,
            marginTop: 10
          }}
        >
          ¿QUÉ SUCEDE CUANDO EL NÚMERO GANADOR ES UN BOLETO NO VENDIDO?
        </div>
        <div>
          Se elige un nuevo ganador realizando la misma dinámica en otra fecha cercana (se anunciará la nueva fecha).
          Esto significa que, ¡Tendrías el doble de oportunidades de ganar con tu mismo boleto!
        </div>
        <div
          style={{ 
            color: "orangered", 
            fontSize: 20,
            marginTop: 10
          }}
        >
          ¿DÓNDE SE PUBLICA A LOS GANADORES?
        </div>
        <div>
          En nuestra página oficial de Facebook <a href="https://www.facebook.com/rifashersonn/">Sorteos Salazar</a> puedes encontrar todos y cada uno de nuestros sorteos anteriores,
          así como las transmisiones en vivo con Lotería Nacional y las entregas de premios a los ganadores!
        </div>
        <div><b>Envíanos preguntas a</b></div>
      </div>
      <Box display="flex" justifyContent="center">
        <Box p={1} style={{fontSize: 20}}>
          <WhatsAppOutlined onClick={() => window.location.href = "https://wa.me/5216624334349"}/>
        </Box>
        <Box p={1} style={{fontSize: 20}}>
          <FacebookOutlined onClick={() => window.location.href = "https://www.facebook.com/rifashersonn/"} />
        </Box>
      </Box>
    </div>
  )
}

export default Questions;