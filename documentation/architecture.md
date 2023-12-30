# Services
## Auth-service
Service is responsive for authentication and authorization of users
Based on Nest.js
Use MongoDB to store data
## Config-service
Service is responsive for storing all the configuration data for different environments
Use MongoDB to store data
## Core-service
Main service. Service is responsive for communicating with the database, handling requests from the Gateway-service and other services
Based on Nest.js
Use MongoDB to store data
## Frontend-admin-service
Responsible for serving admin client pages
Based on Next.js
Stack:
Next.js  + React - Frontend framework
Material UI - UI Framework
Effector - State manager
## Frontend-service
Responsible for serving client pages
Based on Next.js
Stack:
Next.js  + React - Frontend framework
Material UI - UI Framework
Effector - State manager
## Gateway-service
Service is responsive for receiving and proxy requests to services
Based on Nest.js
## Instance-proxy
Service is responsible for proxying requests to Scaleable services
## Livekit-service
SFU media server
## Media-server-service
Service is responsible for creating tokens to connect to the media server
Use Livekit api
## Meeting-socket-service
Service responsible for socket events inside meeting (start meeting, join meeting, end meeting, leave meeting, etc…)
Based on Nest.js
Use MongoDB to store data
## Notification-service
Service responsible for sms and email notifications.
Use Mailchimp api to send emails
## Payment-service
Service responsible for payment logic in meetings and in dashboard.
Based on Nest.js
Use Stripe api
## Scaling-service
Service responsible for scaling
Based on Nest.js
Service create and destroy servers on Vultr
## Socket-service
Service responsible for managing logic mainly in meeting
Based on Nest.js
Socket connection is used on dashboard and meeting
## Turn-server
Service responsible for turn. Turn server based on Coturn
## Traefik
Service responsible for Http proxy.
## MongoDB
Main database. Service responsible for storing data
## RabbitMQ
Message broker. Service responsible for backend services communication
## Communication between services
Backend services communicate with each other using RabbitMQ
Frontend services communicate with backend services using REST Api and WebSockets (socket.io)


## Remote deploy
- Install Docker
- Install Gitlab runner
- Add new gitlab runner to gitlab
- Add new stage with gitlab runner tag (use pipelines/production.yml for reference)
- Add new docker compose config  (use deploy/production for reference)
- Setup env variables in Gitlab CI/CD Variables
- Trigger pipeline to deploy new environment


## Architecture scheme
- [Ruume.jpg](./assets/images/Ruume.jpg)