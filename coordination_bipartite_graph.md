

#### Items of the bipartite graph 

* Node kind 1 = DIDs
* Node kind 2 = handles
* Edge: “this DID has held this handle”, with the times it was first and last seen


   DIDs                 handles
 did:plc:aaa ─────── alice.bsky.social
 did:plc:bbb ─────── bob.bsky.social
            ╲
             ╲────── bob-new.bsky.social      ← bbb changed its handle
 did:plc:ccc ─────── bob.bsky.social          ← ccc took bbb's old handle!