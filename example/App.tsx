import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DooPush, type DooPushMessage } from 'doopush-react-native-sdk';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<DooPushMessage[]>([]);

  useEffect(() => {
    DooPush.configure({
      appId: 'test_app_id',
      apiKey: 'test_api_key',
      baseURL: 'https://test.doopush.com/api/v1',
    });

    const subRegister = DooPush.addRegisterListener((e) => {
      setToken(e.token);
      setDeviceId(e.deviceId);
    });
    const subError = DooPush.addRegisterErrorListener((e) => {
      setError(e.message);
    });
    const subMessage = DooPush.addMessageListener((msg) => {
      setMessages((prev) => [msg, ...prev].slice(0, 20));
    });

    return () => {
      subRegister.remove();
      subError.remove();
      subMessage.remove();
    };
  }, []);

  const onRegister = async () => {
    setError(null);
    try {
      const result = await DooPush.register();
      setToken(result.token);
      setDeviceId(result.deviceId);
    } catch (e: any) {
      setError(e.message ?? String(e));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>DooPush RN SDK v0.1.0</Text>

      <View style={styles.row}>
        <Button title="Register" onPress={onRegister} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Token:</Text>
        <Text style={styles.mono}>{token ?? '(not registered)'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>DeviceId:</Text>
        <Text style={styles.mono}>{deviceId ?? '(not registered)'}</Text>
      </View>
      {error && (
        <View style={styles.section}>
          <Text style={[styles.label, { color: 'red' }]}>Error:</Text>
          <Text style={[styles.mono, { color: 'red' }]}>{error}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Messages ({messages.length}):</Text>
        <ScrollView style={styles.list}>
          {messages.map((m, i) => (
            <View key={i} style={styles.msg}>
              <Text style={styles.bold}>{m.title ?? '(no title)'}</Text>
              <Text>{m.body ?? '(no body)'}</Text>
              <Text style={styles.mono}>{JSON.stringify(m.data)}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, paddingTop: 60 },
  h1: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  row: { flexDirection: 'row', marginBottom: 16 },
  section: { marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 4 },
  mono: { fontFamily: 'Courier', fontSize: 12 },
  list: { maxHeight: 300, borderColor: '#ddd', borderWidth: 1, padding: 8 },
  msg: { marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderColor: '#eee' },
  bold: { fontWeight: '600' },
});
