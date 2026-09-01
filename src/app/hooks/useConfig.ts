// Lives in the module SDK: modules read and write the same config the host does, through the
// same RTK Query cache. Re-exported here so host code keeps its existing import path.
export { useConfig as default } from '@spooder/webui-module-sdk';
