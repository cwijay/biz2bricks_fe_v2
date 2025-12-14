import * as React from 'react';
import { Spinner } from '@fluentui/react-components';

export default function ProcessingDialog({
    message,
  showProgress
}: { message: string; showProgress: boolean }) {
  const [open, setOpen] = React.useState(showProgress);

  React.useEffect(() => {
    setOpen(showProgress);
  }, [showProgress]);

  return (
    <>
    { showProgress && (
        <Spinner
      label={message}
      ariaLive="assertive"  
        labelPosition="above"
        size="large"        
    />)}
    </>
    
  );
}
