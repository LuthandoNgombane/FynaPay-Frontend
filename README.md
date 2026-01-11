# Fynapay 💸

> **Instant P2P Payments Prototype**
> *Simulating the "PayShap" banking rails using React Native and Node.js.*

## 📖 Overview

Fynapay is a full-stack financial technology (Fintech) prototype designed to demonstrate instant Peer-to-Peer (P2P) payments. It allows users to send money directly to a recipient's bank account using only a unique identifier (PayShap ID), bypassing traditional account numbers.

Currently, this project runs in **Mock Mode**, simulating the interaction with the **Stitch Money API** to demonstrate the full payment lifecycle (Initiation → Pending → Webhook Confirmation) without requiring live banking credentials.

---

## 🏗️ Architecture

The project follows a clean **Separation of Concerns** with a split repository structure:

| Service | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React Native (Expo) | A cross-platform mobile app (iOS/Android/Web) for user interaction. |
| **Backend** | Node.js & Express | A REST API that handles validation, banking logic, and webhooks. |
| **Bank API** | (Mock Service) | Simulates external banking calls and callback webhooks. |

### Data Flow
1.  **User** initiates payment in the Mobile App.
2.  **Frontend** POSTs data to the Backend API.
3.  **Backend** requests a payment URL from the Bank (Mock Service).
4.  **App** displays "Pending" state and asks for authorization.
5.  **User** authorizes the payment (Simulated Button).
6.  **Bank** sends a **Webhook** to the Backend confirming success.
7.  **App** updates the UI to "Payment Successful".

---

## 📂 Project Structure

```
FYNAPAY/
├── backend/               # The Node.js Server
│   ├── controllers/       # Logic for Payments & Webhooks
│   ├── services/          # Stitch Money API Integration (Mocked)
│   ├── server.js          # Entry Point & Routes
│   └── README.md          # specific backend documentation
│
├── frontend/              # The Mobile App
│   └── fynapay-mobile/
│       ├── app/           # Expo Router Screens (UI)
│       └── package.json   # App Dependencies
│
└── README.md              # (You are here)
