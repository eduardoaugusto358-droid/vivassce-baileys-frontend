# 🎨 Vivassce Baileys Frontend

Interface web moderna para gerenciar instâncias do WhatsApp Baileys.

## ✨ Funcionalidades

- ✅ Dashboard com estatísticas em tempo real
- ✅ Criar/Deletar instâncias
- ✅ Conectar/Desconectar instâncias
- ✅ Visualizar QR Code
- ✅ Configurar proxies (SOCKS5, HTTP, etc)
- ✅ Copiar API Keys
- ✅ Tema escuro/claro
- ✅ Design responsivo (mobile/desktop)
- ✅ Notificações toast
- ✅ Auto-refresh de dados

## 🚀 Tecnologias

- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool super rápido
- **Tailwind CSS** - Estilização moderna
- **SWR** - Fetching e cache de dados
- **Lucide Icons** - Ícones bonitos
- **React Router** - Navegação
- **Sonner** - Notificações toast

## 📦 Instalação

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Criar .env
cp .env.example .env

# Editar .env e configurar URL do backend
nano .env

# Iniciar dev server
npm run dev
```

Acessar: http://localhost:3000

### Build de Produção

```bash
# Build
npm run build

# Preview do build
npm run preview
```

## 🐳 Docker

### Build da imagem

```bash
docker build -t vivassce-baileys-frontend \
  --build-arg VITE_API_URL=https://api.stackleys.iconverseagora.com \
  .
```

### Rodar container

```bash
docker run -p 80:80 vivassce-baileys-frontend
```

### Docker Compose

```bash
docker-compose up -d
```

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL do backend API | `http://localhost:3002` |
| `PORT` | Porta do dev server | `3000` |

> ⚠️ **Importante:** `VITE_API_URL` é usada em **build time**. Se mudar, precisa rebuild.

## 📱 Portainer

Ver documentação completa em: [README.PORTAINER.md](./README.PORTAINER.md)

### Deploy rápido:

1. **Portainer** → **Stacks** → **Add Stack**
2. Repository: `https://github.com/SEU-USUARIO/vivassce-baileys-frontend`
3. Compose path: `docker-compose.yml`
4. Variáveis:
   ```env
   PORT=80
   VITE_API_URL=https://api.stackleys.iconverseagora.com
   ```
5. **Deploy**

## 🎨 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Criar Instância
![Create](./screenshots/create.png)

### QR Code
![QR Code](./screenshots/qr.png)

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── InstanceCard.tsx
│   ├── CreateInstanceModal.tsx
│   └── StatsCard.tsx
├── pages/               # Páginas
│   └── Dashboard.tsx
├── hooks/               # Hooks personalizados
│   └── useInstances.ts
├── lib/                 # Utilitários
│   └── utils.ts
├── types/               # Tipos TypeScript
│   └── index.ts
├── config/              # Configurações
│   └── api.ts
├── App.tsx             # App principal
├── main.tsx            # Entry point
└── index.css           # Estilos globais
```

## 🔗 Endpoints da API

O frontend consome os seguintes endpoints do backend:

- `GET /api/status` - Status da API
- `GET /api/instance/list` - Listar instâncias
- `POST /api/instance/create` - Criar instância
- `POST /api/instance/:id/connect` - Conectar
- `POST /api/instance/:id/disconnect` - Desconectar
- `GET /api/instance/:id/qr` - QR Code
- `GET /api/instance/:id/status` - Status
- `GET /api/instance/:id/groups` - Grupos
- `DELETE /api/instance/:id` - Deletar

## 🎨 Personalização

### Cores (Tailwind)

Editar `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: { /* suas cores */ },
      success: { /* suas cores */ },
      danger: { /* suas cores */ },
    }
  }
}
```

### Logo

Substituir `/public/logo.svg` com seu logo.

## 🐛 Troubleshooting

### "Cannot connect to backend"

- Verificar se `VITE_API_URL` está correto no `.env`
- Verificar se backend está rodando
- Verificar CORS no backend

### Build falha

```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

### Docker build lento

```bash
# Usar cache do buildx
docker buildx build --cache-from=type=local,src=/tmp/.buildx-cache .
```

## 📄 Licença

MIT License - Vivassce 2025

## 🔗 Links

- Backend: https://github.com/SEU-USUARIO/vivassce-baileys-backend
- Documentação Baileys: https://whiskeysockets.github.io/Baileys/
- Portainer: https://docs.portainer.io/
