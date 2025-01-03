import { CircleLoader, Stack } from '@greysole/spooder-component-library';
import { useEffect } from 'react';
import React from 'react';
import { useGetSystemStatusQuery } from '../../app/api/serverSlice';
import DiskMeters from './dashboardTab/DiskMeters';
import NetworkMeters from './dashboardTab/NetworkMeters';
import SystemMeters from './dashboardTab/SystemMeters';

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
