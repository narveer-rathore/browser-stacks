export const toggleSettings = () => {
  if ('URLSearchParams' in window) {
    const url = new URL(window.location.href);
    if (url.searchParams.get("settings")) {
      url.searchParams.delete("settings");
      console.log("toggleSettings remove", url.toString())

      window.history.pushState(null, '', url.toString());
    } else {
      url.searchParams.set("settings", "true");
      console.log("toggleSettings set", url.toString())
      window.history.pushState(null, '', url.toString());
    }
  }
}
