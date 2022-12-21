const CosmosClient = require("@azure/cosmos").CosmosClient;

const endpoint = process.env.APPSETTING_endpoint;
const key = process.env.APPSETTING_key;
const database = process.env.APPSETTING_database;
const container = process.env.APPSETTING_container;

const client = new CosmosClient({ endpoint, key });

const databaseID = client.database(database);
const containerID = databaseID.container(container);

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            res.status(200).json(await getItems());
            break;
        case "DELETE":
            var id = req.query.id;
            res.status(200).json(await deleteItem(id));
            break;
        case "PUT":
            var entry = req.body;
            res.status(200).json(await createItem(entry));
            break;
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}

export async function deleteItem(id) {
    await containerID.item(id, id).delete(); //key, partitionkey
}

export async function createItem(entry) {
    await containerID.items.create(entry);
}

export async function getItems() {
    if (endpoint) {
        console.log('Querying container:' + containerID.id);
        const querySpec = {
            query: "SELECT * FROM c order by c.key",
        };

        const { resources: items } = await containerID.items
            .query(querySpec)
            .fetchAll();
        return { CosmoData: items };
    }
}

