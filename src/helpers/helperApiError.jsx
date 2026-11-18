const handleApiError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "An unknown error occurred"
  );
};

export default handleApiError;