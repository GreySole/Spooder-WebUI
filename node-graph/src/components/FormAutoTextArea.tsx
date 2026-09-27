import { Stack, TypeFace } from '@spooder/webui-component-library';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

interface FormAutoTextAreaProps {
  formKey: string;
  label?: string;
  // Where the box stops growing and starts scrolling instead.
  maxHeight?: number;
}

// Roughly three lines and twelve lines at the inspector's body size. The floor keeps an empty
// Template from opening as a single-line slot; the ceiling stops a long block of text from
// pushing the rest of the panel - the description, the test panel, Delete Node - off the bottom.
const MIN_HEIGHT = 66;
const DEFAULT_MAX_HEIGHT = 260;

// The library's FormTextAreaInput puts its caption inside the same <label> element as the
// control, which lays the text out beside a default-width (20 column) box: in a resizable
// inspector pane that leaves the value wrapping in a narrow column with dead space next to it.
// This one stacks the caption above a textarea that fills the pane and grows with its content.
export default function FormAutoTextArea(props: FormAutoTextAreaProps) {
  const { formKey, label, maxHeight = DEFAULT_MAX_HEIGHT } = props;
  const { register, watch } = useFormContext();
  const value = watch(formKey, '') ?? '';
  // Split off register's ref so the element can be measured here as well as tracked by the form.
  const { ref: registerRef, ...registration } = register(formKey);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputId = `textarea-${formKey}`;

  const fitToContent = useCallback(() => {
    const element = textAreaRef.current;
    if (!element) {
      return;
    }
    // scrollHeight never reports less than the box's own height, so the height has to be
    // released before measuring - otherwise deleting a line leaves the box at its old size.
    element.style.height = 'auto';
    const contentHeight = element.scrollHeight;
    element.style.height = `${Math.min(Math.max(contentHeight, MIN_HEIGHT), maxHeight)}px`;
    element.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
  }, [maxHeight]);

  useLayoutEffect(fitToContent, [fitToContent, value]);

  // The inspector pane is user-resizable and narrowing it rewraps the text into more lines.
  // Width is compared explicitly because this observer also fires on the height changes made
  // above, which would otherwise re-enter the measurement on every keystroke.
  useLayoutEffect(() => {
    const element = textAreaRef.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }
    let lastWidth = element.clientWidth;
    const observer = new ResizeObserver(() => {
      if (element.clientWidth === lastWidth) {
        return;
      }
      lastWidth = element.clientWidth;
      fitToContent();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [fitToContent]);

  return (
    <Stack spacing='small'>
      <label htmlFor={inputId}>
        <TypeFace fontWeight='bold'>{label}</TypeFace>
      </label>
      <textarea
        id={inputId}
        value={value}
        {...registration}
        ref={(element) => {
          textAreaRef.current = element;
          registerRef(element);
        }}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          minHeight: MIN_HEIGHT,
          // Height is owned by fitToContent, and a manual drag would be undone by the next
          // keystroke - so the grabber is taken away rather than left to fight it.
          resize: 'none',
          overflowY: 'hidden',
        }}
      />
    </Stack>
  );
}
