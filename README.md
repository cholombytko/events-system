# events-system

How to run this application:
1) Setup all envs, .env.example files are available
2) Run docker compose
```bash
docker-compose --env-file .env.example up --build
```

List of improvements I would like to make if I had more time
1) Review and change database schema
2) Make better data aggregation
3) Create more typings and contracts
4) Decouple some services
5) Implement unit and integration tests

More concrete changes I would like to make:
1) Instead of using prom Counter here: https://github.com/cholombytko/events-system/blob/bc8be7ecbfd192115b1d97876d8e723948380a7b/gateway/src/streams/validation-stream.provider.ts#L18-L21
I'll better to use prom Gauge on service level with ```eventsArray.length```. It would reduce unnecessary bd operations and operations inside stream
2) Instead of giving constant name for consumer here: https://github.com/cholombytko/events-system/blob/bc8be7ecbfd192115b1d97876d8e723948380a7b/fb-collector-service/src/services/nats-consumer.service.ts#L23
I'll better to generate one. It would make this service possible to horizontally scale.
3) Get rid of source column in db, because data is storen in separate tables for each source: https://github.com/cholombytko/events-system/blob/bc8be7ecbfd192115b1d97876d8e723948380a7b/prisma/schema.prisma#L15
4) Use node streams instead of reduce and other array operations: reporter-service/src/app.service.ts
