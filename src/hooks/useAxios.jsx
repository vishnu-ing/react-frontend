import { useState, useEffect } from 'react';
import axios from '../api/auth.interceptor';

const useAxios = (url) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);

    axios
      .get(url)
      .then((response) => setData(response.data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [url]);

  return [data, loading, error];
};

export default useAxios;
