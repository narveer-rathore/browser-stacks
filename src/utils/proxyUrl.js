export const formatUrl = (inputUrl) => {
  if (!inputUrl) return '';

  let formattedUrl = inputUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  return formattedUrl;
};

export const createProxyUrl = (url) => {
  if (!url) return '';
  const formattedUrl = formatUrl(url);
  return `http://localhost:3030/proxy?url=${encodeURIComponent(formattedUrl)}`;
};
