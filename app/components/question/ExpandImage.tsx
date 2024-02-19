import CloseModal from "~/components/question/CloseModal";

interface Props {
    expandedImage?: string;
    onClose?: () => void;
}

export default function ExpandImage({ expandedImage, onClose }: Props) {
    return (
        !expandedImage ? null :  (
            <div className='max-sm:hidden fixed w-screen h-screen z-50'>
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm cursor-pointer"
                    aria-hidden="true"
                    onClick={onClose}
                />
                <CloseModal handleClose={onClose} />
                <img
                    src='/assets/images/question-image.png'
                    alt='question-image'
                    className='z-50 fixed h-[90%] max-w-[90%] w-fit object-contain left-0 right-0 top-0 bottom-0 m-auto'
                />
            </div>
        )
    )
}