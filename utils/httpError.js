const httpError = ({ message = "Something happened...", status = 404 }) => {
  const error = Error(message);
  error.status = status;
  return error;
};

module.exports = httpError;
