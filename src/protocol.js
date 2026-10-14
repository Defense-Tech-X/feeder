// Mirror of driver/src/controller_protocol.h: keep both files in sync.

export const VDC = Object.freeze({
  vendorId: 0xDEED,
  productId: 0xFEED,
  feederUsagePage: 0xFF00,
  feederUsage: 0x01,
  feederReportId: 2,
  reportLength: 10,
  axisMin: 0,
  axisCenter: 16384,
  axisMax: 32767,
});

export const FlightMode = Object.freeze({ Angle: 0, Acro: 1 });

export const AXES = Object.freeze(['throttle', 'yaw', 'pitch', 'roll']);

export function encodeStateReport({ throttle, yaw, pitch, roll, flightMode }) {
  const report = Buffer.alloc(VDC.reportLength);
  report.writeUInt8(VDC.feederReportId, 0);
  report.writeUInt16LE(throttle, 1);
  report.writeUInt16LE(yaw, 3);
  report.writeUInt16LE(pitch, 5);
  report.writeUInt16LE(roll, 7);
  report.writeUInt8(flightMode, 9);
  return report;
}

export function decodeStateReport(bytes) {
  const report = Buffer.from(bytes);
  return {
    throttle: report.readUInt16LE(1),
    yaw: report.readUInt16LE(3),
    pitch: report.readUInt16LE(5),
    roll: report.readUInt16LE(7),
    flightMode: report.readUInt8(9),
  };
}
