#include "Wire.h"
#include <Adafruit_NAU7802.h>

#define TCAADDR 0x70

Adafruit_NAU7802 scale0;
Adafruit_NAU7802 scale1;
Adafruit_NAU7802 scale2;
Adafruit_NAU7802 scale3;

int readScale(Adafruit_NAU7802* scale, int multiplexerIndex); // prototype so arduinoIDE doesn't move it.
void setupScale(Adafruit_NAU7802* scale, int multiplexerIndex); // prototype so arduinoIDE doesn't move it.

void tcaselect(uint8_t i) {
  if (i > 7) return;

  Wire.beginTransmission(TCAADDR);
  Wire.write(1 << i);
  Wire.endTransmission();
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

void setupScales() {
  Wire.begin();

  setupScale(&scale0, 3);
  setupScale(&scale1, 4);
  setupScale(&scale2, 6);
  setupScale(&scale3, 7);
}

int readScale(Adafruit_NAU7802* scale, int multiplexerIndex) {
  tcaselect(multiplexerIndex);
  if (scale->available()) {
    return scale->read();
  } else {
    return -1;
  }
}

int readScale(int index) {
    if (index == 0) {
    return readScale(&scale0, 3);
  } else if (index == 1) {
    return readScale(&scale1, 4);
  } else if (index == 2) {
    return readScale(&scale2, 6);
  } else if (index == 3) {
    return readScale(&scale3, 7);
  } else {
    Serial.print("invalid scale:");
    Serial.println(index);
    return -1;
  }
}