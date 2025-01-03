import React from 'react';
import useTheme from '../../../../app/hooks/useTheme';
import { Stack, Columns } from '@greysole/spooder-component-library';
import EditCustomSpooderForm from './EditCustomSpooderForm';
import EditCustomSpooderInputPair from './EditCustomSpooderInputPair';

export default function EditCustomSpooder() {
  const { customSpooder } = useTheme();
  return (
    <EditCustomSpooderForm data={customSpooder}>
      <Stack spacing='medium'>
        <Columns spacing='medium' padding='small'>
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
        </Columns>
      </Stack>
    </EditCustomSpooderForm>
  );
}
