const fs = require("fs");
const path = require("path");

exports.handler = async (event, context) => {
  const clientIP = event.headers["x-nf-client-connection-ip"] || "0.0.0.0";
  const action = event.queryStringParameters.action;

  const ipsPath = path.join(__dirname, "..", "ips.json");
  const codesPath = path.join(__dirname, "..", "codes.json");

  let ips = JSON.parse(fs.readFileSync(ipsPath, "utf8"));
  let allowedCodes = JSON.parse(fs.readFileSync(codesPath, "utf8"));

  // -------- 1. GET → يعطي كود حسب IP --------
  if (action === "get") {
    let entry = ips.find(i => i.ip === clientIP);

    // إذا IP جديد → يولد كود جديد
    if (!entry) {
      let newCode = Math.floor(100000 + Math.random() * 900000).toString();
      entry = { ip: clientIP, code: newCode };
      ips.push(entry);

      // تحديث الملف
      fs.writeFileSync(ipsPath, JSON.stringify(ips, null, 2));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ code: entry.code })
    };
  }

  // -------- 2. CHECK → يتحقق من الكود --------
  if (action === "check") {
    const userCode = event.queryStringParameters.code;

    const ok = allowedCodes.find(i => i.code === userCode);

    if (ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "allowed", name: ok.name })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "denied" })
      };
    }
  }

  return { statusCode: 400, body: "Invalid request" };
};
