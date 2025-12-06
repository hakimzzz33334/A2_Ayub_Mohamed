// App.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const FREECURRENCY_API_KEY = "fca_live_r3g3RjoJyiXYqUSXAOImD7NDDHteB639cWPtOJN5";

const STUDENT_NAME = "Ayub Mohamed";
const STUDENT_ID = "101419863";

function LabeledInput({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "none",
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

// ================= MAIN SCREEN =================
function MainScreen({ navigation }) {
  const [baseCurrency, setBaseCurrency] = useState("CAD");
  const [destCurrency, setDestCurrency] = useState("USD");
  const [amount, setAmount] = useState("1");

  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    setErrorMessage("");

    const currencyRegex = /^[A-Z]{3}$/;

    if (!currencyRegex.test(baseCurrency)) {
      setErrorMessage(
        "Base currency must be a 3-letter uppercase code (e.g., CAD, USD)."
      );
      return false;
    }

    if (!currencyRegex.test(destCurrency)) {
      setErrorMessage(
        "Destination currency must be a 3-letter uppercase code (e.g., EUR, JPY)."
      );
      return false;
    }

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMessage("Amount must be a positive number.");
      return false;
    }

    if (!FREECURRENCY_API_KEY || FREECURRENCY_API_KEY === "YOUR_API_KEY_HERE") {
      setErrorMessage(
        "Missing API key. Please set your FREECURRENCY_API_KEY in the code."
      );
      return false;
    }

    return true;
  };

  const handleConvert = async () => {
    if (!validateInputs()) {
      setConvertedAmount(null);
      setExchangeRate(null);
      return;
    }

    const amt = parseFloat(amount);

    setIsLoading(true);
    setErrorMessage("");
    setConvertedAmount(null);
    setExchangeRate(null);

    const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${FREECURRENCY_API_KEY}&base_currency=${baseCurrency}&currencies=${destCurrency}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Network error: ${response.status} ${response.statusText}`
        );
      }

      const json = await response.json();

      const rate = json?.data?.[destCurrency];

      if (!rate) {
        throw new Error(
          "Could not find exchange rate for the selected currency pair."
        );
      }

      const converted = rate * amt;

      setExchangeRate(rate);
      setConvertedAmount(converted);
    } catch (err) {
      console.log("Conversion error:", err);
      setErrorMessage(
        err.message ||
          "Something went wrong while fetching exchange rates. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (value, decimals = 4) =>
    typeof value === "number" ? value.toFixed(decimals) : "";

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Currency Converter</Text>
          <Text style={styles.subtitle}>
            Convert an amount from a base currency into a destination currency
            using live exchange rates.
          </Text>

          {/* Input card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Input</Text>

            <LabeledInput
              label="Base Currency Code"
              placeholder="e.g. CAD"
              value={baseCurrency}
              onChangeText={(text) => setBaseCurrency(text.toUpperCase())}
              autoCapitalize="characters"
            />

            <LabeledInput
              label="Destination Currency Code"
              placeholder="e.g. USD"
              value={destCurrency}
              onChangeText={(text) => setDestCurrency(text.toUpperCase())}
              autoCapitalize="characters"
            />

            <LabeledInput
              label="Amount"
              placeholder="e.g. 1"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.buttonPrimary,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleConvert}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Convert</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Result card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Result</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Exchange rate:</Text>
              <Text style={styles.resultValue}>
                {exchangeRate !== null
                  ? `1 ${baseCurrency} = ${formatNumber(
                      exchangeRate
                    )} ${destCurrency}`
                  : "--"}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Converted amount:</Text>
              <Text style={styles.resultValue}>
                {convertedAmount !== null
                  ? `${formatNumber(convertedAmount, 2)} ${destCurrency}`
                  : "--"}
              </Text>
            </View>

            <Text style={styles.noteText}>
              The exchange rate and converted amount are based on data from
              freecurrencyapi.com.
            </Text>
          </View>

          {/* Navigation to About */}
          <TouchableOpacity
            style={styles.aboutButton}
            onPress={() => navigation.navigate("About")}
          >
            <Text style={styles.aboutButtonText}>Go to About Screen</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ================= ABOUT SCREEN =================
function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.aboutContainer}>
        <Text style={styles.title}>About This App</Text>
        <Text style={styles.subtitle}>
          This screen shows the student details and a short description of the
          application.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Student Information</Text>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Name:</Text>
            <Text style={styles.resultValue}>{STUDENT_NAME}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Student ID:</Text>
            <Text style={styles.resultValue}>{STUDENT_ID}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Application Description</Text>
          <Text style={styles.descriptionText}>
            This React Native application converts a given amount from a base
            currency into a destination currency using live exchange rates from
            the Free Currency API. The user enters the base currency code,
            destination currency code, and amount. The app validates the input,
            sends a request to the API, handles potential errors such as invalid
            codes, missing currencies, or network issues, and displays the
            converted amount together with the exchange rate used.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ================= NAVIGATION SETUP =================
const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ title: "Currency Converter" }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f8",
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  aboutContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
    color: "#1a2942",
  },
  subtitle: {
    fontSize: 14,
    color: "#5f6a7d",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1a2942",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#28313f",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c4c9d4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#f9fafb",
    fontSize: 14,
  },
  buttonPrimary: {
    marginTop: 12,
    backgroundColor: "#1f6feb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  errorText: {
    color: "#b00020",
    marginTop: 4,
    fontSize: 13,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  resultLabel: {
    fontSize: 15,
    color: "#28313f",
  },
  resultValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a2942",
  },
  noteText: {
    marginTop: 10,
    fontSize: 12,
    color: "#7a8191",
  },
  descriptionText: {
    fontSize: 14,
    color: "#28313f",
    lineHeight: 20,
  },
  aboutButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#0c9c5a",
    alignItems: "center",
  },
  aboutButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
