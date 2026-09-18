"use client";

import { useState } from "react";
import ContactsForm from "./ContactsForm";

const FormTest = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button 
        onClick={() => setIsVisible(!isVisible)}
        style={{
          padding: "10px 20px",
          background: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        {isVisible ? "Hide Form" : "Show Contact Form"}
      </button>
      
      {isVisible && (
        <div style={{ 
          background: "rgba(255, 255, 255, 0.05)", 
          padding: "20px", 
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <h2 style={{ marginBottom: "20px", color: "#6366f1" }}>
            Contact Form Test
          </h2>
          <ContactsForm />
        </div>
      )}
    </div>
  );
};

export default FormTest; 