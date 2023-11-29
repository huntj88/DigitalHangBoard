void setup() {
  Serial.begin(115200);
  setupScales();
  setupBluetoothServer();
}

void loop() {
  if (isBluetoothClientConnected()) {
    Serial.println("reading weights");
    sendWeightValue(0, readScale(0));
    sendWeightValue(1, readScale(1));
    sendWeightValue(2, readScale(2));
    sendWeightValue(3, readScale(3));
  }

  delay(1000);
}
