import {useCallback, useRef, useState} from "react";

export default function HeaderSearch() {
    const [hasValue, setHasValue] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (hasValue && !e?.target?.value) setHasValue(false);
        if (!hasValue && e?.target?.value) setHasValue(true);
    }

    const handleCancelClick = useCallback(() => {
        setHasValue(false);
        if (inputRef.current) inputRef.current.value = '';
    }, []);

    return (
        <div className='ml-6 pl-4 pr-3 bg-[#f8f8f8] border border-[#99a7af] h-[38px] w-[543px] rounded-lg flex items-center justify-between'>
            <img src='/assets/images/search-icon.svg' alt='search' className='cursor-pointer' width={18} height={18} />
            <input ref={inputRef} className='flex-1 mx-2 bg-[#f8f8f8] outline-none' onChange={handleChange} />
            {hasValue && (
                <img
                    src='/assets/images/search-cancel.svg'
                    alt='cancel'
                    className='cursor-pointer'
                    width={16}
                    height={16}
                    onClick={handleCancelClick}
                />
            )}
        </div>
    )
}