# MongoDB in docker 🐳 - Resiliency for two data center 
---
#### Background
We're building replica sets with docker and to test the resiliency and high availability of the application.

<img src="/assets/havideo.gif" alt="resilience" >

This repository come with custom ubuntu image that contains nodejs script to do 1000 continous write to MongoDB replica sets  

Replica sets need to authenticate between nodes to create a key file but in this sample code we already provide you with sample keyfile. 

⚠️ Please create a new keyfile for your production enviroment 
```shell
openssl rand -base64 756 > <path-to-keyfile>
chmod 400 <path-to-keyfile>
```

#### 💡 Installation on Windows 
1. Use the <b>docker-compose-win.yml</b> file 
2. Please change the end of line from "CRLF" to "LF" on the VSCode for the file "init-replica.sh" 
---

#### 5️⃣ Basic 5 nodes resiliency for two data center
Below the basic resiliency for three nodes at data center DC1 (Data center) and two nodes at DC2 (Disaster recovery)

<img src="/assets/5nodes.jpg" alt="5nodes" width="50%" height="50%">

Run the docker compose "docker-compose-win.yml" for windows and "docker-compose-mac.yml" for mac/linux

The docker compose contains ubuntu container to automate the process of creating a replica sets  

You can use VSCode Docker extension to run the docker compose as shown on the picture below 

<img src="/assets/composeup.png" alt="5nodes" width="65%" >

##### Connection string 
```javascript
mongodb://root:example@mongoserver1:27017,mongoserver2:27017,mongoserver3:27018,mongoserver4:27019,mongoserver5:27020,mongoserver6:27021/?replicaSet=mongo-replica
```

If you're connecting your application make sure that you have a coonection string as follow (contains retryWrites:true and w:majority) : 

```javascript
var connection = "mongodb://root:example@mongoserver1:27017,mongoserver2:27017,mongoserver3:27017,mongoserver4:27017,mongoserver5:27017/?replicaSet=mongo-replica&retryWrites=true&w=majority";
```

##### In case of DC1(Data center is down for longer period) please run this
<img src="/assets/5nodesfailover.jpg" alt="5nodesfailover" width="90%" height="90%">

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

#### Connecting to Ubuntu 
Once all the container is running please go to ubuntu shell to test the script to write to newly created replica sets 

<img src="/assets/ubuntuattach.png" alt="ubuntu" width="60%" height="60%">

This ubuntu image already installed with nodejs script to simulate the high availibility 
```shell
cd /home/mdb/development
node writeall.js
```

#### Reference
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
Add one arbiter on DR 
```javascript
rs.addArb("mongoserver6:27017")
```
