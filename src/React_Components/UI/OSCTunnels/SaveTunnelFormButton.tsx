import { FieldValues, useFormContext } from 'react-hook-form';
import SaveButton from '../common/input/form/SaveButton';
import { useSaveOSCTunnelsMutation } from '../../../app/api/configSlice';

export default function SaveTunnelFormButton() {
  const [saveOSCTunnels] = useSaveOSCTunnelsMutation();
  return <SaveButton saveFunction={saveOSCTunnels} />;
}