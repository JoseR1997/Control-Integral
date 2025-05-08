import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario: email, contrasena: password }),
      });

      const result = await response.json();

      if (result.Issuccessful) {
        setSuccess('Login exitoso');
        setError('');
        localStorage.setItem('token', result.Details.token);
        window.location.href = '/home';
      } else {
        setError(result.Description);
        setSuccess('');
      }
    } catch (error) {
      setError('Error al iniciar sesión. Intente de nuevo más tarde.');
      setSuccess('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className='mt-16 mx-10 flex justify-center items-center flex-col'>
        <div className='text-container text-center mb-8 w-[530px]'>
          <p className='text-[24px] fade-in'>
            Bienvenido a la oficina virtual de la abogada Mariana Chacón Ramírez
          </p>
        </div>
        <div className='bg-white p-8 rounded-lg shadow-lg w-100 border border-gray-300'>
          <form onSubmit={handleSubmit}>
            <p className='mb-4 text-center'>Para iniciar sesión ingrese los siguientes datos:</p>
            {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
            {success && <p className='text-green-500 text-center mb-4'>{success}</p>}
            <div className="mb-4">
              <label htmlFor="email" className='block text-sm font-medium mb-2'>Correo</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className='block text-sm font-medium mb-2'>Contraseña</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='w-full flex items-end justify-end'>
              <button 
                type="submit" 
                className='w-auto p-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
