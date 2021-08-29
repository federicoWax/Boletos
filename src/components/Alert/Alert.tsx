import { FC } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';
interface PropsErrorAlert {
  open: boolean;
  onClose: Function;
  message: string;
  severity: Color | undefined;
}

const AlertC: FC<PropsErrorAlert> = ({ open, onClose, message, severity, ...rest }) => {
  return (
    <Snackbar
      open={open}
      onClose={() => onClose()}>
      <Alert
        severity={severity}
        elevation={6}
        variant="filled"
        onClose={() => onClose}
        { ...rest }
        >
        { message }
      </Alert>
    </Snackbar>
  );
};

export default AlertC;