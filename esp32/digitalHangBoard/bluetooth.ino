#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define bleServerName "Digital Hangboard"
#define SERVICE_UUID "4e035799-bfff-47dd-a531-4ada55e703ec"

/* Check if Bluetooth configurations are enabled in the SDK */
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

// TODO: use prototype definitions, like in scales.ino, to make this less repetetive

BLECharacteristic scale0Characteristics("6766fbea-844a-459a-8def-643852f016b8", BLECharacteristic::PROPERTY_NOTIFY);
BLE2902 scale0CCC;

BLECharacteristic scale1Characteristics("3f19be02-a46f-4ea7-851b-1c2b891cf63e", BLECharacteristic::PROPERTY_NOTIFY);
BLE2902 scale1CCC;

BLECharacteristic scale2Characteristics("d064d929-1cf3-42df-abe9-b5e8a9e0e2bd", BLECharacteristic::PROPERTY_NOTIFY);
BLE2902 scale2CCC;

BLECharacteristic scale3Characteristics("15c40fb5-0311-465a-a77c-c42a8282e7cf", BLECharacteristic::PROPERTY_NOTIFY);
BLE2902 scale3CCC;

BLEServer *pServer;

class BLEConnectionCallbacks: public BLEServerCallbacks {
  // server stops advertising on connected
  void onConnect(BLEServer* pServer) {
    Serial.println("connected");
    pServer->startAdvertising();
  };
  void onDisconnect(BLEServer* pServer) {
    Serial.println("disconnected");
    pServer->startAdvertising();
  }
};

void setupTestingMacAddress() {
  // appears as a new device, so cache on client doesn't matter
  uint8_t base_mac_addr[8] = {0x01, 0x08, 0x07, 0x04, 0x05, 0x06};
  base_mac_addr[0] &= ~0x01; // make unicast
  base_mac_addr[0] |= 0x02; // mark as locally administered
  Serial.println(esp_base_mac_addr_set(base_mac_addr));
}

void setupBluetoothServer() {
  setupTestingMacAddress();
  BLEDevice::init(bleServerName);

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new BLEConnectionCallbacks());

  BLEService *dhbService = pServer->createService(SERVICE_UUID);

  scale0CCC.setNotifications(true);
  scale0Characteristics.addDescriptor(&scale0CCC);
  dhbService->addCharacteristic(&scale0Characteristics);

  scale1CCC.setNotifications(true);
  scale1Characteristics.addDescriptor(&scale1CCC);
  dhbService->addCharacteristic(&scale1Characteristics);

  scale2CCC.setNotifications(true);
  scale2Characteristics.addDescriptor(&scale2CCC);
  dhbService->addCharacteristic(&scale2Characteristics);

  scale3CCC.setNotifications(true);
  scale3Characteristics.addDescriptor(&scale3CCC);
  dhbService->addCharacteristic(&scale3Characteristics);
  
  dhbService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pServer->getAdvertising()->start();
  Serial.println("Bluetooth Started! Ready to pair...");
}

bool isBluetoothClientConnected() {
  return pServer->getConnectedCount() > 0;
}

void sendWeightValue(int index, int value) {
  Serial.print(index);
  Serial.print(": ");
  Serial.println(value);
  if (index == 0) {
    scale0Characteristics.setValue(value);
    scale0Characteristics.notify();
  } else if (index == 1) {
    scale1Characteristics.setValue(value);
    scale1Characteristics.notify();
  } else if (index == 2) {
    scale2Characteristics.setValue(value);
    scale2Characteristics.notify();
  } else if (index == 3) {
    scale3Characteristics.setValue(value);
    scale3Characteristics.notify();
  }
}
