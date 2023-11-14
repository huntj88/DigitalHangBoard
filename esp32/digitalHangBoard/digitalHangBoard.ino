#include <BluetoothSerial.h>
#include "HX711.h"
#include <ArduinoJson.h>

// HX711 circuit wiring
const int LOADCELL_DOUT_PIN_0 = 16;  // rx pin on my esp32
const int LOADCELL_SCK_PIN_0 = 17;   // tx pin on my esp32

const int LOADCELL_DOUT_PIN_1 = 18;
const int LOADCELL_SCK_PIN_1 = 19;

const int LOADCELL_DOUT_PIN_2 = 20;
const int LOADCELL_SCK_PIN_2 = 21;

const int LOADCELL_DOUT_PIN_3 = 22;
const int LOADCELL_SCK_PIN_3 = 23;

BluetoothSerial SerialBT;
HX711 scale0;  // far left
HX711 scale1;
HX711 scale2;
HX711 scale3;  // far right

/* Check if Bluetooth configurations are enabled in the SDK */
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

void setup() {
  Serial.begin(115200);
  scale0.begin(LOADCELL_DOUT_PIN_0, LOADCELL_SCK_PIN_0);
  scale1.begin(LOADCELL_DOUT_PIN_1, LOADCELL_SCK_PIN_1);
  scale2.begin(LOADCELL_DOUT_PIN_2, LOADCELL_SCK_PIN_2);
  scale3.begin(LOADCELL_DOUT_PIN_3, LOADCELL_SCK_PIN_3);
  SerialBT.begin();
  Serial.println("Bluetooth Started! Ready to pair...");
}

void loop() {
  StaticJsonDocument<512> sensorJson;
  JsonArray scalesJson = sensorJson.createNestedArray("scales");

  scalesJson.add(readScale(scale0));
  scalesJson.add(readScale(scale1));
  scalesJson.add(readScale(scale2));
  scalesJson.add(readScale(scale3));

  serializeJson(sensorJson, Serial);
  Serial.println();
  if (SerialBT.available()) {
    serializeJson(sensorJson, SerialBT);
    SerialBT.println();
  } else {
    Serial.println("Bluetooth not available");
  }

  delay(1000);
}

int readScale(HX711 scale) {
  if (scale.is_ready()) {
    return scale.read();
  } else {
    return -1;
  }
}