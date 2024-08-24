import {
    MongoClient
} from 'mongodb';
import { faker } from "@faker-js/faker";

var connection = "mongodb://root:example@mongoserver1:27017,mongoserver2:27017,mongoserver3:27017,mongoserver4:27017,mongoserver5:27017/?replicaSet=mongo-replica&retryWrites=true&w=majority";
//var connection = "mongodb://root:example@localhost:27017,localhost:27018,localhost:27019,localhost:27020,localhost:27021/?replicaSet=mongo-replica&retryWrites=true&w=majority";
const dbName = 'asik'; // Replace with your database name
const collectionName = 'people'; // Replace with your collection name

async function generateAndStoreData() {
    try {
        const client = new MongoClient(connection);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const data = [];
        for (let i = 0; i < 1000; i++) {
            // Generate a new document
            const data = {
                name: faker.person.fullName(),
                toddler_id: faker.number.int({ min: 10000, max: 99999 }),
            };

            // Insert the document and wait for 1 second before the next iteration
            await collection.insertOne(data);

            console.log('Data inserted successfully : ' + i);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log('Data inserted successfully');
        await client.close();

    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

generateAndStoreData();