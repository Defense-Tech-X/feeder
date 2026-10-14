import { openControllerChannel } from './controller-channel.js';
import { VDC, AXES, FlightMode } from './protocol.js';

const INTERVAL_MS = 1000;
const CONTROLS = [...AXES, 'flightMode'];
const AXIS_POSITIONS = [VDC.axisMin, VDC.axisMax];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function nextAxisPosition(current) {
  return randomItem(AXIS_POSITIONS.filter(position => position !== current));
}

function nextFlightMode(current) {
  return current === FlightMode.Angle ? FlightMode.Acro : FlightMode.Angle;
}

function randomlyChangeOneControl(state) {
  const control = randomItem(CONTROLS);
  const value = control === 'flightMode'
    ? nextFlightMode(state.flightMode)
    : nextAxisPosition(state[control]);
  return { control, state: { ...state, [control]: value } };
}

const channel = openControllerChannel();
let state = channel.readState();
console.log('Initial state:', state);

const timer = setInterval(() => {
  const change = randomlyChangeOneControl(state);
  channel.writeState(change.state);
  state = change.state;
  console.log(`${change.control} = ${state[change.control]}`);
}, INTERVAL_MS);

process.on('SIGINT', () => {
  clearInterval(timer);
  channel.close();
  process.exit(0);
});
