//LN - Import React and the useState hook for managing local state
import React, { useState } from 'react';
//LN - Import specific React Native core components for UI building
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';

//LN - Define the constant base URL for the backend API endpoint
const API_URL = 'http://localhost:3000';

//LN - Export the default main application component
export default function App() {
  //LN - Initialize state for tracking the current step of the user flow, defaulting to 'input'
  const [step, setStep] = useState('input');
  //LN - Initialize state to track loading status, defaulting to false
  const [loading, setLoading] = useState(false);

  //LN - Initialize state for the payment amount, defaulting to '150.00'
  const [amount, setAmount] = useState('150.00');
  //LN - Initialize state for the recipient's name, defaulting to 'Sasha'
  const [recipientName, setRecipientName] = useState('Sasha');
  //LN - Initialize state for the recipient's ID, defaulting to a sample email
  const [recipientShapId, setRecipientShapId] = useState('sasha@absa.co.za');
  //LN - Initialize state for the payment reference, defaulting to 'Luthando'
  const [reference, setReference] = useState('Luthando');

  //LN - Initialize state to store the payment ID received from the backend
  const [paymentId, setPaymentId] = useState(null);
  //LN - Initialize state to store the authorization URL received from the backend
  const [authUrl, setAuthUrl] = useState(null);

  //LN - Define an asynchronous function to handle the payment initiation
  const handlePay = async () => {
    //LN - Set loading state to true to show the spinner
    setLoading(true);
    //LN - Start a try block to handle potential network or logic errors
    try {
      //LN - Make a POST request to the backend send API endpoint
      const response = await fetch(`${API_URL}/api/pay/send`, {
        //LN - Specify the HTTP method as POST
        method: 'POST',
        //LN - Set headers to indicate the body content is JSON
        headers: { 'Content-Type': 'application/json' },
        //LN - Stringify the form state variables into the request body
        body: JSON.stringify({
          //LN - Include amount in the payload
          amount,
          //LN - Include recipientName in the payload
          recipientName,
          //LN - Include recipientShapId in the payload
          recipientShapId,
          //LN - Include reference in the payload
          reference
        })
      });

      //LN - Parse the JSON response from the server
      const data = await response.json();

      //LN - Check if the HTTP response status code indicates success
      if (response.ok) {
        //LN - Update state with the received payment ID
        setPaymentId(data.paymentId);
        //LN - Update state with the received authorization URL
        setAuthUrl(data.authUrl);
        //LN - Change the application step to 'pending' to update the UI
        setStep('pending');
      } else {
        //LN - Show an alert dialog if the response was not successful
        Alert.alert("Error", data.error || "Payment failed");
      }
    } catch (error) {
      //LN - Show an alert if a network error or exception occurs
      Alert.alert("Network Error", "Is the backend server running?");
      //LN - Log the specific error to the console for debugging
      console.error(error);
    } finally {
      //LN - Ensure loading is set back to false regardless of success or failure
      setLoading(false);
    }
  };

  //LN - Define an asynchronous function to simulate the authorization webhook
  const handleAuthorize = async () => {
    //LN - Set loading state to true to show the spinner
    setLoading(true);
    //LN - Start a try block for the authorization request
    try {
      //LN - Make a POST request to the stitch webhook endpoint
      const response = await fetch(`${API_URL}/api/webhooks/stitch`, {
        //LN - Specify the HTTP method as POST
        method: 'POST',
        //LN - Set headers to indicate the body content is JSON
        headers: { 'Content-Type': 'application/json' },
        //LN - Create the JSON body with payment ID and simulation data
        body: JSON.stringify({
          //LN - Pass the current payment ID
          id: paymentId,
          //LN - Simulate the completed event type
          type: 'payment.initiator.completed',
          //LN - Pass the original amount
          amount: amount
        })
      });

      //LN - Check if the webhook simulation was successful
      if (response.ok) {
        //LN - Update the step to 'success' to show the completion screen
        setStep('success');
      } else {
        //LN - Alert the user if the authorization simulation failed
        Alert.alert("Auth Failed", "Webhook rejected");
      }
    } catch (error) {
      //LN - Alert the user if an exception occurred during the request
      Alert.alert("Error", error.message);
    } finally {
      //LN - Ensure loading is set back to false
      setLoading(false);
    }
  };

  //LN - Define a function to reset the application flow to the beginning
  const resetFlow = () => {
    //LN - Set the step back to 'input'
    setStep('input');
    //LN - Clear the stored payment ID
    setPaymentId(null);
  };

  //LN - Return the JSX structure to render the UI
  return (
    //LN - Main container view applying the container styles
    <View style={styles.container}>
      {/* LN - Wrapper view for the logo section */}
      <View style={styles.logoContainer}>
        {/* LN - Placeholder view for the logo graphic */}
        <View style={styles.logoPlaceholder}>
          {/* LN - Text component for the logo name */}
          <Text style={styles.logoText}>Fynapay</Text>
        </View>
        {/* LN - Text component for the app tagline */}
        <Text style={styles.tagline}>Instant P2P Payments</Text>
      </View>

      {/* LN - Conditional rendering: if step is 'input', render the form */}
      {step === 'input' && (
        //LN - Card container for the input fields
        <View style={styles.card}>
          {/* LN - Label text for the Amount input */}
          <Text style={styles.label}>Amount (ZAR)</Text>
          {/* LN - Input field for amount, bound to amount state */}
          <TextInput 
            style={styles.input} 
            value={amount} 
            onChangeText={setAmount} 
            keyboardType="numeric"
          />

          {/* LN - Label text for the Name input */}
          <Text style={styles.label}>To (Name)</Text>
          {/* LN - Input field for recipient name, bound to state */}
          <TextInput 
            style={styles.input} 
            value={recipientName} 
            onChangeText={setRecipientName} 
          />

          {/* LN - Label text for the PayShap ID */}
          <Text style={styles.label}>PayShap ID</Text>
          {/* LN - Input field for ID, bound to state, no auto-caps */}
          <TextInput 
            style={styles.input} 
            value={recipientShapId} 
            onChangeText={setRecipientShapId} 
            autoCapitalize="none"
          />

          {/* LN - Label text for the Reference */}
          <Text style={styles.label}>Reference</Text>
          {/* LN - Input field for reference, bound to state */}
          <TextInput 
            style={styles.input} 
            value={reference} 
            onChangeText={setReference} 
            autoCapitalize="none"
          />

          {/* LN - Touchable button to trigger handlePay */}
          <TouchableOpacity 
            style={styles.payButton} 
            onPress={handlePay}
            disabled={loading}
          >
            {/* LN - Show spinner if loading, otherwise show 'Pay Now' text */}
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Pay Now</Text>}
          </TouchableOpacity>
        </View>
      )}

      {/* LN - Conditional rendering: if step is 'pending', render auth screen */}
      {step === 'pending' && (
        //LN - Card container for the pending state
        <View style={styles.card}>
          {/* LN - Title text for initiated payment */}
          <Text style={styles.title}>Payment Initiated</Text>
          {/* LN - Display the specific payment ID */}
          <Text style={styles.detail}>ID: {paymentId}</Text>
          {/* LN - Informational text instructing the user */}
          <Text style={styles.infoText}>
            Please authorize this payment with your bank.
          </Text>
          
          {/* LN - Button to trigger handleAuthorize (simulating bank action) */}
          <TouchableOpacity 
            style={[styles.payButton, styles.authButton]} 
            onPress={handleAuthorize}
            disabled={loading}
          >
             {/* LN - Show spinner if loading, otherwise show 'Authorize' text */}
             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Authorize (Simulate Bank)</Text>}
          </TouchableOpacity>
        </View>
      )}

      {/* LN - Conditional rendering: if step is 'success', render success screen */}
      {step === 'success' && (
        //LN - Card container for the success state
        <View style={styles.card}>
          {/* LN - Title text indicating success, styled green */}
          <Text style={[styles.title, {color: 'green'}]}>✓ Payment Successful</Text>
          {/* LN - Informational text summarizing the transaction */}
          <Text style={styles.infoText}>
            You sent R{amount} to {recipientName}.
          </Text>
          
          {/* LN - Outline button to trigger resetFlow */}
          <TouchableOpacity style={styles.outlineButton} onPress={resetFlow}>
            {/* LN - Text for the reset button */}
            <Text style={styles.outlineButtonText}>Make Another Payment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

//LN - Create the StyleSheet object to define UI styles
const styles = StyleSheet.create({
  //LN - Define styles for the main container
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
    justifyContent: 'center',
  },
  //LN - Define styles for the wrapper around the logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  //LN - Define styles for the logo placeholder box
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#333',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  //LN - Define styles for the text inside the logo
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  //LN - Define styles for the tagline text below the logo
  tagline: {
    color: '#666',
    fontSize: 16,
  },
  //LN - Define styles for the white card containers
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
  //LN - Define styles for input field labels
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    marginTop: 10,
  },
  //LN - Define styles for text input fields
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 18,
    paddingVertical: 8,
    color: '#333',
  },
  //LN - Define styles for the main action button
  payButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  //LN - Define specific color override for the authorization button
  authButton: {
    backgroundColor: '#0056b3',
  },
  //LN - Define styles for text inside buttons
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  //LN - Define styles for screen titles
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  //LN - Define styles for smaller detail text (like IDs)
  detail: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  //LN - Define styles for general informational paragraphs
  infoText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    lineHeight: 22,
  },
  //LN - Define styles for the outlined secondary button
  outlineButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  //LN - Define styles for text inside the outlined button
  outlineButtonText: {
    color: '#000',
    fontWeight: '600',
  }
});