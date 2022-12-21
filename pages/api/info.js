export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            res.status(200).json(await getItems(req.headers));
            break;
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}

export async function getItems(req) {
    return { req };
}


