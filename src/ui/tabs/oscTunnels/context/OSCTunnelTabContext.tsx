import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

interface OSCTunnelTabContextProps {
  children: React.ReactNode;
  tunnels: any;
}

export default function OSCTunnelTabContextProvider(props: OSCTunnelTabContextProps) {
  const { tunnels, children } = props;

  const OSCTunnelTabForm = useForm({
    defaultValues: {
      ...tunnels,
    },
  });

  return <FormProvider {...OSCTunnelTabForm}>{children}</FormProvider>;
}
