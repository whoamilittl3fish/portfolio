# Portfolio

This is my source portfolio.
(Viet Khoa, also name as zoskisk).

#### Some information
This portfolio runs on Nginx (port 80 inside the container) and exposes port 8080 to your local machine.

## How to running this

#### Make sure Docker is running first.

#### Docker running command

Hot reload:

```bash
`docker compose -f docker-compose.dev.yml up builder` -> hot reload by 100ms (vite.config.js)
```

Production:

```bash
docker compose -f docker-compose.prod.yml up -d
```

#### Check my website at: 

http://localhost:8080

#### It lives on Vercel:
https://zoskisk.vercel.app

#### Stop

```bash
docker compose down
```