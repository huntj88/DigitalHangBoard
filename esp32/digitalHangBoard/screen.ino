#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "Wire.h"

#define OLED_RESET -1
#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels
#define SCREEN_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setupScreen() {
  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;  // Don't proceed, loop forever
  }

  display.display();
  display.clearDisplay();
  display.display();
}

void displayErrors(String value) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("errors occurred");
  display.println(value);
  display.display();
}

void displayWeight(float value, float max) {
  display.clearDisplay();
  display.setTextSize(4);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);

  if (value > -0.1 && value < 0) {
    // prevent flickering between -0.0 and 0.0
    display.println(0.0001, 1);
  } else {
    display.println(value, 1);
  }

  display.setTextSize(2);
  display.println();
  display.print("Max: ");
  display.println(max, 1);

  display.display();
}

void displayTitleSubtitle(String title, String subtitle) {
  // only need w to get width of text before rendering, can i delete these others?
  int16_t x1, y1;
  uint16_t w, h;


  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.getTextBounds(title, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, 10);
  display.println(title);

  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.getTextBounds(subtitle, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, 40);
  display.println(subtitle);
  display.display();
}