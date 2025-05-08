import React, { useState } from 'react';

const PaginaPrueba = () => {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes implementar la funcionalidad que necesites
    console.log('Texto enviado:', texto);
    // Por ejemplo: llamar a una API, guardar en base de datos, etc.
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h5 style={styles.headerText}>Página de Prueba</h5>
        </div>
        <div style={styles.cardBody}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Ingrese texto</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Escriba algo aquí..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                required
              />
            </div>
            <button style={styles.button} type="submit">
              Subir
            </button>
          </form>
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
    },
    headerText: {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 500,
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
    }
  };

export default PaginaPrueba;