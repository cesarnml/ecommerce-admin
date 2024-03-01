"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

type Props = {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export const Modal = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}: Props) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
