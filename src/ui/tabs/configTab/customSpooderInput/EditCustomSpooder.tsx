import React from 'react';
import { Stack, Columns, useTheme, Box, TypeFace } from '@greysole/spooder-component-library';
import EditCustomSpooderInputPair from './EditCustomSpooderInputPair';
import EditCustomSpooderFormProvider from './EditCustomSpooderFormProvider';
import EditCustomSpooderForm from './EditCustomSpooderForm';

export default function EditCustomSpooder() {
  const { customSpooder } = useTheme();

  console.log('EditCustomSpooder', customSpooder);

  return (
    <EditCustomSpooderFormProvider data={customSpooder}>
      <TypeFace fontSize='large' fontWeight='bold'>Custom Spooder</TypeFace>
      <EditCustomSpooderForm>
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Long Leg Left'} partName={'longlegleft'} />
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
        <EditCustomSpooderInputPair customSpooder={customSpooder} label={'Long Leg Right'} partName={'longlegright'} />
      </EditCustomSpooderForm>
    </EditCustomSpooderFormProvider>
  );
}
