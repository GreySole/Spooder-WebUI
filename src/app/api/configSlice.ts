// Defined in the module SDK, so a module's config reads and writes hit the host's one RTK
// Query cache rather than a second copy of it.
export {
  configApi,
  useGetConfigQuery,
  useGetOSCTunnelsQuery,
  useGetUdpServersQuery,
  useSaveConfigMutation,
  useSaveOSCTunnelsMutation,
  useSaveUdpServersMutation,
} from '@spooder/webui-module-sdk';
