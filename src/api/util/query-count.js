module.exports = (query) =>
  new Promise((resolve, reject) => {
    let count = 0;

    query
      .stream()
      .on('data', () => count++)
      .on('end', () => resolve(count))
      .on('error', reject);
  });
