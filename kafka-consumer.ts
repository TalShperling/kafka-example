import {Kafka, logLevel} from 'kafkajs'

let map: Map<number, string> = new Map();
let i = 0;

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`localhost:9092`],
  clientId: 'example-consumer',
})

const topic = 'users'
const consumer = kafka.consumer({ groupId: 'test-group' })

const writeToMap = (data: Buffer) => {
    data && map.set(i, data.toString());
    i++;
    console.log(`Entry added`);
}

export const run = async () => {
    console.log("Starting consumer!");
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`${i} - ${prefix} ${message.key}#${message.value}`)
      i++;
    //   message.value && writeToMap(message.value)
    },
  })
}

(async () => {
    await run().catch(e => console.error(`[example/consumer] ${e.message}`, e));
})();


const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
});