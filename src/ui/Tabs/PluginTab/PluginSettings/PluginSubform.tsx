import React, { useEffect, useState } from 'react';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import PluginInput from './PluginInput';
import PluginMultiInput from './PluginMultiInput';
import { useFormContext } from 'react-hook-form';
import TextInput from '../../../common/input/controlled/TextInput';
import SelectDropdown from '../../../common/input/controlled/SelectDropdown';
import { KeyedObject } from '../../../Types';
import { translateCondition } from '../../../util/ScriptUtil';
import Stack from '../../../common/layout/Stack';
import Button from '../../../common/input/controlled/Button';
import Box from '../../../common/layout/Box';
import EventExpandable from '../../eventsTab/eventCommand/EventExpandable';
import useTheme from '../../../../app/hooks/useTheme';

interface PluginSubformProps {
  formKey: string;
  pluginName: string;
  label: string;
  form: any;
  defaults: any;
}

export default function PluginSubform(props: PluginSubformProps) {
  const { formKey, pluginName, label, form, defaults } = props;
  const [nameChanges, setNameChanges] = useState<KeyedObject>({});
  const { watch, setValue } = useFormContext();
  const values = watch(formKey);
  console.log('SUBFORM', form, 'VALUES', values, 'DEFAULTS', defaults);

  useEffect(() => {
    const newNames: KeyedObject = {};
    for (let v in values) {
      newNames[v] = v;
    }
    setNameChanges(newNames);
  }, []);

  const removeForm = (key: string) => {
    const newValues = { ...values };
    delete newValues[key];
    setValue(formKey, newValues);
    const newNames = { ...nameChanges };
    delete newNames[key];
    setNameChanges(newNames);
  };

  const addForm = () => {
    const newValues = { ...values };
    const defaultValue = { ...defaults };
    delete defaultValue['keyname'];
    newValues['newform1'] = Object.assign({}, defaults[formKey]);
    console.log('DEFAULTS', defaults[formKey]);
    setValue(formKey, newValues);
    setNameChanges({
      ...nameChanges,
      newform1: 'newform1',
    });
  };

  let subClones = [];
  for (let se in values) {
    let subInputs = [];
    for (let fe in form) {
      if (fe === 'keyname') {
        continue;
      }
      //console.log("SUBFORM", se, fe)
      if (form[fe].showif) {
        if (values[se][form[fe].showif.variable] != null) {
          let variable = values[se][form[fe].showif.variable];
          if (typeof variable == 'string') {
            variable = "'" + variable + "'";
          }
          let value = form[fe].showif.value;
          if (typeof value == 'string') {
            value = "'" + value + "'";
          }
          //console.log("SHOW IF",""+variable+this.translateCondition(form[fe].showif.condition)+value, value);
          if (!eval('' + variable + translateCondition(form[fe].showif.condition) + value)) {
            //console.log("HIDE", se);
            continue;
          }
        } else {
          continue;
        }
      }
      //console.log(this.state.default);
      //console.log('SUB INPUT', `${formkey}.${fe}`, se);
      subInputs.push(
        !form[fe]['multi-select'] ? (
          <PluginInput
            key={`${formKey}.${se}.${fe}`}
            formKey={`${formKey}.${se}.${fe}`}
            pluginName={pluginName}
            type={form[fe].type}
            label={form[fe].label}
            options={form[fe].options}
            defaultValue={defaults[fe]}
          />
        ) : (
          <PluginMultiInput
            key={`${formKey}.${se}.${fe}`}
            formKey={`${formKey}.${se}.${fe}`}
            pluginName={pluginName}
            type={form[fe].type}
            label={form[fe].label}
            options={form[fe].options}
            defaultValue={defaults[fe]}
          />
        ),
      );
    }

    let keyInput = undefined;

    if (form.keyname.type === 'select') {
      const optionArray = [{ label: 'None', value: '' }];

      for (let o in form.keyname.options.selections) {
        optionArray.push({ label: form.keyname.options?.selections[o], value: o });
      }

      keyInput = (
        <SelectDropdown
          label={form.keyname.label}
          options={optionArray}
          value={nameChanges[se]}
          onChange={(value) => {
            setNameChanges({
              ...nameChanges,
              [se]: value,
            });
          }}
        />
      );
    } else {
      keyInput = (
        <TextInput
          label={form.keyname.label}
          value={nameChanges[se]}
          onInput={(value) => {
            setNameChanges({
              ...nameChanges,
              [se]: value,
            });
          }}
          jsonFriendly
        />
      );
    }

    subClones.push(
      <EventExpandable label={nameChanges[se]} key={`${formKey}.${se}`}>
        <Stack spacing='medium' padding='medium'>
          {keyInput}
          {subInputs}
          <Button icon={faTrash} onClick={() => removeForm(se)} />
        </Stack>
      </EventExpandable>,
    );
  }

  return (
    <Box flexFlow='column'>
      <Box flexFlow='column'>{subClones}</Box>
      <Button icon={faPlus} onClick={addForm} />
    </Box>
  );
}
