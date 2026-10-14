# NFC Review Cards

A dynamic QR + NFC review card management system that allows businesses to use permanent physical cards while dynamically changing the destination associated with each card.

The system is designed for real-world deployment where QR codes and NFC tags are physically distributed to businesses and should remain reusable even when the business or destination changes.

---

## 🚀 Overview

Traditional QR review cards usually contain a direct Google Review URL.

For example:

```text
QR Code
   ↓
Google Review URL

🏗️ System Architecture
                    ┌──────────────────────┐
                    │    Physical Card     │
                    │      QR / NFC        │
                    └──────────┬───────────┘
                               │
                               ▼
              https://...web.app/{CARD_ID}
                               │
                               ▼
                    ┌──────────────────────┐
                    │      index.html      │
                    └──────────┬───────────┘
                               │
                               ▼
                       Firestore Lookup
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
              Active Card            Inactive Card
                    │                      │
                    ▼                      ▼
          Google Review URL          Admin Login
                                           │
                                           ▼
                                  Admin Dashboard
                                           │
                                           ▼
                                      Firestore
🔄 Customer Flow

When a customer scans a QR code or taps an NFC card:

QR / NFC
   ↓
Firebase URL
   ↓
Card ID extracted
   ↓
Firestore lookup
   ↓
Check card status
   ↓
Active?
   │
   ├── YES → Redirect to destination
   │
   └── NO  → Admin configuration flow
Step-by-step
Customer scans the QR code or taps the NFC card.
The browser opens the Firebase Hosting URL.
index.html extracts the Card ID from the URL.
The application queries the cards collection in Firestore.
The card's configuration is retrieved.
If the card is active and has a destination, the customer is redirected.
If the card is inactive, the system routes toward the administration flow.
🔐 Admin Flow

The administration system allows the authorized administrator to configure cards.

Card ID
   ↓
Admin Login
   ↓
Firebase Authentication
   ↓
Admin Dashboard
   ↓
Select Card
   ↓
Configure Card
   ├── Shop Name
   ├── Destination URL
   └── Active / Inactive
   ↓
Save
   ↓
Firestore

The Card ID can be passed through the URL so the dashboard can automatically select the corresponding card.

🗄️ Firestore Data Model

The application uses a Firestore collection named:

cards

Each Card ID is used as the Firestore document ID.

Example:

cards/
└── 39ZBUL
    ├── shopName: "Sharma Restaurant"
    ├── destination: "https://..."
    └── active: true

An unused card can be stored as:

cards/
└── CARD_ID
    ├── destination: ""
    └── active: false

This allows the physical card inventory to exist independently from its current business assignment.

🔄 Dynamic Card Reassignment

One of the main advantages of the system is card reassignment.

Suppose:

Card ID: 39ZBUL

is currently assigned to:

Sharma Restaurant

The physical QR/NFC card contains:

https://nfc-review-cards-690a6.web.app/39ZBUL

Later, the card can be reassigned.

The QR/NFC tag remains unchanged.

Only Firestore changes:

Before:

39ZBUL
   ↓
Sharma Restaurant
After:

39ZBUL
   ↓
Another Business

This eliminates the need to replace the physical card whenever the destination changes.

🧩 Main Components
public/index.html

The entry point for QR/NFC scans.

Responsibilities:

Extract Card ID from the URL
Query Firestore
Check card status
Redirect active cards
Route inactive cards to the administration flow
Preserve the selected Card ID
public/admin.html

Handles administrator authentication.

Responsibilities:

Email/password authentication
Firebase Authentication
Card ID retrieval from URL
Session storage fallback
Login error handling
Network retry handling
Redirect to the dashboard after successful authentication
public/admin-dashboard.html

The main card management interface.

Responsibilities:

Display cards
Display active cards
Select cards
Automatically select cards from the URL
Configure shop name
Configure destination URL
Enable/disable cards
Save configuration to Firestore
Logout
setup-cards.js

Initializes Card IDs in Firestore.

The script reads Card IDs from:

qr-codes/card-ids.txt

It creates Firestore documents for cards that do not already exist.

Existing cards are skipped.

This makes the setup process safe to run multiple times.

Example output:

New cards added: 0
Existing cards skipped: 100
Card setup complete.
generate-cards.js

Used for generating Card IDs and QR card assets.

Production QR assets are intentionally excluded from this GitHub repository because they correspond to physical cards used in the real-world deployment.

📁 Project Structure
nfc-review-cards/
│
├── public/
│   ├── index.html
│   ├── admin.html
│   └── admin-dashboard.html
│
├── generate-cards.js
├── setup-cards.js
│
├── firestore.rules
├── firestore.indexes.json
│
├── firebase.json
├── .firebaserc
│
├── package.json
├── package-lock.json
│
├── .gitignore
└── README.md
🛠️ Tech Stack
Frontend
HTML5
CSS3
JavaScript
Firebase Web SDK
Backend / Cloud
Firebase Hosting
Firebase Firestore
Firebase Authentication
Development
Node.js
Firebase CLI
Git
GitHub
Visual Studio Code
Hardware / Physical Layer
QR Codes
NFC Tags
NFC-enabled smartphones
🔥 Firebase Configuration

The project uses Firebase for the cloud infrastructure.

Firebase services used
Firebase Hosting
       +
Firebase Firestore
       +
Firebase Authentication

The Firebase project contains:

Project:
nfc-review-cards-690a6

The deployed application is hosted on Firebase Hosting.

🔐 Security

Firestore write access is restricted to the authorized administrator.

The application allows public reads of card information because customers need to resolve a Card ID into its current destination.

Administrative writes require authentication and the configured administrator UID.

The Firestore rules follow the principle that:

Customer
   ↓
Read card configuration

Administrator
   ↓
Read + Write card configuration

The Firebase Admin SDK service account is kept outside the repository.

🔒 Sensitive Files

The following files are intentionally excluded from Git:

serviceAccountKey.json

The service account contains privileged Firebase credentials and must never be committed to a public repository.

The .gitignore also excludes production QR assets.

📦 Production QR Assets

The project uses physical QR/NFC cards in the real-world deployment.

The production QR images and card inventory are intentionally not included in this repository.

This prevents the repository from exposing or distributing the physical production card assets.

The software required to generate and manage the cards remains in the repository.

🚀 Local Development
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/nfc-review-cards.git

Enter the project directory:

cd nfc-review-cards
2. Install dependencies
npm install
3. Configure Firebase

Create/configure the Firebase project and update the Firebase configuration used by the frontend.

The project requires:

Firebase Hosting
Firestore
Firebase Authentication

Enable:

Authentication
→ Email/Password
4. Configure Firestore

Create the required Firestore database and deploy the rules:

firebase deploy --only firestore:rules
5. Initialize Cards

Provide the required Card IDs and run:

node setup-cards.js

The script creates missing card documents and skips existing cards.

🚀 Deployment

The application is deployed using Firebase Hosting.

Firebase configuration is defined in:

firebase.json
.firebaserc

Deploy the complete application using:

firebase deploy

For Hosting only:

firebase deploy --only hosting

For Firestore rules:

firebase deploy --only firestore:rules
🧪 Testing

The major application flows have been tested.

Active Card
QR / NFC
   ↓
Card ID
   ↓
Firestore
   ↓
active = true
   ↓
Destination URL
   ↓
Google Review
Inactive Card
QR / NFC
   ↓
Card ID
   ↓
Firestore
   ↓
active = false
   ↓
Admin Flow
Admin Authentication
Admin Login
   ↓
Firebase Authentication
   ↓
Successful Login
   ↓
Admin Dashboard
Card Selection

The dashboard supports:

URL Card ID
      ↓
Automatic Card Selection
      ↓
Card Configuration

This makes it possible to enter the administration flow directly from a particular physical card.

📊 Current Production Setup

The system was designed around a physical inventory of:

100 unique cards

Each card has its own permanent Card ID.

The production QR assets remain outside the GitHub repository.

The Firestore database stores the current configuration of each card.