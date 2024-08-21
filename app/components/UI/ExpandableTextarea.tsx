import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";

export interface IExpandableTextarea {
  collapseRows: () => void;
  clearValue: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  blur: () => void;
  scrollToTop: () => void;
}

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{
  onEnter?: () => void;
  setHasValue?: (hasValue: boolean) => void;
}

export const ExpandableTextarea = forwardRef<
  IExpandableTextarea, Props>
  ((props, ref) => {
  const [hasValue, setHasValue] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isUserInitiated, setIsUserInitiated] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const cashedInputText = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (props.setHasValue) props.setHasValue(hasValue);
  }, [hasValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const eventText = e.target?.value
    if (cashedInputText.current === eventText) return;

    cashedInputText.current = eventText
    if (hasValue && !eventText) setHasValue(false);
    if (!hasValue && eventText) setHasValue(true);

    calculateTextareaRows(eventText);
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
    if (!isUserInitiated) return;
    if (textAreaRef.current) calculateTextareaRows(textAreaRef.current.value)
    setIsFocused(true);
    props.onFocus && props.onFocus(e);
  }, [isUserInitiated]);

  const onBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    props.onBlur && props.onBlur(e);
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
    blur: () => { if (textAreaRef.current) textAreaRef.current.blur() },
    scrollToTop: () => { if (textAreaRef.current) textAreaRef.current.scrollTop = 0 }
  }));

  return (
    <textarea
      placeholder={props.placeholder}
      name={props.name}
      rows={1}
      ref={textAreaRef}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={() => setIsUserInitiated(true)}
      onMouseLeave={() => setIsUserInitiated(false)}
      className={clsx(props.className, !isFocused && 'overflow-y-hidden')}
      autoFocus={false}
    />
  )
})