import {
  IconChart,
  IconCamera,
  IconCode,
  IconCompass,
  IconCpu,
  IconNetwork,
  IconTool,
  IconUsers,
  IconVideo,
} from "../components/Icons";

/**
 * Maps the `icon` strings used in the data file to their components, so
 * content and presentation stay separate.
 */
export const iconMap = {
  cctv: IconVideo,
  wrench: IconTool,
  compass: IconCompass,
  code: IconCode,
  network: IconNetwork,
  chart: IconChart,
  camera: IconCamera,
  shield: IconCpu,
  cpu: IconCpu,
  users: IconUsers,
};