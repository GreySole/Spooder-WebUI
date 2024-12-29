import { useEffect, useState } from 'react';
import { useOSC } from '../../app/context/OscContext';
import OSC from 'osc-js';
import React from 'react';
import { KeyedObject } from '../Types';
import Box from '../common/layout/Box';
import SystemMeters from './dashboardTab/SystemMeters';
import DiskMeters from './dashboardTab/DiskMeters';
import NetworkMeters from './dashboardTab/NetworkMeters';
import { useGetSystemStatusQuery } from '../../app/api/serverSlice';
import CircleLoader from '../common/loader/CircleLoader';
import FormLoader from '../common/loader/FormLoader';
import Stack from '../common/layout/Stack';

export default function DashboardTab() {
  const { data, isLoading, error, refetch } = useGetSystemStatusQuery(null);

  useEffect(() => {
    console.log('DashboardTab');
    const statusInterval = setInterval(() => {
      refetch();
    }, 3000);

    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  if (isLoading) {
    return <CircleLoader />;
  }

  return (
    <Stack spacing='medium'>
      <SystemMeters cpuUsage={data.cpu} ramUsage={data.memory} />
      <DiskMeters diskUsage={data.disk} />
      <NetworkMeters networkUsage={data.net} />
    </Stack>
  );
}
