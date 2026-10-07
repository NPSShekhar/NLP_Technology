// Only selected error fields; never serialize the transport, auth or environment.
module.exports = function smtpError(error, env = process.env) {
  const password = env.SMTP_APP_PASSWORD || "";
  const user = env.SMTP_USER || "";
  const secrets = password ? [password, Buffer.from(password).toString("base64"), encodeURIComponent(password), Buffer.from("\0" + user + "\0" + password).toString("base64"), Buffer.from(user + ":" + password).toString("base64")] : [];
  const clean = value => {
    if (typeof value !== "string" && typeof value !== "number") return null;
    let text = String(value);
    for (const secret of secrets) text = text.split(secret).join("[REDACTED]");
    return text.replace(/AUTH\s+(PLAIN|LOGIN|XOAUTH2|CRAM-MD5)(?:[ \t]+[^\r\n]*)?/gi, "AUTH $1 [REDACTED]")
      .replace(/(password|passwd|pass|authorization)\s*[:=]\s*[^\s,;]+/gi, "$1=[REDACTED]")
      .replace(/[\r\n\x00-\x1f\x7f]+/g, " ").slice(0, 1500);
  };
  return { code: clean(error?.code), command: clean(error?.command), responseCode: clean(error?.responseCode), response: clean(error?.response), message: clean(error?.message) };
};
