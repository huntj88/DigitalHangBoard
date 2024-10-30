#include <Preferences.h>

Preferences calibration;

// error code format
// code:index

// error code meanings
// 0 uncalibrated TODO
// 1 scale read error
float attemptMax = 0;
float lastAttemptMax = 0;
String calibrationErrors = "";

void setup() {
  Serial.begin(115200);
  calibration.begin("dhb-calibration", false);
  // calibration.clear();
  // calibration.putFloat("scale" + 0, 0.0000485);
  // calibration.putFloat("scale" + 1, 0.0000505);
  // calibration.putFloat("scale" + 2, 0.0000492);
  // calibration.putFloat("scale" + 3, 0.00005);

  setupScreen();

  std::function<float(const int)> getCalibration = [calibration](int index) {
    return calibration.getFloat("scale" + index, -1);
  };
  std::function<void(const int, const float)> setCalibration = [calibration](int index, float m) {
    calibration.putFloat("scale" + index, m);
  };

  displayTitleSubtitle("Starting BlueTooth", getBLEServerName());
  delay(1000);
  setupBluetoothServer(getCalibration, setCalibration);

  displayTitleSubtitle("Calibrating", "Don't touch Hangboard");
  delay(1000);
  setupScales();

  checkForCalibrationErrors();
}

void loop() {
  if (calibrationErrors.length() > 0) {
    Serial.println(calibrationErrors);
    displayErrors(calibrationErrors);
    delay(5000);

    // TODO: add calibration characteristics to bluetooth
    // check again in case calibration has been set over bluetooth
    checkForCalibrationErrors();
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

    float calibratedSum = calibrateSumWeight(sumWeight);


    float maxWeight = trackAndGetMaxWeight(calibratedSum);
    displayWeight(calibratedSum, maxWeight);
  } else {
    Serial.println(errors);
    displayErrors(errors);
  }

  delay(10);
}

float calculateWeightFromValue(int index, int value) {
  // y = mx + b, b is always 0
  float m = calibration.getFloat("scale" + index, -1);
  float y = m * value;
  return y;
}

void checkForCalibrationErrors() {
  calibrationErrors = "";
  for (int index = 0; index < 4; index++) {
    Serial.print("scale");
    Serial.print(index);
    Serial.print(" calibration: ");
    float calibrationValue = calibration.getFloat("scale" + index, -1);
    Serial.println(calibrationValue, 7);

    if (calibrationValue == -1) {
      calibrationErrors += "0:";
      calibrationErrors += index;
      calibrationErrors += "\n";
    }
  }
}

float trackAndGetMaxWeight(float sumWeight) {
  if (sumWeight > attemptMax && sumWeight > 2) {
    attemptMax = sumWeight;
  } else if (sumWeight < 2 && attemptMax != 0) {
    lastAttemptMax = attemptMax;
    attemptMax = 0;
  }

  if (attemptMax != 0) {
    return attemptMax;
  } else {
    return lastAttemptMax;
  }
}

float calibrateSumWeight(float sumWeight) {
  float scaleFactor = 1.1071; // found with weight applied through handboard hold
  return scaleFactor * sumWeight;
}
