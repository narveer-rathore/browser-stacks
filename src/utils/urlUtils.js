export const formatUrl = (inputUrl) => {
  if (!inputUrl) return '';

  // Remove leading/trailing whitespace
  let formattedUrl = inputUrl.trim();

  // Check if the URL starts with a protocol
  if (!/^https?:\/\//i.test(formattedUrl)) {
    // Add https:// if no protocol is present
    formattedUrl = `https://${formattedUrl}`;
  }

  try {
    // Validate URL format
    new URL(formattedUrl);
    return formattedUrl;
  } catch (error) {
    console.error('Invalid URL:', error);
    return '';
  }
};

// Additional URL-related utilities can be added here
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
