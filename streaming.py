import asyncio
import json
import websockets

URL = "wss://jetstream.us-east.bsky.network/xrpc/network.bsky.jetstream.subscribeEvents"
ID_EVENTS_URL = URL + "?kinds=identity"

async def main(): 
    async with websockets.connect(ID_EVENTS_URL) as ws:
        async for message in ws:
            evt = json.loads(message)
            print(evt)
            
asyncio.run(main())