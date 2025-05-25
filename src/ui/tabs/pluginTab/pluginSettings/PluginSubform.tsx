import React, { useEffect, useState } from 'react';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import PluginInput from './pluginInput/PluginInput';
import {
  translateCondition,
  SelectDropdown,
  TextInput,
  Stack,
  Button,
  Expandable,
  Box,
  FormTextInput,
  FormSelectDropdown,
} from '@greysole/spooder-component-library';
import { useFormContext } from 'react-hook-form';
import { KeyedObject } from '../../../Types';
import PluginMultiInput from './pluginInput/PluginMultiInput';
import SubExpandable from '../../../common/input/general/SubExpandable';
import { usePluginSettingsContext } from './context/PluginSettingsContext';

interface PluginSubformProps {
  formKey: string;
}

export default function PluginSubform(props: PluginSubformProps) {
  const { formKey } = props;
  const { form, defaults } = usePluginSettingsContext();
  const { setValue, getValues } = useFormContext();
  const subform = form[formKey].form;
  const [clones, setClones] = useState({ ...getValues(formKey) });
  const label = form[formKey].label;

  useEffect(() => {
    const newNames: KeyedObject = {};
    for (let v in clones) {
      newNames[v] = v;
    }
    setValue(`${formKey}._name_changes`, newNames);
  }, [clones]);

  const removeForm = (key: string) => {
    const newValues = { ...clones };
    const nameChanges = { ...getValues(`${formKey}._name_changes`) };
    delete newValues[key];
    setValue(formKey, newValues);
    const newNames = { ...nameChanges };
    delete newNames[key];

    setClones(newValues);
  };

  const addForm = () => {
    const newValues = { ...clones };
    const newFormName = `newform${Object.keys(newValues).length + 1}`;
    newValues[newFormName] = Object.assign({}, defaults[formKey]);
    console.log('DEFAULTS', defaults[formKey]);
    const nameChanges = { ...getValues(`${formKey}._name_changes`) };

    setValue(formKey, newValues);
    setValue(`${formKey}._name_changes`, {
      ...nameChanges,
      [newFormName]: newFormName,
    });
    setClones(newValues);
  };

  let subClones = [];
  for (let se in clones) {
    let subInputs = [];
    for (let fe in subform) {
      if (fe === 'keyname') {
        continue;
      }
      subInputs.push(
        !subform[fe]['multi-select'] ? (
          <PluginInput
            key={`${formKey}.${se}.${fe}`}
            formKey={`${formKey}.${se}.${fe}`}
            type={subform[fe].type}
            label={subform[fe].label}
            options={subform[fe].options}
          />
        ) : (
          <PluginMultiInput
            key={`${formKey}.${se}.${fe}`}
            formKey={`${formKey}.${se}.${fe}`}
            type={subform[fe].type}
            label={subform[fe].label}
            options={subform[fe].options}
          />
        ),
      );
    }

    let keyInput = undefined;

    if (!subform.keyname) {
      keyInput = (
        <FormTextInput label={'Key Name'} formKey={`${formKey}._name_changes.${se}`} jsonFriendly />
      );
    } else {
      if (subform.keyname.type === 'select') {
        const optionArray = [{ label: 'None', value: '' }];

        for (let o in subform.keyname.options.selections) {
          optionArray.push({ label: subform.keyname.options?.selections[o], value: o });
        }

        keyInput = (
          <FormSelectDropdown
            label={subform.keyname.label}
            options={optionArray}
            formKey={`${formKey}._name_changes.${se}`}
          />
        );
      } else {
        keyInput = (
          <FormTextInput
            label={subform.keyname.label}
            formKey={`${formKey}._name_changes.${se}`}
            jsonFriendly
          />
        );
      }
    }

    subClones.push(
      <SubExpandable label={se} key={`subelement-${formKey}.${se}`}>
        <Stack width='100%' spacing='medium' padding='small'>
          {keyInput}
          {subInputs}
          <Box width='100%' justifyContent='flex-end'>
            <Button icon={faTrash} onClick={() => removeForm(se)} />
          </Box>
        </Stack>
      </SubExpandable>,
    );
  }

  return (
    <Expandable label={label}>
      <Box flexFlow='column'>
        <Box flexFlow='column'>{subClones}</Box>
        <Button icon={faPlus} onClick={addForm} />
      </Box>
    </Expandable>
  );
}
