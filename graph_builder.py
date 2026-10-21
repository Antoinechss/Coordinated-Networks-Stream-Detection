from confluent_kafka import Consumer, Producer 
from collections import defaultdict
import json

dids_to_handles = defaultdict(dict)
handles_to_dids = defaultdict(dict)
current_handle = {}

def upsert_edge(index, a, b, t): 
    '''Helper function to insert new dids and handles into dictionnary'''
    if b in index[a]: 
        index[a][b]['last_seen'] = t 
    else: 
        index[a][b] = {"first_seen": t, "last_seen": t}


def update_graph(did, handle, t): 
    '''
    Updates did_to_handles, handle_to_dids and current_handle dictionnaries 
    with the latest values and timestamp of event
    '''
    upsert_edge(dids_to_handles, did, handle, t)
    upsert_edge(handles_to_dids, handle, did, t)

    current_handle[did] = handle 



# --- Stream processing --- 

consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "graph-builder",
    "auto.offset.reset": "earliest",
})

consumer.subscribe(["jetstream-id-enriched"])



try:
    while True:
        msg = consumer.poll(1.0) # Consume topic 

        # Error handling 
        if msg is None: 
            continue
        if msg.error(): 
            print("Kafka error:", msg.error())
            continue

        # Update graph with new handle - did pair
        event = json.loads(msg.value().decode("utf-8"))
        did = event["did"]
        handle = event["handle"]
        t = event["event_time"]
        update_graph(did, handle, t)


finally:
    consumer.close()
