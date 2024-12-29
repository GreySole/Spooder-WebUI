import React, { useEffect, useState } from 'react';
import Box from '../../common/layout/Box';
import { KeyedObject } from '../../Types';
import GraphMeter from './meter/GraphMeter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { formatBytes } from '../../util/DataUtil';
import NetMeter from './meter/NetMeter';
import useTheme from '../../../app/hooks/useTheme';

interface NetworkMetersProps {
  networkUsage: KeyedObject;
}

export default function NetworkMeters(props: NetworkMetersProps) {
  const { networkUsage } = props;
  const [downSpeedGraphData, setDownSpeedGraphData] = useState([0] as number[]);
  const [upSpeedGraphData, setUpSpeedGraphData] = useState([0] as number[]);
  const { isMobileDevice, themeColors } = useTheme();

  useEffect(() => {
    if (!networkUsage.downSpeed || !networkUsage.upSpeed) {
      return;
    }
    setDownSpeedGraphData((prevData) => {
      const newData = [...prevData];
      newData.push(networkUsage.downSpeed);
      if (newData.length > 20) {
        newData.shift();
      }
      return newData;
    });

    setUpSpeedGraphData((prevData) => {
      const newData = [...prevData];
      newData.push(networkUsage.upSpeed);
      if (newData.length > 20) {
        newData.shift();
      }
      return newData;
    });
  }, [networkUsage]);

  return (
    <Box flexFlow='column' alignItems={'center'}>
      <h1>Network</h1>
      <Box
        width='100%'
        flexFlow={isMobileDevice ? 'column' : 'row'}
        alignItems={'center'}
        justifyContent='center'
      >
        <NetMeter
          value={networkUsage.downSpeed}
          color={themeColors.colorAnalogousCCW}
          icon={faDownload}
          graphData={downSpeedGraphData}
          total={networkUsage.down}
        />
        <NetMeter
          value={networkUsage.upSpeed}
          color={themeColors.colorAnalogousCW}
          icon={faUpload}
          graphData={upSpeedGraphData}
          total={networkUsage.up}
        />
      </Box>
    </Box>
  );
}
