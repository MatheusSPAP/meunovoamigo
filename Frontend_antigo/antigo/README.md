# Telas de Autenticação - AdoteAnimais

Este projeto contém as telas de registro e login para o sistema AdoteAnimais, desenvolvidas com HTML, CSS e JavaScript seguindo o design fornecido.

## Arquivos Incluídos

- `registro.html` - Tela de cadastro de usuário
- `login.html` - Tela de login
- `styles.css` - Estilos CSS responsivos
- `script.js` - Funcionalidades JavaScript
- `README.md` - Esta documentação

## Funcionalidades Implementadas

### Tela de Registro (`registro.html`)
- Formulário com campos: nome, email, cidade, endereço, senha e confirmação de senha
- Validação em tempo real dos campos
- Checkbox para aceitar termos de uso
- Botão para alternar visibilidade da senha
- Link para navegar para a tela de login

### Tela de Login (`login.html`)
- Formulário com campos: email e senha
- Validação em tempo real
- Checkbox "Lembrar de mim"
- Link "Esqueceu a senha?"
- Botão para alternar visibilidade da senha
- Link para navegar para a tela de registro

### Funcionalidades JavaScript
- Validação de email e senha em tempo real
- Alternância de visibilidade da senha
- Navegação entre telas
- Animações e efeitos visuais
- Simulação de envio para API
- Mensagens de sucesso e erro
- Design responsivo

## Validações Implementadas

- **Nome**: Mínimo 2 caracteres
- **Email**: Formato válido de email
- **Cidade**: Mínimo 2 caracteres
- **Endereço**: Mínimo 5 caracteres
- **Senha**: Mínimo 6 caracteres
- **Confirmação de senha**: Deve coincidir com a senha
- **Termos de uso**: Deve ser aceito para registro

## Design e Estilo

O design segue fielmente a imagem fornecida, incluindo:
- Header com navegação
- Logo do AdoteAnimais com ícone de pata
- Formulários centralizados em cards
- Gradientes e cores consistentes
- Ícones nos campos de entrada
- Botões com efeitos hover
- Design responsivo para mobile

## Como Usar

1. Abra `registro.html` no navegador para acessar a tela de cadastro
2. Abra `login.html` no navegador para acessar a tela de login
3. Use os botões de navegação para alternar entre as telas
4. Preencha os formulários para testar as validações

## Integração com Backend

Para integrar com o backend, descomente e ajuste as seções de API nos arquivos JavaScript:

```javascript
// Para registro
const response = await fetch('/api/usuarios', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cidade: data.cidade,
        endereco: data.endereco
    })
});

// Para login
const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: data.email,
        senha: data.senha
    })
});
```

## Responsividade

As telas são totalmente responsivas e se adaptam a diferentes tamanhos de tela:
- Desktop: Layout completo com navegação horizontal
- Tablet: Ajustes de espaçamento e tamanhos
- Mobile: Navegação empilhada e formulários otimizados

## Tecnologias Utilizadas

- HTML5 semântico
- CSS3 com Flexbox e Grid
- JavaScript ES6+
- Google Fonts (Inter)
- Animações CSS
- Design responsivo

## Personalização

Para personalizar as cores, edite as variáveis CSS no arquivo `styles.css`:
- Gradientes principais: `#667eea` e `#764ba2`
- Cores de texto: `#333` (principal) e `#666` (secundário)
- Cores de fundo: `#f5f7fa` e `#c3cfe2`

