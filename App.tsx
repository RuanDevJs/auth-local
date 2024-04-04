import { useEffect, useState } from "react";
import { Text, View, Button, TouchableOpacity, Alert } from "react-native";

import { StatusBar } from "expo-status-bar";
import * as LocalAuthentication from "expo-local-authentication";

import { styles } from "./style";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function verifyAvaliableAuthentication() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    console.log(compatible);

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    console.log(
      "Tipos de autenticação: ",
      types.map((type) => LocalAuthentication.AuthenticationType[type])
    );
  }

  async function handleAuthentication() {
    const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
    console.log("isBiometricEnrolled", isBiometricEnrolled);

    if (!isBiometricEnrolled)
      return Alert.alert("Login", "Não há biometria registrada");

    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Desbloqueie seu celular",
      fallbackLabel: "Biometria não reconhecida",
    });

    return auth ? setIsAuthenticated(true) : setIsAuthenticated(false);
  }

  useEffect(() => {
    verifyAvaliableAuthentication();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Usuário conectado: {isAuthenticated ? "Sim" : "Não"}
      </Text>
      <TouchableOpacity
        onPress={handleAuthentication}
        style={styles.button}
        activeOpacity={0.72}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
