import React from 'react';

function App() {
    return (
        <div className="App" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '24px',
        }}>
            <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                marginBottom: 24,
            }} />
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                margin: '0 0 12px 0',
                textAlign: 'center',
            }}>
                Aurora Health
            </h1>
            <p style={{
                fontSize: '1.125rem',
                color: '#94a3b8',
                margin: '0 0 32px 0',
                textAlign: 'center',
                maxWidth: 480,
                lineHeight: 1.6,
            }}>
                Your intelligent health companion. Empowering better health decisions through smart insights.
            </p>
            <div style={{
                display: 'flex',
                gap: 16,
            }}>
                <button style={{
                    padding: '12px 28px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    color: '#fff',
                }}>
                    Get Started
                </button>
                <button style={{
                    padding: '12px 28px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 8,
                    border: '1px solid #334155',
                    cursor: 'pointer',
                    background: 'transparent',
                    color: '#f8fafc',
                }}>
                    Learn More
                </button>
            </div>
            <p style={{
                marginTop: 48,
                fontSize: '0.875rem',
                color: '#475569',
            }}>
                Deployment successful
            </p>
        </div>
    );
}

export default App;
