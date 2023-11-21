#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>

#define bleServerName "Digital Hangboard"
#define SERVICE_UUID "4e035799-bfff-47dd-a531-4ada55e703eb"

BLECharacteristic scale0Characteristics("32c01a15-b46f-4922-afd2-12f6afbec821", BLECharacteristic::PROPERTY_NOTIFY);
BLEDescriptor scale0Descriptor("09d737ac-d325-4a11-8ddc-4986189b82e0");

BLECharacteristic scale1Characteristics("3f19be02-a46f-4ea7-851b-1c2b891cf63e", BLECharacteristic::PROPERTY_NOTIFY);
BLEDescriptor scale1Descriptor("801ae050-324c-40c3-a83f-38136926154c");

BLECharacteristic scale2Characteristics("d064d929-1cf3-42df-abe9-b5e8a9e0e2bd", BLECharacteristic::PROPERTY_NOTIFY);
BLEDescriptor scale2Descriptor("1c3a7208-5d76-4845-90b0-a89a634bc7f7");

BLECharacteristic scale3Characteristics("15c40fb5-0311-465a-a77c-c42a8282e7cf", BLECharacteristic::PROPERTY_NOTIFY);
BLEDescriptor scale3Descriptor("43415018-8202-44c7-bee4-2878e9dcb7af");

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

BLEServer *pServer;

void setupBluetoothServer() {
  BLEDevice::init(bleServerName);

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new BLEConnectionCallbacks());

  BLEService *dhbService = pServer->createService(SERVICE_UUID);

  dhbService->addCharacteristic(&scale0Characteristics);
  scale0Descriptor.setValue("weight");
  scale0Characteristics.addDescriptor(&scale0Descriptor);

  dhbService->addCharacteristic(&scale1Characteristics);
  scale1Descriptor.setValue("weight");
  scale1Characteristics.addDescriptor(&scale1Descriptor);

  dhbService->addCharacteristic(&scale2Characteristics);
  scale2Descriptor.setValue("weight");
  scale2Characteristics.addDescriptor(&scale2Descriptor);

  dhbService->addCharacteristic(&scale3Characteristics);
  scale3Descriptor.setValue("weight");
  scale3Characteristics.addDescriptor(&scale3Descriptor);
  
  dhbService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pServer->getAdvertising()->start();
  Serial.println("Bluetooth Started! Ready to pair...");
}

void sendWeightValue(int index, int value) {
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
