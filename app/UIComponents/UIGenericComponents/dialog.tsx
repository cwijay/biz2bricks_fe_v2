import * as React from 'react';
import { 
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogBody,
    DialogTitle,
    DialogContent,
    Button
} from '@fluentui/react-components';

export const DialogMessage = ({
  message, showDialog,
}: { message: string; showDialog: boolean }) => {
  const [open, setOpen] = React.useState(showDialog);

  React.useEffect(() => {
    setOpen(showDialog);
  }, [showDialog]);

  return (
   <>
    { showDialog && (
       <Dialog modalType="non-modal" open={open} onOpenChange={(_event: unknown, data: { open: boolean }) => setOpen(data.open)}>
        <DialogSurface>
        <DialogBody>
          <DialogTitle>Message</DialogTitle>
          <DialogContent>{message}</DialogContent>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogBody>
      </DialogSurface>
    </Dialog>
      )}
   </>
  );
};
