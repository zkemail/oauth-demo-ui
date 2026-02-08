import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
    input: {
      margin: "0",
      padding: "0.625rem",
      fontSize: "1rem",
      borderRadius: "4px",
      border: "1px solid #ccc",
      width: "100%",
      height: "max-content",
    },
    button: {
      border: "none",
      color: 'black',
      borderRadius: "4px",
      padding: "0.75rem",
      fontSize: "1rem",
      fontWeight: 700,
      cursor: "pointer",
    },
    transaction: {
      border: "1px solid #ccc",
      padding: "1rem",
      cursor: "pointer",
      borderRadius: 4,
    },
    deprecationBanner: {
      background: "#FEF3C7",
      border: "1px solid #F59E0B",
      color: "#92400E",
      borderRadius: 6,
      padding: "0.75rem 1rem",
      fontSize: "0.95rem",
      lineHeight: 1.4,
      textAlign: "center",
    },
    deprecationLink: {
      color: "#92400E",
      fontWeight: 700,
      textDecoration: "underline",
    },
  };