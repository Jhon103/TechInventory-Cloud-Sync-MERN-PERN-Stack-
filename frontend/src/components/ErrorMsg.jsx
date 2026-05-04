import React from 'react';

export default function ErrorMsg({ mensaje }) {
  return <div className="error-msg">⚠ {mensaje}</div>;
}