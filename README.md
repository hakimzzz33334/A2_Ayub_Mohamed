# A2 Ayub Mohamed – Currency Converter

This project is my Assignment 2 for COMP3074.
It is a small React Native app built with Expo that converts an amount from one currency into another using the Free Currency API.

The main screen lets the user enter:
- base currency code (for example CAD),
- destination currency code (for example USD),
- and the amount to convert.

The app validates the input, calls the API, and shows the exchange rate and the converted amount.
There is also an About screen that displays my name, student ID, and a short description of the application.

## How to run

1. Clone the repository.
2. Run `npm install` in the project folder.
3. Edit `App.js` and put your own FreeCurrencyAPI key in `FREECURRENCY_API_KEY`.
4. Start the app with `npx expo start`.
5. Scan the QR code with the Expo Go app on an Android device to test it.
