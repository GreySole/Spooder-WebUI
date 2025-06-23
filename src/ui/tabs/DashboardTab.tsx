import { Stack, Button } from '@greysole/spooder-component-library';
import useToast from '../../app/hooks/useToast';
import { ToastType } from '../../ui/Types';
import { useEffect } from 'react';
import React from 'react';
import { useGetSystemStatusQuery } from '../../app/api/serverSlice';
import DiskMeters from './dashboardTab/DiskMeters';
import NetworkMeters from './dashboardTab/NetworkMeters';
import SystemMeters from './dashboardTab/SystemMeters';
import PageCircleLoader from '../common/input/general/PageCircleLoader';

export default function DashboardTab() {
  const { data, isLoading, error, refetch } = useGetSystemStatusQuery(null);
  const { showToast } = useToast();

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
    return <PageCircleLoader />;
  }

  const showToasts = () => {
    console.log('Toasts button clicked');
    showToast(`Toast!`, ToastType.SUCCESS);
  };

  return (
    <Stack spacing='medium' padding='medium'>
      <SystemMeters cpuUsage={data.cpu} ramUsage={data.memory} />
      <DiskMeters diskUsage={data.disk} />
      <NetworkMeters networkUsage={data.net} />
      <Button label='Toasts' onClick={showToasts} />
    </Stack>
  );
}
