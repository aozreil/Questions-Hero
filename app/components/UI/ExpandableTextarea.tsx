import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface IExpandableTextarea {
  collapseRows: () => void;
  clearValue: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  blur: () => void;
}

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{
  onEnter?: () => void;
  setHasValue?: (hasValue: boolean) => void;
}

export const ExpandableTextarea = forwardRef<
  IExpandableTextarea, Props>
  ((props, ref) => {
  const [hasValue, setHasValue] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (props.setHasValue) props.setHasValue(hasValue);
  }, [hasValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (hasValue && !e?.target?.value) setHasValue(false);
    if (!hasValue && e?.target?.value) setHasValue(true);

    calculateTextareaRows(e?.target?.value);
    props.onChange && props.onChange(e);
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key == 'Enter' && !e.shiftKey) {
      e.preventDefault();
      props.onEnter && props.onEnter();
    }
    props.onKeyDown && props.onKeyDown(e);
  }, []);

  const onFocus = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (textAreaRef.current) calculateTextareaRows(textAreaRef.current.value)
    props.onFocus && props.onFocus(e);
  }, []);

  const calculateTextareaRows = useCallback((text?: string) => {
    if (textAreaRef.current && text !== undefined) {
      const charactersCapacity = window.innerWidth > 600 ? 55 : 35;
      const rows = Math.min(Math.floor(text.length / charactersCapacity), 3) + 1;
      const hasNewLines = text.includes('\n');

      if (hasNewLines) {
        textAreaRef.current.rows = 3;
      } else if (rows !== textAreaRef.current.rows) {
        textAreaRef.current.rows = rows <= 3 ? rows : 3;
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    collapseRows: () => { if (textAreaRef.current) textAreaRef.current.rows = 1 },
    clearValue: () => { if (textAreaRef.current) textAreaRef.current.value = '' },
    getValue: () => ( textAreaRef.current ? textAreaRef.current.value : '' ),
    setValue: (value) => { if (textAreaRef.current) textAreaRef.current.value = value },
    blur: () => { if (textAreaRef.current) textAreaRef.current.blur() }
  }));

  return (
    <textarea
      {...props}
      rows={1}
      ref={textAreaRef}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
    />
  )
})