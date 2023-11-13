#include <BluetoothSerial.h>
#include "HX711.h"

// HX711 circuit wiring
const int LOADCELL_DOUT_PIN = 16; // rx pin on my esp32
const int LOADCELL_SCK_PIN = 17; // tx pin on my esp32

BluetoothSerial SerialBT;
HX711 scale;

/* Check if Bluetooth configurations are enabled in the SDK */
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

void setup() {
  Serial.begin(115200);
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  SerialBT.begin();
  Serial.println("Bluetooth Started! Ready to pair...");
}

void loop() {

  if (scale.is_ready()) {
    long reading = scale.read();
    if (SerialBT.available()) {
      SerialBT.println(reading);
    } else {
      Serial.println("Bluetooth not available");
    }
    Serial.print("HX711 reading: ");
    Serial.println(reading);
  } else {
    Serial.println("HX711 not found.");
  }

  delay(1000);
}