import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext } from 'react-hook-form';

interface DeleteOSCTunnelButtonProps {
  formKey: string;
}

export default function DeleteOSCTunnelButton(props: DeleteOSCTunnelButtonProps) {
  const { formKey } = props;
  const { unregister } = useFormContext();
  return (
    <FontAwesomeIcon
      icon={faTrash}
      size='lg'
      className='delete-button'
      onClick={() => unregister(formKey)}
    />
  );
}
