# feeder

Node.js-программа, задающая состояние виртуального джойстика [VirtualDroneController](../driver/README.md). Пишет 10-байтовый feature reports в HID-канал feeder драйвера.

## Режимы

| Скрипт           | Источник данных |
|------------------|-----------------|
| `npm run mqtt`   | Проксирует отчёты из MQTT-брокера в драйвер как есть, в момент прихода |
| `npm run random` | Раз в секунду переводит случайный стик в крайнее положение или переключает режим |

## Отчёт

10 байт, little-endian:

```
ReportId (u8, всегда 2) | Throttle | Yaw | Pitch | Roll (u16 каждый) | FlightMode (u8)
```

## Запуск

Требуется установленный драйвер (https://github.com/Defense-Tech-X/driver) и Node.js.

```powershell
npm install
npm run mqtt
```

## Структура

```
src/protocol.js            константы драйвера, кодирование и декодирование отчёта
src/controller-channel.js  поиск HID-канала feeder, чтение и запись отчёта
src/mqtt-feeder.js         прокси MQTT-брокер -> драйвер
src/random-feeder.js       случайные изменения состояния для проверки
```
