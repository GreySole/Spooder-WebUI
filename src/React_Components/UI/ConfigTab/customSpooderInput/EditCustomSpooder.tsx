import useTheme from '../../../../app/hooks/useTheme';
import EditCustomSpooderForm from './EditCustomSpooderForm';
import EditCustomSpooderInputPair from './EditCustomSpooderInputPair';

export default function EditCustomSpooder() {
  const { customSpooder } = useTheme();
  return (
    <EditCustomSpooderForm data={customSpooder}>
      <div className='custom-spooder-ui'>
        <div className='custom-spooder-inputs'>
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
        </div>
        <div className='save-commands'>
          <button type='button' id='saveSpooderButton' className='save-button'>
            Save
          </button>
          <div id='spooderSaveStatusText' className='save-status'></div>
        </div>
      </div>
    </EditCustomSpooderForm>
  );
}
