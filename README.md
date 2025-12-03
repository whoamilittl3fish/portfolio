# Portfolio

This is my source portfolio.

#### Some information
It runs via vite and expose port 8080 on local machine.

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
