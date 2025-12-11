const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code;
  if (!code) return { statusCode: 400, body: "لا يوجد كود للتحقق." };

  const client_id = "1448765895785582744";
  const client_secret = "KL36twVtuSD4Zd1K-fcjAm24FH4hXfID";
  const redirect_uri = "https://team-x-webhook-spam-1.netlify.app/.auth/discord/callback";
  const server_id = "1233298974467817482";
  const role_id = "1243912778670931968";

  // Step 1: Exchange code for access token
  const params = new URLSearchParams();
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);

  let tokenData;
  try {
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    tokenData = await res.json();
  } catch (err) {
    return { statusCode: 500, body: "خطأ أثناء جلب التوكن." };
  }

  if (!tokenData.access_token) return { statusCode: 401, body: "توكن غير صالح." };

  // Step 2: Get user info
  let userData;
  try {
    const res = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    userData = await res.json();
  } catch (err) {
    return { statusCode: 500, body: "خطأ أثناء جلب بيانات المستخدم." };
  }

  // Step 3: Get member info from server (using Bot token)
  let memberInfo;
  try {
    const res = await fetch(`https://discord.com/api/guilds/${server_id}/members/${userData.id}`, {
      headers: { Authorization: `Bot ${client_secret}` } // لازم البوت يكون في السيرفر وعندو صلاحيات
    });
    memberInfo = await res.json();
  } catch (err) {
    return { statusCode: 500, body: "خطأ أثناء جلب بيانات العضو." };
  }

  if (!memberInfo.roles || !memberInfo.roles.includes(role_id)) {
    return { statusCode: 403, body: "لا تمتلك الرول المطلوب للدخول." };
  }

  // Step 4: Redirect to main.html
  return {
    statusCode: 302,
    headers: { Location: "/main.html" },
    body: ""
  };
};
