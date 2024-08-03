// Initiate the replica set with 5 nodes
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
            ,
            {
                _id: 3,
                host: "mongoserver4:27017"
            }
            ,
            {
                _id: 4,
                host: "mongoserver5:27017"
            }
        ]
    }
)

// Initiate the replica set with 3 nodes
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

// Hide the last nodes
cfg = rs.conf();
cfg.members[5].priority = 0;
cfg.members[5].votes = 0;
cfg.members[5].hidden = true;   
rs.reconfig( cfg, { force: true } );


// Remove one nodes from DC and add the hidden pc to alive
cfg = rs.conf();
cfg.members[2].priority = 0;
cfg.members[2].votes = 0;
cfg.members[5].priority = 1;
cfg.members[5].votes = 1;
cfg.members[5].hidden = false;   
rs.reconfig( cfg, { force: true } );

// This is arbiter node
cfg = rs.conf();
cfg.members[5].priority = 0;
cfg.members[5].votes = 1;
cfg.members[5].hidden = true;   
rs.reconfig( cfg, { force: true } );

// Change the priority of the nodes
cfg = rs.conf();
cfg.members[0].priority = 8;
cfg.members[1].priority = 7;
cfg.members[2].priority = 6;
cfg.members[3].priority = 5;
cfg.members[4].priority = 5;
rs.reconfig( cfg, { force: true } );

// Check the status of the replica set
var status = rs.status();
status.members.forEach(function(member) {
    print("Name: " + member.name);
    print("State: " + member.stateStr);
    print("---");
});
