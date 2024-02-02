#include <Preferences.h>

Preferences calibration;

// error code format
// code:index

// error code meanings
// 0 uncalibrated TODO
// 1 scale read error

String initErrors = "";

void setup() {
  Serial.begin(115200);
  calibration.begin("dhb-calibration", false);
  std::function<float(const int)> getCalibration = [calibration](int index) {
    return calibration.getFloat("scale" + index, -1);
  };
  std::function<void(const int, const float)> setCalibration = [calibration](int index, float m) {
    calibration.putFloat("scale" + index, m);
  };

  // calibration.clear();
  // calibration.putFloat("scale" + 0, 0.00005);
  // calibration.putFloat("scale" + 1, 0.0000497);
  // calibration.putFloat("scale" + 2, 0.0000509);
  // calibration.putFloat("scale" + 3, 0.0000514);

  setupBluetoothServer(getCalibration, setCalibration);
  setupScales();
  setupScreen();

  for (int index = 0; index < 4; index++) {
    Serial.print("scale");
    Serial.print(index);
    Serial.print(" calibration: ");
    float calibrationValue = calibration.getFloat("scale" + index, -1);
    Serial.println(calibrationValue, 7);

    if (calibrationValue == -1) {
      initErrors += "0:";
      initErrors += index;
      initErrors += "\n";
    }
  }
}

void loop() {
  if (initErrors.length() > 0) {
    Serial.println(initErrors);
    displayErrors(initErrors);
    delay(1000);
    return;
  }

  int rawValues[] = { -2147483648, -2147483648, -2147483648, -2147483648 };
  String errors = "";

  for (int index = 0; index < 4; index++) {
    int valueForIndex = readScale(index);
    rawValues[index] = valueForIndex;

    if (valueForIndex == -2147483648) {
      errors += "1:";
      errors += index;
      errors += "\n";
    }
  }

  if (isBluetoothClientConnected()) {
    for (int index = 0; index < 4; index++) {
      int valueForIndex = rawValues[index];
      if (valueForIndex != -2147483648) {
        sendWeightValue(index, valueForIndex);
      }
    }
  }

  if (errors.length() == 0) {
    float sumWeight = 0;
    for (int index = 0; index < 4; index++) {
      int valueForIndex = rawValues[index];
      sumWeight += calculateWeightFromValue(index, valueForIndex);
    }
    displayValue(sumWeight);
    // TODO: render sum weight better
  } else {
    Serial.println(errors);
    displayErrors(errors);
  }

  delay(10);
}

float calculateWeightFromValue(int index, int value) {
  // y = mx + b, b is always 0
  float m = calibration.getFloat("scale" + index, -1);
  if (m == -1) {
    // error case
    return -1;
  }
  float y = m * value;
  return y;
}
