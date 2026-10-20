import asyncio
import json
import websockets
from confluent_kafka import Producer

URL = "wss://jetstream.us-east.bsky.network/xrpc/network.bsky.jetstream.subscribeEvents"
ID_EVENTS_URL = URL + "?kinds=identity"
TOPIC = "jetstream-id-events"

producer = Producer({"bootstrap.servers": "localhost:9092"})

async def main(): 
    async with websockets.connect(ID_EVENTS_URL) as ws:
        async for message in ws:
            producer.produce(TOPIC, value=message)
            print(message)
            producer.poll(0)

asyncio.run(main())