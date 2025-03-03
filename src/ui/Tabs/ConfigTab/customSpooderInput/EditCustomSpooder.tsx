import React from 'react';
import { Stack, Columns, useTheme, Box } from '@greysole/spooder-component-library';
import EditCustomSpooderInputPair from './EditCustomSpooderInputPair';
import EditCustomSpooderFormProvider from './EditCustomSpooderFormProvider';
import EditCustomSpooderForm from './EditCustomSpooderForm';

export default function EditCustomSpooder() {
  const { customSpooder } = useTheme();
  return (
    <EditCustomSpooderFormProvider data={customSpooder}>
      <EditCustomSpooderForm>
        <EditCustomSpooderInputPair label={'Long Leg Left'} partName={'longlegleft'} />
        <EditCustomSpooderInputPair label={'Short Leg Left'} partName={'shortlegleft'} />
        <EditCustomSpooderInputPair label={'Body Left'} partName={'bodyleft'} />
        <EditCustomSpooderInputPair label={'Little Eye Left'} partName={'littleeyeleft'} />
        <EditCustomSpooderInputPair label={'Big Eye Left'} partName={'bigeyeleft'} />
        <EditCustomSpooderInputPair label={'Fang Left'} partName={'fangleft'} />
        <EditCustomSpooderInputPair label={'Mouth'} partName={'mouth'} />
        <EditCustomSpooderInputPair label={'Fang Right'} partName={'fangright'} />
        <EditCustomSpooderInputPair label={'Big Eye Right'} partName={'bigeyeright'} />
        <EditCustomSpooderInputPair label={'Little Eye Right'} partName={'littleeyeright'} />
        <EditCustomSpooderInputPair label={'Body Right'} partName={'bodyright'} />
        <EditCustomSpooderInputPair label={'Short Leg Right'} partName={'shortlegright'} />
        <EditCustomSpooderInputPair label={'Long Leg Right'} partName={'longlegright'} />
      </EditCustomSpooderForm>
    </EditCustomSpooderFormProvider>
  );
}
