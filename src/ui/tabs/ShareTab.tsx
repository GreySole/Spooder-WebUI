import { Stack, Box } from '@spooder/webui-component-library';
import React from 'react';
import useShare from '../../app/hooks/useShare';
import ShareEntry from './shareTab/ShareEntry';
import PageCircleLoader from '../common/input/general/PageCircleLoader';
import { Footer } from '../app/Footer';
import CreateShareButton from './shareTab/input/createShareButton/CreateShareButton';
import { ShareTabProvider } from './shareTab/context/ShareTabContext';
import ShareList from './shareTab/ShareList';

export default function ShareTab() {
  return (
    <ShareTabProvider>
      <Box width='100%' marginBottom='var(--footer-height)'>
        <ShareList />
        <Footer showFooter={true}>
          <CreateShareButton />
        </Footer>
      </Box>
    </ShareTabProvider>
  );
}
