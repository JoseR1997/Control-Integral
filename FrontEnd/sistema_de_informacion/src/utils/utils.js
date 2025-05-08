export const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken;
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    }
    return null;
  };
  