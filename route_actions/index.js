const loadIndexPage = (request, response) => {
  let key = process.env.SCHOOLOGY_CONSUMER_KEY;
  let secret = process.env.SCHOOLOGY_CONSUMER_SECRET;

  response.render('index', { key: key, secret: secret });
};

module.exports = {
  loadIndexPage: loadIndexPage,
};
