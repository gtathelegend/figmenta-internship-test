const ErrorBanner = ({ message }) => {
  if (!message) {
    return null;
  }

  return <div className="notice">{message}</div>;
};

export default ErrorBanner;
