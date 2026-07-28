function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const userPart = req.user ? ` user=${req.user.id}` : '';

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms${userPart}`
    );
  });

  next();
}

module.exports = requestLogger;
