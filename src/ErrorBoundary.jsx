import React from "react";

const ERR_STYLES = {
  wrap: {
    padding: 24,
    borderRadius: 14,
    background: "rgba(220, 38, 38, 0.07)",
    border: "1px solid rgba(220, 38, 38, 0.2)",
    textAlign: "center",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  icon:    { fontSize: 36, marginBottom: 10 },
  title:   { color: "#DC2626", fontWeight: 700, fontSize: 15, marginBottom: 8 },
  detail:  { color: "#6B7280", fontSize: 12, marginBottom: 16, fontFamily: "monospace" },
  btn: {
    background: "#1D4ED8",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 20px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  },
};

/**
 * ErrorBoundary — wraps heavy UI sections (canvas, 3D components, library cards)
 * so a crash in one section never takes down the whole app.
 *
 * Security note: error details are only logged (not rendered) in non-production
 * environments to prevent leaking internal stack traces to end users.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message ?? "Unknown error" };
  }

  componentDidCatch(error, info) {
    // Never expose sensitive context or API keys in production logs
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error.message, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.errorMessage} onReset={this.handleReset} />;
      }
      return (
        <div style={ERR_STYLES.wrap} role="alert">
          <div style={ERR_STYLES.icon}>⚠️</div>
          <div style={ERR_STYLES.title}>
            {this.props.label ?? "Something went wrong"}
          </div>
          {process.env.NODE_ENV !== "production" && (
            <div style={ERR_STYLES.detail}>{this.state.errorMessage}</div>
          )}
          <button style={ERR_STYLES.btn} onClick={this.handleReset}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
