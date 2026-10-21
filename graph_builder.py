from confluent_kafka import Consumer, Producer 
import json
import networkx as nx 

current_handle = {}

def update_graph(G, did, handle, t): 

    new_shared = False

    G.add_node(did, kind="did")
    G.add_node(handle, kind='handle')

    # Handle change detection
    old_handle = current_handle.get(did)
    if (old_handle is not None) and (old_handle != handle): 
        print(f"HANDLE CHANGE: {old_handle} --> {handle}")

    if G.has_edge(did,handle): 
        G.edges[did, handle]['last_seen'] = t 
    else: 
        G.add_edge(did, handle, first_seen=t, last_seen=t)
        # Shared handle detection
        if G.degree(handle) >= 2: 
            print(f"SHARED HANDLE: {handle}: {list(G.neighbors(handle))}")
        if G.degree(handle) == 2: 
            new_shared = True
    current_handle[did] = handle
    return new_shared

# --- Stream processing --- 

consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "graph-builder-v2",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False, 
})

consumer.subscribe(["jetstream-id-enriched"])


G = nx.Graph()
shared_handles_count = 0
i = 0 

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
        
        if handle is None: 
            continue
        if update_graph(G, did, handle, t): 
            shared_handles_count += 1
        i += 1
        if i % 100 == 0: 
            print(f"""
            Nodes: {G.number_of_nodes()}
            Edges: {G.number_of_edges()}
            Shared handles: {shared_handles_count}""")

finally:
    consumer.close()
