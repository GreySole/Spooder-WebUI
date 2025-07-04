import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SharedElement } from '../../../Types';
import usePlugins from '../../../../app/hooks/usePlugins';
import {
  Box,
  Button,
  FormLoader,
  KeyedObject,
  LinkButton,
  TypeFace,
  useDialog,
} from '@greysole/spooder-component-library';
import useServer from '../../../../app/hooks/useServer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faExclamationTriangle, faKey } from '@fortawesome/free-solid-svg-icons';
import useShare from '../../../../app/hooks/useShare';

interface ShareUiLinkProps {
  shareKey: string;
}

export default function ShareUiLink(props: ShareUiLinkProps) {
  const { shareKey } = props;
  const { watch, setValue } = useFormContext();
  const { openDialog, closeDialog } = useDialog();
  const { getPlugins } = usePlugins();
  const { getPublicUrl } = useServer();
  const { getCreateShareKey } = useShare();
  const { createShareKey } = getCreateShareKey();
  const share = watch(`${shareKey}`, {} as KeyedObject);
  const { data: plugins, isLoading } = getPlugins();
  const { data: publicUrls, isLoading: publicUrlLoading } = getPublicUrl();

  if (isLoading || !plugins || publicUrlLoading) {
    return <FormLoader numRows={1} />;
  }

  const sharePlugins = share.plugins || {};

  let pluginShareKeyWarning = false;
  let pluginShareNoPublicHostWarning = false;

  for (let sp in sharePlugins) {
    if (plugins[sp]) {
      if ((plugins[sp].hasOverlay || plugins[sp].hasUtility) && !share.shareKey) {
        pluginShareKeyWarning = true;
      }
      if ((plugins[sp].hasOverlay || plugins[sp].hasUtility) && !publicUrls.http) {
        pluginShareNoPublicHostWarning = true;
      }
    }
  }

  if (pluginShareNoPublicHostWarning) {
    return (
      <Box>
        <Button
          icon={faExclamationTriangle}
          label='Share Warning'
          onClick={() => {
            openDialog(
              'Public Hosting Required',
              <TypeFace>
                <FontAwesomeIcon icon={faExclamationTriangle} /> One or more shared plugins has an
                overlay or utility, but you don't have public hosting set up! You can set up public
                hosting in the Config Tab.
              </TypeFace>,
              [<Button label='Ok' onClick={() => closeDialog()} />],
            );
          }}
        />
      </Box>
    );
  }

  if (pluginShareKeyWarning) {
    return (
      <Box>
        <Button
          icon={faExclamationTriangle}
          label='Share Warning'
          onClick={() => {
            openDialog(
              'Create Share Key?',
              <TypeFace>
                <FontAwesomeIcon icon={faExclamationTriangle} /> One or more shared plugins has an
                overlay or utility, but this share has no key! Create a key and send them the
                ShareUI link. This will also allow them to access overlays and utilities from your
                shared plugins. In case of abuse or unauthorized use, you may delete or regenerate
                the key.
              </TypeFace>,
              [
                <Button label='Cancel' onClick={() => closeDialog()} />,
                <Button
                  label='Create'
                  onClick={() => {
                    createShareKey(shareKey).then((data) => {
                      if (data.status === 'ok') {
                        setValue(`${shareKey}.shareKey`, data.shareKey);
                      } else {
                        closeDialog();
                        openDialog(
                          'Error',
                          <TypeFace>There was an error creating a share key.</TypeFace>,
                          [<Button label='Ok' onClick={() => closeDialog()} />],
                        );
                      }
                      closeDialog();
                    });
                  }}
                />,
              ],
            );
          }}
        />
      </Box>
    );
  }

  if (!share.shareKey) {
    return (
      <Button
        icon={faKey}
        label='Share URL'
        onClick={() => {
          openDialog(
            'Create Share Key?',
            <TypeFace>
              Creating a Share Key will allow your share client to enable/disable commands and
              plugins you share. This will also allow them to access overlays and utilities from
              your shared plugins. In case of abuse or unauthorized use, you may delete or
              regenerate the key. Sound good?
            </TypeFace>,
            [],
          );
        }}
      />
    );
  }

  return (
    <Box>
      <LinkButton
        label={'Share URL'}
        mode='copy'
        link={publicUrls.http + '/share?key=' + share.shareKey}
      />
    </Box>
  );
}
