export const captureScreenshot = async (webview) => {
  try {
    // Capture the webview content
    const nativeImage = await webview.capturePage();

    // Convert to PNG buffer
    const pngBuffer = nativeImage.toPNG();

    // Convert to base64 for preview
    const base64Data = nativeImage.toDataURL();

    return {
      preview: base64Data,
      buffer: pngBuffer
    };
  } catch (error) {
    console.error('Screenshot failed:', error);
    throw error;
  }
};

export const downloadScreenshot = (buffer, filename) => {
  try {
    const blob = new Blob([buffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};
