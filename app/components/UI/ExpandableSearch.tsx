import {useCallback, useRef, useState} from "react";

export default function ExpandableSearch() {
    const [hasValue, setHasValue] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (hasValue && !e?.target?.textContent) setHasValue(false);
        if (!hasValue && e?.target?.textContent) setHasValue(true);
    }

    const handleCancelClick = useCallback(() => {
        setHasValue(false);
        if (inputRef.current) inputRef.current.textContent = '';
    }, []);

    return (
        <div className='z-10 pt-4 pl-4 pr-3 bg-white border border-[#2b2b2b] min-h-[60px] h-fit w-[737px] rounded-[30px] flex items-start justify-between'>
            <img src='/assets/images/search-icon.svg' alt='search' className='cursor-pointer' width={27} height={27} />
            <span
                ref={inputRef}
                className='search-textarea text-left pt-0.5 flex-1 mx-3 max-h-[158px] bg-white outline-none text-xl'
                role='textbox'
                contentEditable={true}
                onInput={handleChange}
            />
            {hasValue && (
                <img
                    src='/assets/images/big-search-cancel.svg'
                    alt='cancel'
                    className='cursor-pointer'
                    width={30}
                    height={30}
                    onClick={handleCancelClick}
                />
            )}
        </div>
    )
}