const fetch = require("node-fetch");

const BIN_ID = "693b36c9ae596e708f937112";
const SECRET_KEY = "$2a$10$AjRuVKTacvaXsqsQqhfn4.Gig6qoHtADY3IqpR9Kezp93l.BAbu8K";

exports.handler = async (event) => {
    const code = event.queryStringParameters?.code;
    if(!code) return { statusCode: 400, body: JSON.stringify({ valid: false }) };

    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { "X-Master-Key": SECRET_KEY }
        });
        const json = await res.json();
        const whitelist = json.record.codes || [];

        const valid = whitelist.includes(code);
        return { statusCode: 200, body: JSON.stringify({ valid }) };

    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ valid: false }) };
    }
};
