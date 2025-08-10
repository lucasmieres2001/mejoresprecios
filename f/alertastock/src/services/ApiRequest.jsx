export default async function ApiRequest(method = 'GET', path = '/', isJson = true, payloads = {}) {
  const data = await fetch(`http://localhost:8080${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: payloads
  });
    return isJson ? await data.json() : await data.text();
}