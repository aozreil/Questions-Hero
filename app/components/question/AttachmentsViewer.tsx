import { IQuestionAttachment } from "~/models/questionModel";
import ExpandImage from "~/components/question/ExpandImage";
import { useState } from "react";

interface Props {
  attachments: IQuestionAttachment[];
}

export default function AttachmentsViewer({ attachments }: Props) {
  const [expandedImage, setExpandedImage] = useState<string | undefined>(undefined);

  return (
    attachments?.length
    ? <>
        <ExpandImage expandedImage={expandedImage} onClose={() => setExpandedImage(undefined)} />
        {attachments?.map(file => (
          <button onClick={() => setExpandedImage(file?.url)} key={file?.key}>
            <img
              src={file?.url}
              className='w-full h-[21rem] object-contain mb-2'
            />
          </button>
        ))}
      </>
    : null
  )
}