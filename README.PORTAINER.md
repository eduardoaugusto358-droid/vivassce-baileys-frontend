# 🐳 Frontend - Docker + Portainer

Guia completo de instalação do **Frontend Baileys** via Portainer.

---

## 📋 PRÉ-REQUISITOS

1. ✅ Backend Baileys rodando
2. ✅ Domínio configurado (opcional)
3. ✅ Docker + Portainer instalados

---

## 🚀 INSTALAÇÃO VIA PORTAINER

### **1. Acessar Portainer**
```
https://seu-servidor:9443
```

### **2. Criar Stack**

**Stacks** → **Add Stack**

**Nome:** `vivassce-baileys-frontend`

**Build method:** Repository

**Repository URL:** `https://github.com/SEU-USUARIO/vivassce-baileys-frontend`

**Reference:** `refs/heads/main`

**Compose path:** `docker-compose.yml`

### **3. Configurar Variáveis**

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `PORT` | `80` | Porta do Nginx |
| `VITE_API_URL` | `https://api.stackleys.iconverseagora.com` | URL do backend |

### **4. Deploy**

Clicar em **"Deploy the stack"**

---

## 🌐 CONFIGURAR DOMÍNIO

### **Nginx Reverse Proxy:**

```nginx
# /etc/nginx/sites-available/baileys-frontend

server {
    listen 80;
    server_name baileys.iconverseagora.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar:
```bash
sudo ln -s /etc/nginx/sites-available/baileys-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **SSL (Certbot):**

```bash
sudo certbot --nginx -d baileys.iconverseagora.com
```

---

## ✅ VERIFICAR INSTALAÇÃO

### **1. Ver logs:**
Portainer → Containers → `vivassce-baileys-frontend` → Logs

### **2. Testar:**
```
http://seu-servidor
# ou
https://baileys.iconverseagora.com
```

---

## 🔄 ATUALIZAR

### **Método 1: Pull and Redeploy**
Portainer → Stacks → `vivassce-baileys-frontend` → **Pull and redeploy**

### **Método 2: Watchtower (automático)**
```yaml
watchtower:
  image: containrrr/watchtower
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  environment:
    - WATCHTOWER_CLEANUP=true
    - WATCHTOWER_POLL_INTERVAL=3600
```

---

## ⚠️ IMPORTANTE

### **Rebuild necessário se mudar VITE_API_URL:**

A variável `VITE_API_URL` é usada em **build time**.

Se mudar o backend, precisa:
1. Atualizar variável no Portainer
2. **Pull and redeploy** (força rebuild)

---

## 🐛 TROUBLESHOOTING

### **"Cannot connect to backend"**
- Verificar se `VITE_API_URL` está correto
- Verificar se backend está rodando
- Testar: `curl https://api.stackleys.iconverseagora.com/api/status`

### **Container não inicia**
```bash
docker logs vivassce-baileys-frontend
```

### **Nginx error**
```bash
# Dentro do container
docker exec -it vivassce-baileys-frontend nginx -t
```

---

## 📦 STACK COMPLETO (BACKEND + FRONTEND)

Você pode rodar ambos no mesmo stack:

```yaml
version: '3.8'

services:
  backend:
    image: ghcr.io/seu-usuario/vivassce-baileys-backend:latest
    ports:
      - "3002:3002"
    environment:
      - PORT=3002
    networks:
      - baileys

  frontend:
    image: ghcr.io/seu-usuario/vivassce-baileys-frontend:latest
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:3002
    depends_on:
      - backend
    networks:
      - baileys

networks:
  baileys:
    driver: bridge
```

---

## 🔗 LINKS

- Backend: `/README.PORTAINER.md` no repo do backend
- Documentação: `README.md`

---

## 📄 LICENÇA

MIT License - Vivassce 2025
