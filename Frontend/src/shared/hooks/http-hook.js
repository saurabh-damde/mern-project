import { useCallback, useRef, useState } from "react";

export const useHttpClient = () => {
  const activeRequests = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const sendRequest = useCallback(
    async (url, method = "GET", headers = {}, body = null) => {
      setIsLoading(true);
      const abortController = new AbortController();
      activeRequests.current.push(abortController);
      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: abortController.signal,
        });
        const responseData = await response.json();
        activeRequests.current = activeRequests.current.filter(
          (ctrl) => ctrl !== abortController
        );
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  // useEffect(() => {
  //   return () => {
  //     activeRequests.current.forEach((ctrl) => ctrl.abort());
  //   };
  // }, []);

  return { isLoading, error, sendRequest, clearError };
};
