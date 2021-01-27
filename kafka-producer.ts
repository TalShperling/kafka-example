import {CompressionTypes, Kafka, Producer} from 'kafkajs'

// const data = {"callsign":"Check","data":{"a":"a","b":"b","c":{"c":"c","d":"d"}},"bla":{"a":"a","b":"b","c":{"c":"c","d":"d"}},"bla1":{"a":"a","b":"b","c":{"c":"c","d":"d"}},"bla2":{"a":"a","b":"b","c":{"c":"c","d":"d"}},"bla3":{"a":"a","b":"b","c":{"c":"c","d":"d"}},"bla4":{"a":"a","b":"b","c":{"c":"c","d":"d"}}};
const data = "Hey"; 

export const initProducer = async (kafka: Kafka) => {
const producer = kafka.producer()

await producer.connect()
return producer;
};

export const sendMessage =  (producer: Producer) => {
    producer.send({
        topic: 'users',
        compression: CompressionTypes.GZIP,
        messages: [
          { value: `My data: ${JSON.stringify(data)}`},
        ],
      });
};

export const disconnectProducer = (producer: Producer) => {
    producer.disconnect();
}

export const init = async () => {
    console.log("Starting producer!");
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['192.168.1.51:9092']
      })
    const producer =await initProducer(kafka);
    setInterval(()=> {
      sendMessage(producer);
    }, 10 );
    return null;
}

(async() => {
  await init();
})();