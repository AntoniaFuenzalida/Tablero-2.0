import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const PaginaPrueba = () => {
  const [texto, setTexto] = useState('');
  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Desconectado');
  const [mqttTopic, setMqttTopic] = useState('mensaje');
  const [lastMessage, setLastMessage] = useState(null);

  // Configurar conexión MQTT cuando el componente se monte
  useEffect(() => {
    // Establece la conexión con el broker MQTT
    const brokerUrl = 'ws://192.168.183.156:9001'; // Cambia esto por la URL de tu broker MQTT
    console.log(`[DEBUG] Intentando conectar a broker MQTT: ${brokerUrl}`);
    
    const mqttClient = mqtt.connect(brokerUrl);
    
    mqttClient.on('connect', () => {
      console.log(`[DEBUG] Conectado exitosamente al broker MQTT: ${brokerUrl}`);
      setConnectionStatus('Conectado');
      
      // Suscribirse a un tema para recibir mensajes
      mqttClient.subscribe(mqttTopic, (err) => {
        if (!err) {
          console.log(`[DEBUG] Suscrito exitosamente al tema: ${mqttTopic}`);
        } else {
          console.error(`[DEBUG] Error al suscribirse al tema ${mqttTopic}:`, err);
        }
      });
    });

    mqttClient.on('message', (topic, message) => {
      const msg = message.toString();
      console.log(`[DEBUG] Mensaje recibido en tema ${topic}: "${msg}"`);
      setLastMessage({ topic, message: msg, timestamp: new Date().toLocaleTimeString() });
    });

    mqttClient.on('error', (err) => {
      console.error(`[DEBUG] Error de conexión MQTT:`, err);
      setConnectionStatus('Error: ' + err.message);
    });

    mqttClient.on('reconnect', () => {
      console.log(`[DEBUG] Intentando reconectar al broker MQTT...`);
      setConnectionStatus('Reconectando...');
    });

    mqttClient.on('offline', () => {
      console.log(`[DEBUG] Cliente MQTT desconectado`);
      setConnectionStatus('Desconectado');
    });

    setClient(mqttClient);

  // Limpieza al desmontar el componente
    return () => {
      if (mqttClient) {
        console.log(`[DEBUG] Cerrando conexión MQTT`);
        mqttClient.end();
      }
    };
  }, [mqttTopic]);

  // Actualizar suscripción cuando cambie el tema
  useEffect(() => {
    if (client && client.connected) {
      // Primero desuscribirse del tema anterior
      client.unsubscribe(mqttTopic, (err) => {
        if (!err) {
          console.log(`[DEBUG] Desuscrito del tema anterior`);
          
          // Luego suscribirse al nuevo tema
          client.subscribe(mqttTopic, (err) => {
            if (!err) {
              console.log(`[DEBUG] Suscrito al nuevo tema: ${mqttTopic}`);
            } else {
              console.error(`[DEBUG] Error al suscribirse al tema ${mqttTopic}:`, err);
            }
          });
        }
      });
    }
  }, [mqttTopic, client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (client && client.connected) {
      console.log(`[DEBUG] Intentando publicar mensaje en tema: ${mqttTopic}`);
      console.log(`[DEBUG] Contenido del mensaje: "${texto}"`);
      
      // Publicar el mensaje al tema MQTT
      client.publish(mqttTopic, texto, { qos: 0, retain: false }, (err) => {
        if (!err) {
          console.log(`[DEBUG] Mensaje publicado exitosamente`);
          // Opcionalmente, limpiar el campo después de enviar
          setTexto('');
        } else {
          console.error(`[DEBUG] Error al publicar mensaje:`, err);
          alert(`Error al enviar mensaje: ${err.message}`);
        }
      });
    } else {
      console.error(`[DEBUG] No hay conexión MQTT disponible. Estado: ${connectionStatus}`);
      alert('No hay conexión con el broker MQTT');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h5 style={styles.headerText}>Página de Prueba MQTT</h5>
          <span style={styles.statusIndicator}>
            Estado MQTT: {connectionStatus}
          </span>
        </div>
        <div style={styles.cardBody}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tema MQTT</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Tema MQTT (ejemplo: miDispositivo/mensaje)"
                value={mqttTopic}
                onChange={(e) => setMqttTopic(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Mensaje para enviar</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Escriba algo aquí..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                required
              />
            </div>
            <button 
              style={client && client.connected ? styles.button : styles.buttonDisabled} 
              type="submit"
              disabled={!client || !client.connected}
            >
              Enviar mensaje MQTT
            </button>
          </form>
          
          {lastMessage && (
            <div style={styles.messageLog}>
              <h6 style={styles.messageLogHeader}>Último mensaje recibido:</h6>
              <p>
                <strong>Tema:</strong> {lastMessage.topic}<br />
                <strong>Mensaje:</strong> {lastMessage.message}<br />
                <strong>Hora:</strong> {lastMessage.timestamp}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    card: {
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
    },
    cardHeader: {
      padding: '12px 20px',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerText: {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    statusIndicator: {
      fontSize: '0.9rem',
      color: '#555',
    },
    cardBody: {
      padding: '20px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 500,
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      boxSizing: 'border-box',
    },
    button: {
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 16px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    buttonDisabled: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 16px',
      fontSize: '16px',
      cursor: 'not-allowed',
      opacity: 0.65,
    },
    messageLog: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '4px',
    },
    messageLogHeader: {
      margin: '0 0 10px 0',
      fontSize: '1rem',
      fontWeight: 500,
    }
};

export default PaginaPrueba;