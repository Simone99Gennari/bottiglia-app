import { useState, useEffect } from 'react';

function App() {
  const [phrase, setPhrase] = useState('');
  const [status, setStatus] = useState('🕵️ In attesa...');
  const [deviceName, setDeviceName] = useState('');

  // 1️⃣ Prendi l'ID della bottiglia dal link (es. ?bottleId=Vodka007)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bottleId = params.get('bottleId') || 'VodkaBottle';
    setDeviceName(bottleId);
  }, []);

  // 2️⃣ Connetti al Bluetooth automaticamente
  useEffect(() => {
    if (!deviceName) return;

    const connect = async () => {
      try {
        setStatus(`🔄 Cerco la bottiglia ${deviceName}...`);

        const device = await navigator.bluetooth.requestDevice({
          filters: [{ namePrefix: deviceName }],
          optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'],
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

        window.btCharacteristic = characteristic;
        setStatus(`✅ Connesso a ${deviceName}`);
      } catch (err) {
        console.error(err);
        setStatus('❌ Connessione fallita');
      }
    };

    // Simulazione click (richiesto da sicurezza browser)
    setTimeout(connect, 1000);
  }, [deviceName]);

  // 3️⃣ Invio frase
  const sendPhrase = async () => {
    if (!window.btCharacteristic) {
      setStatus("⚠️ Bottiglia non connessa");
      return;
    }
    try {
      const encoder = new TextEncoder();
      await window.btCharacteristic.writeValue(encoder.encode(phrase));
      setStatus('✅ Frase inviata!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Invio fallito');
    }
  };

  // 4️⃣ Interfaccia utente
return (
  <div style={{
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    color: '#fff',
    padding: '1rem',
    boxSizing: 'border-box'
  }}>
    <div style={{
      width: '100%',
      maxWidth: '480px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '1.5rem'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1.2' }}>
        Bottiglia:<br />
        <span>{deviceName}</span>
      </h1>

      <input
        type="text"
        placeholder="Scrivi la tua frase..."
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        style={{
          padding: '0.75rem',
          borderRadius: '0.5rem',
          width: '100%',
          border: 'none',
          color: '#000'
        }}
      />

        <button
          onClick={sendPhrase}
          style={{
            backgroundColor: '#c084fc', // lilla
            color: '#fff',
            border: 'none',
            padding: '0.75rem',
            width: '80%', // meno largo
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🚀 Invia
        </button>

      <p style={{ fontSize: '0.875rem', color: '#f87171' }}>{status}</p>
    </div>
  </div>
);
}

export default App;
