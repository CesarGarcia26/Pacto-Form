import React from "react";
import { createRoot } from "react-dom/client";

function Toast({ type = "notificacion", message = "", onClose }) {
  const typeClass =
    type === "error"
      ? "messageError"
      : type === "alerta"
      ? "messageWarning"
      : "messageInfo";

  const Icon = () => {
    if (type === "error") {
      return (
        <svg className="messageIcon" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    }
    if (type === "alerta") {
      return (
        <svg className="messageIcon" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    }
    // notificacion (info)
    return (
      <svg className="messageIcon" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="8" />
        <line x1="12" y1="12" x2="12" y2="16" />
      </svg>
    );
  };

  return (
    <div className="messageBackdrop" onClick={onClose}>
      <div className={`messageContainer ${typeClass}`} onClick={(e) => e.stopPropagation()}>
        <div className="messageBody">
          <div className="messageContent">
            <Icon />
            <p className="messageText">{message}</p>
          </div>
        </div>
        <div className="messageActions">
          <button className="messageButton" onClick={onClose}>Aceptar</button>
        </div>
      </div>
    </div>
  );
}

export default function ShowMessage(type = "notificacion", message = "") {
  const container = document.createElement("div");
  container.setAttribute("data-show-message", "true");
  document.body.appendChild(container);

  const root = createRoot(container);

  const handleClose = () => {
    try {
      root.unmount();
    } finally {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }
  };

  root.render(<Toast type={type} message={message} onClose={handleClose} />);
}


