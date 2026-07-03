const freeEmailDomains = ['gmail.com', 'yandex.ru', 'hotmail.com'];

const getFreeDomainsCount = (emails) => emails
  .map((email) => email.split('@')[1])
  .filter((domain) => freeEmailDomains.includes(domain))
  .reduce((acc, domain) => ({ ...acc, [domain]: (acc[domain] ?? 0) + 1 }), {});

export default getFreeDomainsCount;
