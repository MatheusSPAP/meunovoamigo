# API REST - Sistema de Adoção de Animais

Esta é uma REST API completa desenvolvida em Node.js com HTTP nativo e MySQL para um sistema de adoção de animais.

## 🚀 Características

- **Node.js com HTTP nativo** - Sem dependência do Express (facilita migração futura)
- **MySQL** - Banco de dados relacional robusto
- **CORS habilitado** - Permite integração com frontends
- **Arquitetura modular** - Fácil manutenção e escalabilidade
- **Validações completas** - Segurança e integridade dos dados

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL Server
- npm ou yarn

## 🔧 Instalação

1. **Clone ou extraia o projeto**
```bash
cd adote-animais-api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
   - Crie um banco MySQL chamado `ModelagemAnimaisAdocao`
   - Configure as credenciais no arquivo `.env` (copie de `.env.example`)

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=ModelagemAnimaisAdocao
PORT=3000
```

5. **Inicie o servidor**
```bash
npm start
```

A API estará disponível em `http://localhost:3000`

## 📊 Estrutura do Banco de Dados

O sistema possui as seguintes tabelas:

- **usuario** - Dados dos usuários do sistema
- **status** - Status dos animais (disponível, adotado, etc.)
- **animal** - Informações dos animais
- **evento** - Eventos relacionados à adoção
- **postagem** - Posts da comunidade
- **comentario** - Comentários nas postagens
- **midia** - Arquivos de mídia das postagens

## 🛠️ Endpoints da API

### Usuários
- `GET /api/usuarios` - Listar todos os usuários
- `GET /api/usuarios/:id` - Buscar usuário por ID
- `POST /api/usuarios` - Criar novo usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário

### Animais
- `GET /api/animais` - Listar todos os animais
- `GET /api/animais/:id` - Buscar animal por ID
- `POST /api/animais` - Cadastrar novo animal
- `PUT /api/animais/:id` - Atualizar animal
- `DELETE /api/animais/:id` - Deletar animal

### Status
- `GET /api/status` - Listar todos os status
- `GET /api/status/:id` - Buscar status por ID
- `POST /api/status` - Criar novo status
- `PUT /api/status/:id` - Atualizar status
- `DELETE /api/status/:id` - Deletar status

### Eventos
- `GET /api/eventos` - Listar todos os eventos
- `GET /api/eventos/:id` - Buscar evento por ID
- `POST /api/eventos` - Criar novo evento
- `PUT /api/eventos/:id` - Atualizar evento
- `DELETE /api/eventos/:id` - Deletar evento

### Postagens
- `GET /api/postagens` - Listar todas as postagens
- `GET /api/postagens/:id` - Buscar postagem por ID
- `POST /api/postagens` - Criar nova postagem
- `PUT /api/postagens/:id` - Atualizar postagem
- `DELETE /api/postagens/:id` - Deletar postagem

### Comentários
- `GET /api/comentarios?postagem_id=:id` - Buscar comentários por postagem
- `POST /api/comentarios` - Criar novo comentário
- `PUT /api/comentarios/:id` - Atualizar comentário
- `DELETE /api/comentarios/:id` - Deletar comentário

### Utilitários
- `GET /api/health` - Status da API

## 📝 Exemplos de Uso

### Criar um usuário
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456",
    "cidade": "São Paulo",
    "endereco": "Rua das Flores, 123"
  }'
```

### Cadastrar um animal
```bash
curl -X POST http://localhost:3000/api/animais \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Rex",
    "raca": "Labrador",
    "foto": "rex.jpg",
    "descricao": "Cão dócil e brincalhão",
    "fk_idusuario": 1,
    "fk_idstatus": 1
  }'
```

### Listar animais
```bash
curl http://localhost:3000/api/animais
```

## 🔄 Migração para Express

Para migrar para Express no futuro:

1. Instale o Express: `npm install express`
2. Substitua o arquivo `server.js` por uma implementação Express
3. Os controllers permanecem inalterados
4. Crie arquivos de rotas no padrão Express

## 🔄 Integração com Frontend

### Angular
```typescript
// service.ts
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AnimalService {
  private apiUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient) {}
  
  getAnimais() {
    return this.http.get(`${this.apiUrl}/animais`);
  }
}
```

### JavaScript Vanilla
```javascript
// Buscar animais
fetch('http://localhost:3000/api/animais')
  .then(response => response.json())
  .then(data => console.log(data));

// Criar usuário
fetch('http://localhost:3000/api/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nome: 'Maria',
    email: 'maria@email.com',
    senha: '123456',
    cidade: 'Rio de Janeiro',
    endereco: 'Av. Copacabana, 456'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🛡️ Segurança

⚠️ **Importante**: Esta é uma versão de desenvolvimento. Para produção, implemente:

- Hash das senhas (bcrypt)
- Autenticação JWT
- Validação de entrada mais rigorosa
- Rate limiting
- HTTPS
- Sanitização de dados

## 📁 Estrutura do Projeto

```
adote-animais-api/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do MySQL
│   └── controllers/
│       ├── usuarioController.js
│       ├── animalController.js
│       ├── statusController.js
│       ├── eventoController.js
│       ├── postagemController.js
│       └── comentarioController.js
├── public/                      # Arquivos estáticos (HTML/CSS/JS)
├── server.js                    # Servidor HTTP principal
├── package.json
├── .env.example
└── README.md
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, abra uma issue no repositório do projeto.

---

**Desenvolvido por Manus AI** 🤖

