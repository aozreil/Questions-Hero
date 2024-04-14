import React from "react";
import { Dialog } from "@headlessui/react";

interface Props {
  open: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  disableBackdrop?: string;
}

export default function CustomModal({ open, closeModal, children, disableBackdrop }: Props) {
  return (
    <Dialog open={open} onClose={closeModal}>
      <Dialog.Panel className='w-screen h-screen flex items-center justify-center fixed bg-transparent z-[100] top-0 left-0'>
        {!disableBackdrop && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
            onClick={closeModal}
          />
        )}
        {children}
      </Dialog.Panel>
    </Dialog>
  )
}