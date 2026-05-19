# Quiz Física II

Aplicación web interactiva de quiz de física.

## Deploy

### Heroku
```bash
heroku create
git push heroku main
```

### Render
Conecta el repositorio y usa:
- Build Command: `npm install`
- Start Command: `npm start`

### Docker
```bash
docker build -t quiz-fisica .
docker run -p 8080:8080 quiz-fisica
```

## Desarrollo local
```bash
npm install
npm start
```

Abrir http://localhost:8080