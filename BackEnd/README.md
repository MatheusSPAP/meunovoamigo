# Backend - Sistema de Adoção de Animais

Este é o backend refatorado para o sistema de adoção de animais, desenvolvido com Node.js, Express e MySQL.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados relacional
- **mysql2** - Driver MySQL para Node.js
- **CORS** - Middleware para Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

```
backend_refatorado/
├── src/
│   ├── controllers/     # Controllers da aplicação
│   ├── db/             # Configurações e operações de banco de dados
│   ├── models/         # Models/Entidades
│   └── routes/         # Definição das rotas
├── server.js           # Arquivo principal do servidor
├── package.json        # Dependências e scripts
├── .env.example        # Exemplo de variáveis de ambiente
└── README.md          # Este arquivo
```

## 🗄️ Banco de Dados

O sistema utiliza o banco de dados MySQL com as seguintes tabelas:

- **usuario** - Dados dos usuários
- **status** - Status dos animais (Disponível/Adotado)
- **tipo** - Tipos de animais (Cachorro/Gato)
- **tamanho_animal** - Tamanhos (Pequeno/Médio/Grande)
- **comportamento** - Comportamentos dos animais
- **animal** - Dados dos animais
- **postagem** - Postagens da comunidade
- **comentario** - Comentários nas postagens
- **evento** - Eventos relacionados aos animais
- **midia** - Mídias (fotos/vídeos) das postagens
- **interesse_adocao** - Interesses de adoção
- **raca** - Raças dos animais

## ⚙️ Configuração

1. **Clone o repositório e navegue até a pasta:**
   ```bash
   cd backend_refatorado
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_NAME=modelagemanimaisadocao
   PORT=3000
   ```

4. **Execute o script SQL para criar o banco de dados:**
   - Importe o arquivo `modelagemanimaisadocao.sql` no seu MySQL

5. **Inicie o servidor:**
   ```bash
   # Modo desenvolvimento (com nodemon)
   npm run dev
   
   # Modo produção
   npm start
   ```

## 📡 API Endpoints

### Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `GET /api/usuarios/:id` - Buscar usuário por ID
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário
- `POST /api/usuarios/login` - Login

### Animais
- `GET /api/animais` - Listar animais
- `POST /api/animais` - Criar animal
- `GET /api/animais/:id` - Buscar animal por ID
- `PUT /api/animais/:id` - Atualizar animal
- `DELETE /api/animais/:id` - Deletar animal
- `GET /api/animais/usuario/:idusuario` - Animais por usuário
- `GET /api/animais/status/:idstatus` - Animais por status

### Postagens
- `GET /api/postagens` - Listar postagens
- `POST /api/postagens` - Criar postagem
- `GET /api/postagens/:id` - Buscar postagem por ID
- `PUT /api/postagens/:id` - Atualizar postagem
- `DELETE /api/postagens/:id` - Deletar postagem
- `GET /api/postagens/usuario/:idusuario` - Postagens por usuário
- `GET /api/postagens/animal/:idAnimal` - Postagens por animal

### Comentários
- `GET /api/comentarios` - Listar comentários
- `POST /api/comentarios` - Criar comentário
- `GET /api/comentarios/postagem/:idcomunidade` - Comentários por postagem
- `GET /api/comentarios/usuario/:idusuario` - Comentários por usuário

### Eventos
- `GET /api/eventos` - Listar eventos
- `POST /api/eventos` - Criar evento
- `GET /api/eventos/:id` - Buscar evento por ID
- `PUT /api/eventos/:id` - Atualizar evento
- `DELETE /api/eventos/:id` - Deletar evento
- `GET /api/eventos/usuario/:idusuario` - Eventos por usuário
- `GET /api/eventos/tipo/:tipo` - Eventos por tipo
- `GET /api/eventos/periodo?dataInicio=...&dataFim=...` - Eventos por período

### Interesses de Adoção
- `GET /api/interesses-adocao` - Listar interesses
- `POST /api/interesses-adocao` - Criar interesse
- `GET /api/interesses-adocao/:id` - Buscar interesse por ID
- `PUT /api/interesses-adocao/:id` - Atualizar interesse
- `DELETE /api/interesses-adocao/:id` - Deletar interesse
- `PATCH /api/interesses-adocao/:id/status` - Atualizar status do interesse

### Outras Entidades
- `GET /api/status` - Status disponíveis
- `GET /api/tipos` - Tipos de animais
- `GET /api/tamanhos` - Tamanhos de animais
- `GET /api/comportamentos` - Comportamentos
- `GET /api/midias` - Mídias
- `GET /api/racas` - Raças

## 🔍 Health Check

- `GET /health` - Verificar status da API e conexão com banco

## 📝 Formato de Resposta

Todas as respostas seguem o padrão:

```json
{
  "success": true|false,
  "message": "Mensagem descritiva",
  "data": {...}, // Dados retornados (quando aplicável)
  "errors": [...] // Erros de validação (quando aplicável)
}
```

## 🛠️ Desenvolvimento

Para desenvolvimento, utilize:

```bash
npm run dev
```

Isso iniciará o servidor com nodemon, que reinicia automaticamente quando há mudanças no código.

## 📋 Validações

O sistema inclui validações para:
- Campos obrigatórios
- Formatos de email
- Valores permitidos para ENUMs
- Tamanhos máximos de campos
- Integridade referencial

## 🔒 Segurança

- CORS configurado para permitir requisições de qualquer origem (ajustar para produção)
- Validação de dados de entrada
- Tratamento de erros padronizado
- Logs de requisições para monitoramento

## 🚀 Deploy

Para deploy em produção:

1. Configure as variáveis de ambiente adequadas
2. Ajuste as configurações de CORS
3. Configure um proxy reverso (nginx)
4. Use um gerenciador de processos (PM2)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start server.js --name "backend-adocao"

# Monitorar
pm2 monit
```

