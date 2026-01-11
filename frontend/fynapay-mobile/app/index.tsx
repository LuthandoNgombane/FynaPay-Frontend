import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';

// SELECT YOUR API URL BASED ON DEVICE (See instructions above)
const API_URL = 'http://localhost:3000'; 

export default function App() {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState('input'); // 'input' | 'pending' | 'success'
  const [loading,setLoading] = useState(false);
  
  // Form Data
  const [amount, setAmount] = useState('150.00');
  const [recipientName, setRecipientName] = useState('Sasha');
  const [recipientShapId, setRecipientShapId] = useState('sasha@absa.co.za');
  const [reference, setReference] = useState('Luthando');

  // Transaction Data (from Backend)
  const [paymentId, setPaymentId] = useState(null);
  const [authUrl, setAuthUrl] = useState(null);

  // --- STEP 1: INITIATE PAYMENT (POST /api/pay/send) ---
  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/pay/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          recipientName,
          recipientShapId,
          reference
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentId(data.paymentId);
        setAuthUrl(data.authUrl);
        setStep('pending'); // Switch UI to Pending View
      } else {
        Alert.alert("Error", data.error || "Payment failed");
      }
    } catch (error) {
      Alert.alert("Network Error", "Is the backend server running?");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: SIMULATE AUTHORIZATION (POST /api/webhooks/stitch) ---
  // In a real app, the user would go to 'authUrl' in a browser. 
  // Here, we simulate the bank calling us back by hitting the webhook ourselves.
  const handleAuthorize = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/webhooks/stitch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: paymentId,
          type: 'payment.initiator.completed',
          amount: amount
        })
      });

      if (response.ok) {
        setStep('success'); // Switch UI to Success View
      } else {
        Alert.alert("Auth Failed", "Webhook rejected");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('input');
    setPaymentId(null);
  };

  // --- UI COMPONENTS ---
  return (
    <View style={styles.container}>
      {/* 1. LOGO PLACEHOLDER */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>Fynapay</Text>
        </View>
        <Text style={styles.tagline}>Instant P2P Payments</Text>
      </View>

      {/* --- VIEW: INPUT FORM --- */}
      {step === 'input' && (
        <View style={styles.card}>
          <Text style={styles.label}>Amount (ZAR)</Text>
          <TextInput 
            style={styles.input} 
            value={amount} 
            onChangeText={setAmount} 
            keyboardType="numeric"
          />

          <Text style={styles.label}>To (Name)</Text>
          <TextInput 
            style={styles.input} 
            value={recipientName} 
            onChangeText={setRecipientName} 
          />

          <Text style={styles.label}>PayShap ID</Text>
          <TextInput 
            style={styles.input} 
            value={recipientShapId} 
            onChangeText={setRecipientShapId} 
            autoCapitalize="none"
          />

        <Text style={styles.label}>Reference</Text>
          <TextInput 
            style={styles.input} 
            value={reference} 
            onChangeText={setReference} 
            autoCapitalize="none"
          />


          <TouchableOpacity 
            style={styles.payButton} 
            onPress={handlePay}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Pay Now</Text>}
          </TouchableOpacity>
        </View>
      )}

      {/* --- VIEW: PENDING / AUTHORIZE --- */}
      {step === 'pending' && (
        <View style={styles.card}>
          <Text style={styles.title}>Payment Initiated</Text>
          <Text style={styles.detail}>ID: {paymentId}</Text>
          <Text style={styles.infoText}>
            Please authorize this payment with your bank.
          </Text>
          
          <TouchableOpacity 
            style={[styles.payButton, styles.authButton]} 
            onPress={handleAuthorize}
            disabled={loading}
          >
             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Authorize (Simulate Bank)</Text>}
          </TouchableOpacity>
        </View>
      )}

      {/* --- VIEW: SUCCESS --- */}
      {step === 'success' && (
        <View style={styles.card}>
          <Text style={[styles.title, {color: 'green'}]}>✓ Payment Successful</Text>
          <Text style={styles.infoText}>
            You sent R{amount} to {recipientName}.
          </Text>
          
          <TouchableOpacity style={styles.outlineButton} onPress={resetFlow}>
            <Text style={styles.outlineButtonText}>Make Another Payment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#333',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tagline: {
    color: '#666',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowKZ: 10,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 18,
    paddingVertical: 8,
    color: '#333',
  },
  payButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  authButton: {
    backgroundColor: '#0056b3', // Blue for Auth
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  detail: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  infoText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    lineHeight: 22,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  outlineButtonText: {
    color: '#000',
    fontWeight: '600',
  }
});