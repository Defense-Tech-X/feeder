import mqtt from 'mqtt';
import { openControllerChannel } from './controller-channel.js';

const MQTT_URL = 'mqtt://drillcloud.ru:1883';
const MQTT_TOPIC = 'data/drone/v0';

const channel = openControllerChannel();
const client = mqtt.connect(MQTT_URL);

client.on('connect', () => {
  client.subscribe(MQTT_TOPIC);
  console.log(`Proxying ${MQTT_URL} ${MQTT_TOPIC} -> driver`);
});

client.on('message', (_topic, report) => channel.writeReport(report));

process.on('SIGINT', () => {
  client.end();
  channel.close();
  process.exit(0);
});
