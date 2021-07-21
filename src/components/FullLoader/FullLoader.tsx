import { FC } from "react";
import { Spin } from 'antd';

const FullLoader: FC = () => {
  return <div style={{
    position: "absolute",
    left: "50%",
    top: "50%",
    WebkitTransform: "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)"
  }}>
    <Spin tip="Cargando..." />
  </div>;
};

export default FullLoader;