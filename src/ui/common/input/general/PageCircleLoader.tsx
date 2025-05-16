import React from 'react';
import { Box, CircleLoader } from '@greysole/spooder-component-library';

export default function PageCircleLoader() {
  return (
    <Box width='100%' height='100%' flexFlow='column' alignItems='center' justifyContent='center'>
      <Box width='10rem' height='10rem'>
        <CircleLoader />
      </Box>
    </Box>
  );
}
