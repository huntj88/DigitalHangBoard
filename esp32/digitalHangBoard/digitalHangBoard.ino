#include "Wire.h"
#include <Adafruit_NAU7802.h>

#define TCAADDR 0x70
Adafruit_NAU7802 scale0;
Adafruit_NAU7802 scale1;
Adafruit_NAU7802 scale2;
Adafruit_NAU7802 scale3;

void tcaselect(uint8_t i) {
  if (i > 7) return;
 
  Wire.beginTransmission(TCAADDR);
  Wire.write(1 << i);
  Wire.endTransmission();  
}

void setup() {
  Serial.begin(115200);
  Wire.begin();

  setupScale(&scale0, 3);
  setupScale(&scale1, 4);
  setupScale(&scale2, 6);
  setupScale(&scale3, 7);

  setupBluetoothServer();
}

void loop() {
  if (isBluetoothClientConnected()) {
    Serial.println("reading weights");
    sendWeightValue(0, readScale(&scale0, 3));
    sendWeightValue(1, readScale(&scale1, 4));
    sendWeightValue(2, readScale(&scale2, 6));
    sendWeightValue(3, readScale(&scale3, 7));
  }

  delay(1000);
}

void setupScale(Adafruit_NAU7802* scale, int multiplexerIndex) {
  tcaselect(multiplexerIndex);
  if (!scale->begin()) {
    Serial.println("Failed to find NAU7802");
  }
  scale->setLDO(NAU7802_3V0);
  scale->setGain(NAU7802_GAIN_128);
  scale->setRate(NAU7802_RATE_10SPS);
  for (uint8_t i=0; i<10; i++) {
    while (!scale->available()) {
      delay(1);
    }
    scale->read();
  }

  while (!scale->calibrate(NAU7802_CALMOD_INTERNAL)) {
    Serial.println("Failed to calibrate internal offset, retrying!");
    delay(1000);
  }
  Serial.println("Calibrated internal offset");

  while (!scale->calibrate(NAU7802_CALMOD_OFFSET)) {
    Serial.println("Failed to calibrate system offset, retrying!");
    delay(1000);
  }
  Serial.println("Calibrated system offset");
}

int readScale(Adafruit_NAU7802* scale, int multiplexerIndex) {
  tcaselect(multiplexerIndex);
  if (scale->available()) {
    return scale->read();
  } else {
    return -1;
  }
}