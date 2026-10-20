from confluent_kafka import Consumer
import requests 
from urllib.parse import urlparse
import json

def resolve_did(did):
    did_url = "https://plc.directory/" + did
    try:
        response = requests.get(did_url, timeout=5)
    except requests.RequestException:
        return None

    if response.status_code != 200:
        return None

    doc = response.json()
    return doc

def extract_handle(doc): 
    handles_list = doc['alsoKnownAs']
    for handle in handles_list: 
        if handle.startswith("at://"): 
            return handle.removeprefix("at://")
    return None

def extract_pds(doc): 
    pds_endpoint = doc["service"][0]["serviceEndpoint"]
    if pds_endpoint is not None: 
        return urlparse(pds_endpoint).hostname
    return None


consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "enricher",
    "auto.offset.reset": "earliest",
})
consumer.subscribe(["jetstream-id-events"])

try:
    while True:
        msg = consumer.poll(1.0)
        if msg is None: 
            continue
        if msg.error(): 
            print("Kafka error:", msg.error())
            continue

        event = json.loads(msg.value().decode("utf-8"))
        did = event["payload"]["did"]

        doc = resolve_did(did)
        handle = extract_handle(doc)
        pds = extract_pds(doc)

        print(f"""
        Event at timestamp : {event["payload"]["time"]}, 
        DID: {did}
        handle: {handle} 
        PDS: {pds}""")
        print("------------------------------------------------")
finally:
    consumer.close()
