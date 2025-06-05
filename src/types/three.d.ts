declare module "three/examples/jsm/controls/DeviceOrientationControls.js" {
  import { Camera, EventDispatcher } from "three";
  export class DeviceOrientationControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    connect(): void;
    disconnect(): void;
    update(): void;
    dispose(): void;
    enabled: boolean;
    deviceOrientation: DeviceOrientationEvent | null;
    screenOrientation: number;
  }
  export default DeviceOrientationControls;
}
