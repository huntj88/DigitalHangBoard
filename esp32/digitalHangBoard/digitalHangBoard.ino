void setup() {
  Serial.begin(115200);
  setupBluetoothServer();
  setupScales();
}

void loop() {
  if (isBluetoothClientConnected()) {
    readValidateSend(0);
    readValidateSend(1);
    readValidateSend(2);
    readValidateSend(3);
  }

  delay(10);
}

void readValidateSend(int index) {
  int value = readScale(index);

  if (value == -2147483648) {
    return; // error case, do not send
  }
  sendWeightValue(index, value);
}
