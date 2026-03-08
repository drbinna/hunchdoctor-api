export const config = {
    runtime: "edge",
};

export default async function handler(req: Request) {
    const apiKey = process.env.HUME_API_KEY;
    const secretKey = process.env.HUME_SECRET_KEY;

    if (!apiKey || !secretKey) {
        return new Response(JSON.stringify({ error: "Missing env vars" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    const credentials = btoa(`${apiKey}:${secretKey}`);

    const res = await fetch("https://api.hume.ai/oauth2-cc/token", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });
}