# MongoDB in docker 🐳 - Resiliency for two data center 

We're building replica sets with docker and testing the resiliency and high availability of the application.

Replica sets need to authenticate between nodes to create a key file 
```shell
openssl rand -base64 756 > <path-to-keyfile>
chmod 400 <path-to-keyfile>
```

Please choose which only one architecture either 3 nodes or 5 nodes

#### Basic 3 nodes resiliency for two data center
Below the basic resiliency for two data center two node sin DC1 (Data center) and DC2 (Disaster recovery)
<img src="/assets/3nodes.jpg" alt="3nodes" width="50%" height="50%">

##### Initiate replica set connect to one of replica sets 
```javascript
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
```
##### Connection string 
```javascript
mongodb://root:example@mongoserver1:27017,mongoserver2:27017,mongoserver3:27018/?replicaSet=mongo-replica
```

##### In case of DC1(Data center is down for longer period) please run this
<img src="/assets/3nodesfailover.jpg" alt="3nodesfailover" width="60%" height="60%">

```javascript
//At DC2 Secondary (node 2):
cfg = rs.conf();
cfg.members[0].priority = 0;
cfg.members[0].votes = 0;
cfg.members[1].priority = 0;
cfg.members[1].votes = 0;
rs.reconfig( cfg, { force: true } );
```

#### 5 nodes 
Below the basic resiliency for three nodes at data center DC1 (Data center) and two nodes at DC2 (Disaster recovery)
<img src="/assets/5nodes.jpg" alt="5nodes" width="50%" height="50%">

Initiate replica set connect to one of replica sets 
```javascript
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
```
Connection string 
```javascript
mongodb://root:example@mongoserver1:27017,mongoserver2:27017,mongoserver3:27018,mongoserver4:27019,mongoserver5:27020,mongoserver6:27021/?replicaSet=mongo-replica
```

##### In case of DC1(Data center is down for longer period) please run this
<img src="/assets/5nodesfailover.jpg" alt="5nodesfailover" width="60%" height="60%">

Add one arbiter on DR 
```javascript
rs.addArb("mongoserver6:27017")
```
Set priorty and votes to 0 for all nodes in DC1
```javascript
//At DC2 Secondary (node 2):
cfg = rs.conf();
cfg.members[0].priority = 0;
cfg.members[0].votes = 0;
cfg.members[1].priority = 0;
cfg.members[1].votes = 0;
cfg.members[2].priority = 0;
cfg.members[2].votes = 0;
rs.reconfig( cfg, { force: true } );
```