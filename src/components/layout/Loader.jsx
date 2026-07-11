import React, { useEffect, useState } from "react";

const Loader = () => {
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    // If loading takes longer than 4s, it's likely the backend
    // (Render free tier) is waking up from sleep - let the user know.
    const timer = setTimeout(() => setShowSlowMessage(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div className="loader"></div>
      {showSlowMessage && (
        <p style={{ marginTop: "16px", color: "#6b6b6b" }}>
          Server is waking up, this can take up to 30 seconds on first load…
        </p>
      )}
    </div>
  );
};

export default Loader;