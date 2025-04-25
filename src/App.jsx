import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { SignIn, SignUp, UserProfile } from '@clerk/clerk-react';

import Home from './Home';
import QrGenerator from './QrGenerator';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log("Chiave Clerk:", publishableKey);

function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Router>
        <Routes>
          {/* Home pubblica */}
          <Route path="/" element={<Home />} />

          {/* QR Page - protetta con redirect */}
          <Route
            path="/qr"
            element={
              <>
                <SignedIn>
                  <QrGenerator />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          {/* Clerk routes */}
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
          <Route path="/user-profile/*" element={<UserProfile routing="path" path="/user-profile" />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
