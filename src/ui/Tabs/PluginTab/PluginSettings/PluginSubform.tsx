import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import PluginInput from './PluginInput';
import PluginMultiInput from './PluginMultiInput';
import { useFormContext } from 'react-hook-form';
import TextInput from '../../../common/input/controlled/TextInput';
import SelectDropdown from '../../../common/input/controlled/SelectDropdown';
import { KeyedObject } from '../../../Types';

interface PluginSubformProps {
  formkey: string;
  pluginName: string;
  label: string;
  form: any;
  defaults: any;
}

export default function PluginSubform(props: PluginSubformProps) {
  const { formkey, pluginName, label, form, defaults } = props;
  const [nameChanges, setNameChanges] = useState<KeyedObject>({});
  const { watch } = useFormContext();
  const values = watch(formkey);
  console.log('SUBFORM', form, 'VALUES', values, 'DEFAULTS', defaults);

  useEffect(() => {
    const newNames: KeyedObject = {};
    for (let v in values) {
      newNames[v] = v;
    }
    setNameChanges(newNames);
  }, []);

  /*for (let v in values) {
    for (let d in defaults) {
      //console.log("DVs",values[v][d]);
      if (values[v][d] == null) {
        if (typeof defaults[d] == 'object') {
          values[v][d] = {};
        } else {
          values[v][d] = defaults[d];
        }
      }
      if (
        Array.isArray(defaults[d]) &&
        !Array.isArray(values[v][d]) &&
        typeof values[v][d] != 'object'
      ) {
        values[v][d] = [values[v][d]];
      } else if (
        Array.isArray(defaults[d]) &&
        !Array.isArray(values[v][d]) &&
        typeof values[v][d] == 'object'
      ) {
        values[v][d] = Object.values(values[v][d]);
      } else if (!Array.isArray(defaults[d]) && Array.isArray(values[v][d])) {
        values[v][d] = values[v][d][0];
      }
    }
  }*/
  //console.log("RENDER SUBFORM", subElements, form, this.state.default);
  function translateCondition(condition: string) {
    let newCondition = condition;
    switch (condition.toLowerCase()) {
      case 'equals':
        newCondition = '==';
        break;
      case 'not equal':
        newCondition = '!=';
        break;
      case 'less than':
        newCondition = '<';
        break;
      case 'greater than':
        newCondition = '>';
        break;
      case 'less than or equal to':
        newCondition = '<=';
        break;
      case 'greater than or equal to':
        newCondition = '>=';
        break;
    }
    return newCondition;
  }

  const removeForm = (key: string) => {};

  const addForm = () => {};

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
            formKey={`${formkey}.${se}.${fe}`}
            pluginName={pluginName}
            type={form[fe].type}
            label={form[fe].label}
            options={form[fe].options}
            defaultValue={defaults[fe]}
          />
        ) : (
          <PluginMultiInput
            formKey={`${formkey}.${se}.${fe}`}
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
      <div className='settings-subform-clone'>
        {keyInput}
        {subInputs}
        <button className='delete-button' onClick={() => removeForm(se)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>,
    );
  }
  //console.log("RETURNING SUB CLONES", subClones);
  return (
    <div className='settings-subform'>
      <label className='settings-subform-label'>{label}</label>
      <div className='settings-subform-clones'>{subClones}</div>
      <button className='add-button' onClick={addForm}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
