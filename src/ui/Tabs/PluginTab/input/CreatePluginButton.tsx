import React from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Button from '../../../Common/input/controlled/Button';
import { usePluginContext } from '../context/PluginTabFormContext';
import usePlugins from '../../../../app/hooks/usePlugins';

export default function CreatePluginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    pluginname: '',
    author: '',
    description: '',
  });
  const { plugins, newPlugins, setNewPlugins } = usePluginContext();
  const { getCreatePlugin } = usePlugins();
  const { createPlugin } = getCreatePlugin();

  function createPluginClick() {
    let internalName = createForm.pluginname
      .toLowerCase()
      .replaceAll(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '')
      .replaceAll(' ', '_');
    let renameCount = 1;
    if (plugins[internalName] != null) {
      while (plugins[internalName + renameCount] != null) {
        if (plugins[internalName + renameCount] == null) {
          internalName += renameCount;
          break;
        } else {
          renameCount++;
        }
      }
      if (plugins[internalName + renameCount] == null) {
        internalName += renameCount;
      }
    }

    const fd = new FormData();
    fd.append('internalName', internalName);
    fd.append('pluginName', createForm.pluginname);
    fd.append('author', createForm.author);
    fd.append('description', createForm.description);
    createPlugin(fd);

    let newNewPlugins = Object.assign({}, plugins);
    newPlugins[internalName] = {
      name: createForm.pluginname,
      author: createForm.author,
      description: createForm.description,
      status: 'start',
      message: 'installing...',
    };

    let newOpenCreate = {
      isOpen: false,
      pluginname: '',
      author: '',
      description: '',
    };
    setNewPlugins(newNewPlugins);
    setCreateForm(newOpenCreate);
  }
  function onCreateFormInput(name: string, value: any) {
    let newOpenCreate = Object.assign(createForm);
    newOpenCreate[name] = value;
    setCreateForm(newOpenCreate);
  }
  return (
    <>
      <Button
        label='Create Plugin'
        onClick={() => setIsOpen(!isOpen)}
        icon={faPlusCircle}
        iconSize='lg'
      />
      {isOpen ? (
        <div className='plugin-create-element'>
          <form onSubmit={createPluginClick}>
            <label>
              Name
              <input
                type='text'
                name='pluginname'
                onChange={(e) => onCreateFormInput(e.target.name, e.target.value)}
              />
            </label>
            <label>
              Author
              <input
                type='text'
                name='author'
                onChange={(e) => onCreateFormInput(e.target.name, e.target.value)}
              />
            </label>
            <label>
              Description
              <input
                type='text'
                name='description'
                onChange={(e) => onCreateFormInput(e.target.name, e.target.value)}
              />
            </label>
            <button type='submit' id='createPluginButton' className='save-button'>
              Create
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
