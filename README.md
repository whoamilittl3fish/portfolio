# Portfolio

This is my source portfolio.
(Viet Khoa, also name as zoskisk).

#### Some information
This portfolio runs on Nginx (port 80 inside the container) and exposes port 8080 to your local machine.

## How to running this

#### Make sure Docker is running first.

#### Download the repository:

```bash
git clone https://git.dev.solved.cz/zoskisk/khoa-portfolio
cd khoa-portfolio
```

#### Docker running command

```bash
docker compose -f docker-compose.prod.yml up -d
```

#### Check my website at: 

http://localhost:8080
https://zoskisk.vercel.app

#### Stop

```bash
docker stop khoa-portfolio-container
docker rm khoa-portfolio-container
docker rmi khoa-portfolio:v0.0.1
```