import { useState } from 'react';
import { SignedIn } from '@clerk/clerk-react';

function QrGenerator() {
  const [qrCode, setQrCode] = useState(null);
  const [bottleId, setBottleId] = useState('');

  const generateQRCode = () => {
    const randomId = `BOTTIGLIA-${Math.floor(1000 + Math.random() * 9000)}`; // ID simulato
    setBottleId(randomId);

    // Genera URL QR da API pubblica
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(randomId)}&size=200x200`;
    setQrCode(qrUrl);
  };

return (
  <SignedIn>
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">Generatore QR Bottiglia</h1>
        <p className="text-lg md:text-xl">Genera il QR code della bottiglia 🧃</p>

        <button
          onClick={generateQRCode}
          className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded"
          >
          Genera QR
        </button>

        {qrCode && (
          <div className="space-y-2">
            <p className="text-sm">
              ID generato: <strong>{bottleId}</strong>
            </p>
            <img src={qrCode} alt="QR Code" className="mx-auto" />
          </div>
        )}
      </div>
    </div>
  </SignedIn>
);
  
}

export default QrGenerator
