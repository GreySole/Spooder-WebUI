import React from 'react';
import useServer from './app/hooks/useServer';
import App from './ui/app/App';
import {
  Box,
  OscProvider,
  Stack,
  ThemeProvider,
  TypeFace,
} from '@greysole/spooder-component-library';
import './ui/common/css/core/index.scss';

export default function InitLayer() {
  const { getServerState } = useServer();
  const { data, isLoading, error } = getServerState();

  if (error) {
    return (
      <Box width='100vw' height='100dvh' justifyContent='center' alignItems='center'>
        <Stack spacing='medium'>
          <TypeFace fontSize='3rem' textAlign='center'>
            /╲/\( ºx ω xº )/\╱\
          </TypeFace>
          <TypeFace fontSize='large' textAlign='center'>
            Can't connect to Spooder. Is it on?
          </TypeFace>
        </Stack>
      </Box>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <OscProvider host={data.host} port={data.port}>
      <App />
    </OscProvider>
  );
}
