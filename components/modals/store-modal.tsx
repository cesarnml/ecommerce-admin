"use client";

import { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

type Props = {
  children?: ReactNode;
};

export const StoreModal = ({ children }: Props) => {
  const storeModal = useStoreModal();
  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Future Create Store Form
    </Modal>
  );
};
