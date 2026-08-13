import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Button, Columns, Stack, TypeFace, useTheme } from '@spooder/webui-component-library';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import ResponseCommandCheatSheet from '../../../tabs/eventsTab/eventCommand/response/ResponseCommandCheatSheet';
interface TextInputProps {
  formKey: string;
  label?: string;
  // Rendered inside a node card, where height is fixed by the graph's layout math: drops the
  // cheat sheet (which expands unpredictably) and scrolls instead of growing. The wheel
  // handler is stopped here too, otherwise scrolling the code would zoom the graph canvas.
  compact?: boolean;
}

const COMPACT_EDITOR_HEIGHT = 56;

export default function FormCodeInput(props: TextInputProps) {
  const { formKey, label, compact } = props;
  const { register, watch } = useFormContext();
  const { themeVariables } = useTheme();
  const [responseCheatSheetOpen, setResponseCheatSheetOpen] = useState(false);
  const value = watch(formKey);

  if (compact) {
    return (
      <div
        onWheel={(e) => e.stopPropagation()}
        style={{ height: COMPACT_EDITOR_HEIGHT, overflow: 'auto', borderRadius: 4 }}
      >
        <CodeEditor
          id={`code-${formKey}`}
          data-color-mode={themeVariables.isDarkTheme ? 'dark' : 'light'}
          className='response-code-editor'
          language='js'
          placeholder="return 'Hello '+event.displayName"
          style={{ fontSize: '0.7rem' }}
          value={value}
          {...register(formKey)}
        />
      </div>
    );
  }

  return (
    <Stack spacing='small'>
      <Columns spacing='medium'>
        <TypeFace fontSize='large'>{label} </TypeFace>
        <Button
          icon={faQuestionCircle}
          iconSize='large'
          onClick={() => {
            setResponseCheatSheetOpen(!responseCheatSheetOpen);
          }}
        />
      </Columns>
      <ResponseCommandCheatSheet isOpen={responseCheatSheetOpen} />
      <CodeEditor
        id={`code-${formKey}`}
        data-color-mode={themeVariables.isDarkTheme ? 'dark' : 'light'}
        className='response-code-editor'
        language='js'
        placeholder="return 'Hello '+event.displayName"
        style={{ fontSize: '1rem' }}
        value={value}
        {...register(formKey)}
      />
    </Stack>
  );
}
