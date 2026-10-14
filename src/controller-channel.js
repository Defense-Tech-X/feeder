import HID from 'node-hid';
import { VDC, encodeStateReport, decodeStateReport } from './protocol.js';

function findFeederCollection() {
  const info = HID.devices().find(d =>
    d.vendorId === VDC.vendorId &&
    d.productId === VDC.productId &&
    d.usagePage === VDC.feederUsagePage &&
    d.usage === VDC.feederUsage);
  if (!info) {
    throw new Error('VirtualDroneController feeder channel not found. Is the driver installed (driver\\scripts\\deploy.ps1)?');
  }
  return info;
}

export function openControllerChannel() {
  const device = new HID.HID(findFeederCollection().path);
  return {
    readState: () => decodeStateReport(device.getFeatureReport(VDC.feederReportId, VDC.reportLength)),
    writeState: state => device.sendFeatureReport(encodeStateReport(state)),
    writeReport: report => device.sendFeatureReport(report),
    close: () => device.close(),
  };
}
