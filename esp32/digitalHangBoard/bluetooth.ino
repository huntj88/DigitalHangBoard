#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <functional>

#define bleServerName "Digital Hangboard"
#define SERVICE_UUID "4e035799-bfff-47dd-a531-4ada55e703ec"

/* Check if Bluetooth configurations are enabled in the SDK */
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

// TODO: use prototype definitions, like in scales.ino, to make this less repetetive

BLECharacteristic scale0Characteristic("6766fbea-844a-459a-8def-643852f016b8", BLECharacteristic::PROPERTY_NOTIFY);
BLE2902 scale0CCC;

BLECharacteristic scale1Characteristic("3f19be02-a46f-4ea7-851b-1c2b891cf63e", BLECharacteristic::PROPERTY_NOTIFY);
BLE2902 scale1CCC;

BLECharacteristic scale2Characteristic("d064d929-1cf3-42df-abe9-b5e8a9e0e2bd", BLECharacteristic::PROPERTY_NOTIFY);
BLE2902 scale2CCC;

BLECharacteristic scale3Characteristic("15c40fb5-0311-465a-a77c-c42a8282e7cf", BLECharacteristic::PROPERTY_NOTIFY);
BLE2902 scale3CCC;

BLECharacteristic scaleCalibrationCharacteristic("04722e1f-2029-4588-ae7d-8c764a0163af", BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);

BLEServer *pServer;

class BLEConnectionCallbacks : public BLEServerCallbacks {
  // server stops advertising on connected
  void onConnect(BLEServer *pServer) {
    Serial.println("connected");
    pServer->startAdvertising();
  };
  void onDisconnect(BLEServer *pServer) {
    Serial.println("disconnected");
    pServer->startAdvertising();
  }
};

// class CalibrationWriteCallback : public BLECharacteristicCallbacks {
//   void onWrite(BLECharacteristic *pCharacteristic) {
//     // String id = pCharacteristic->getUUID().toString();
//     // TODO: write to storage if set from remote client

//     // String value = pCharacteristic->getValue();

//     // if (value.length() > 0) {
//     //   Serial.println("*********");
//     //   Serial.print("New value: ");
//     //   for (int i = 0; i < value.length(); i++)
//     //     Serial.print(value[i]);

//     //   Serial.println();
//     //   Serial.println("*********");
//     // }
//   }
// };

void setupTestingMacAddress() {
  // appears as a new device, so cache on client doesn't matter
  uint8_t base_mac_addr[8] = { 0x01, 0x08, 0x07, 0x07, 0x05, 0x06 };
  base_mac_addr[0] &= ~0x01;  // make unicast
  base_mac_addr[0] |= 0x02;   // mark as locally administered
  Serial.println(esp_base_mac_addr_set(base_mac_addr));
}

void setupBluetoothServer(std::function<float(const int)> getCalibration, std::function<void(const int, const float)> setCalibration) {
  setupTestingMacAddress();
  BLEDevice::init(bleServerName);

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new BLEConnectionCallbacks());

  BLEService *dhbService = pServer->createService(SERVICE_UUID);

  scale0CCC.setNotifications(true);
  scale0Characteristic.addDescriptor(&scale0CCC);
  dhbService->addCharacteristic(&scale0Characteristic);

  scale1CCC.setNotifications(true);
  scale1Characteristic.addDescriptor(&scale1CCC);
  dhbService->addCharacteristic(&scale1Characteristic);

  scale2CCC.setNotifications(true);
  scale2Characteristic.addDescriptor(&scale2CCC);
  dhbService->addCharacteristic(&scale2Characteristic);

  scale3CCC.setNotifications(true);
  scale3Characteristic.addDescriptor(&scale3CCC);
  dhbService->addCharacteristic(&scale3Characteristic);

  float calibration0 = getCalibration(0);
  float calibration1 = getCalibration(1);
  float calibration2 = getCalibration(2);
  float calibration3 = getCalibration(3);
  std::string calibration = ftos(calibration0) + "," + ftos(calibration1) + "," + ftos(calibration2) + "," + ftos(calibration3);
  scaleCalibrationCharacteristic.setValue(calibration);
  // scaleCalibrationCharacteristic.setCallbacks(new CalibrationWriteCallback());
  dhbService->addCharacteristic(&scaleCalibrationCharacteristic);


  dhbService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pServer->getAdvertising()->start();
  Serial.println("Bluetooth Started! Ready to pair...");
}

bool isBluetoothClientConnected() {
  return pServer->getConnectedCount() > 0;
}

String getBLEServerName() {
  return bleServerName;
}

void sendWeightValue(int index, int value) {
  if (index == 0) {
    scale0Characteristic.setValue(value);
    scale0Characteristic.notify();
  } else if (index == 1) {
    scale1Characteristic.setValue(value);
    scale1Characteristic.notify();
  } else if (index == 2) {
    scale2Characteristic.setValue(value);
    scale2Characteristic.notify();
  } else if (index == 3) {
    scale3Characteristic.setValue(value);
    scale3Characteristic.notify();
  }
}

// float to string with precision of 7
std::string ftos(float f) {
  return std::string(String(f, 7).c_str());
}