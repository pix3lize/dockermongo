#!/bin/bash

# Wait for MongoDB servers to be ready
sleep 30

# Initialize the replica set and change priorities
mongosh --host mongoserver1:27017 -u root -p example --authenticationDatabase admin <<EOF
rs.initiate(
    {
        _id: "mongo-replica",
        members: [
            {
                _id: 0,
                host: "mongoserver1:27017"
            },
            {
                _id: 1,
                host: "mongoserver2:27017"
            },
            {
                _id: 2,
                host: "mongoserver3:27017"
            }
        ]
    }
)

// Wait for the replica set to initialize
sleep(10000)


// Change the priority of the nodes
cfg = rs.conf()
cfg.members[0].priority = 8
cfg.members[1].priority = 7
cfg.members[2].priority = 6
rs.reconfig(cfg, { force: true })

// Print the final configuration
printjson(rs.conf())
EOF

echo "Replica set initialization and priority configuration complete"