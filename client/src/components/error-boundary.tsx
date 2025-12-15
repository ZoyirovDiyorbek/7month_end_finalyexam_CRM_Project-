import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: 50, 
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          <h1 style={{ color: "#ef4444", marginBottom: 16 }}>Xatolik yuz berdi</h1>
          <p style={{ color: "#6b7280", marginBottom: 24 }}>
            {this.state.error?.message || "Noma'lum xatolik"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4F46E5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Sahifani yangilash
          </button>
          <details style={{ marginTop: 24, textAlign: "left", maxWidth: 600 }}>
            <summary style={{ cursor: "pointer", color: "#6b7280" }}>
              Xato tafsilotlari
            </summary>
            <pre style={{ 
              marginTop: 12, 
              padding: 12, 
              backgroundColor: "#f3f4f6", 
              borderRadius: "8px",
              overflow: "auto",
              fontSize: "12px"
            }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

