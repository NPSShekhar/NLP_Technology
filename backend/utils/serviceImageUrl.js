/** Resolve service uploads against the backend serving the current request. */
module.exports = function createImageUrl(req, imagePath) {
  if (!imagePath) return null;

  let localPath = imagePath;
  if (/^https?:\/\//i.test(imagePath)) {
    const url = new URL(imagePath);
    // Older records stored the deployment URL instead of an upload path.
    if (url.hostname !== "nlptech.netopsys.in" ||
        !/^\/(?:api\/)?uploads\//.test(url.pathname)) {
      return imagePath;
    }
    localPath = url.pathname + url.search;
  }

  localPath = localPath.replace(/^[/\\]+/, "");
  if (localPath.startsWith("uploads/")) localPath = `api/${localPath}`;

  return `${req.protocol}://${req.get("host")}/${localPath}`;
};
