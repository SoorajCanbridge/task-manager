function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === '23505') {
    return res.status(409).json({ message: 'Email already registered' });
  }
  res.status(500).json({ message: 'Something went wrong on the server' });
}

module.exports = errorHandler;
