import React from "react";

export default function CloseModal({ handleClose }: { handleClose?: () => void }) {
    return (
        <img
            className="absolute right-10 top-10 z-50 h-5 w-5 cursor-pointer"
            src="/assets/images/close-modal-icon.svg"
            alt="close-modal"
            onClick={handleClose}
        />
    )
}