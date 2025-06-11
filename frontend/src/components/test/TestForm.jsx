import React, { useState, useRef } from 'react';

/**
 * 🧪 TestForm - Formulario simple para testing de re-renders
 * 
 * Formulario ultra-básico para verificar que no hay problemas de re-renders
 */
const TestForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const renderCount = useRef(0);
  
  renderCount.current++;
  
  console.log(`🧪 TestForm RENDER #${renderCount.current}`);

  const handleNameChange = (e) => {
    console.log('📝 Name changing:', e.target.value);
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    console.log('📧 Email changing:', e.target.value);
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('✅ Form submitted:', { name, email });
    alert(`Form submitted!\nName: ${name}\nEmail: ${email}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-lg">
      
      {/* Debug info */}
      <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
        <strong>🧪 Test Form Debug:</strong>
        <br />
        Renders: <span className="font-mono font-bold">{renderCount.current}</span>
        <br />
        Name: <span className="font-mono">{name}</span>
        <br />
        Email: <span className="font-mono">{email}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre:
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tu nombre..."
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email:
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tu@email.com"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Enviar Test
        </button>

      </form>

    </div>
  );
};

export default TestForm;