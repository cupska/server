const { response } = require("express");

exports.extractTokenFromCookieHeader = (cookies) => {
  if (!cookies) return undefined;
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  // Ekstrak token dari cookie
  const token = tokenCookie.split(";")[0].split("=")[1];
  return token;
};
