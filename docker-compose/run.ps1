
#cleanup
docker rm $(docker ps -qa --no-trunc --filter "status=exited")
docker volume rm $(docker volume ls -qf dangling=true)

docker compose -f .\docker-compose.yml up --force-recreate