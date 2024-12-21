import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://jackpot:jackpot@samplecluster.clrkivs.mongodb.net/jackpot?retryWrites=true&w=majority&appName=sampleCluster";
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;