import React, { Key } from 'react';
import {
  Stack,
  Columns,
  useTheme,
  Box,
  TypeFace,
  EditCustomSpooderInputPair,
  EditCustomSpooderForm,
  EditCustomSpooderAddButton,
  SpooderPetPair,
} from '@greysole/spooder-component-library';
import EditCustomSpooderFormProvider from './EditCustomSpooderFormProvider';

export default function EditCustomSpooder() {
  const { customSpooder } = useTheme();

  const addInputGroup = () => {
    // Logic to add a new input group can be implemented here
    console.log('Add new input group');
  };

  return (
    <EditCustomSpooderFormProvider data={customSpooder}>
      <TypeFace fontSize='large' fontWeight='bold'>
        Custom Spooder
      </TypeFace>
      <EditCustomSpooderForm>
        {customSpooder.map((part: SpooderPetPair, index: number) => (
          <EditCustomSpooderInputPair
            key={`spooder-part-${index}`}
            customSpooder={customSpooder}
            index={index}
          />
        ))}

        {/* <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Long Leg Left'} partName={'longlegleft'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Short Leg Left'} partName={'shortlegleft'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Body Left'} partName={'bodyleft'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Little Eye Left'} partName={'littleeyeleft'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Big Eye Left'} partName={'bigeyeleft'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Fang Left'} partName={'fangleft'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Mouth'} partName={'mouth'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Fang Right'} partName={'fangright'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Big Eye Right'} partName={'bigeyeright'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Little Eye Right'} partName={'littleeyeright'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Body Right'} partName={'bodyright'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Short Leg Right'} partName={'shortlegright'} />
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Long Leg Right'} partName={'longlegright'} /> */}
        <EditCustomSpooderAddButton onClick={addInputGroup} />
      </EditCustomSpooderForm>
    </EditCustomSpooderFormProvider>
  );
}
