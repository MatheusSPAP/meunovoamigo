# Visão Geral da Aplicação: Meu Novo Amigo

## Resumo Geral

A aplicação "Meu Novo Amigo" é uma plataforma completa para **adoção de animais**. Ela é construída com uma arquitetura cliente-servidor, composta por:

1.  **Backend (API):** Um serviço em Node.js com Express.js, responsável por toda a lógica de negócio, gerenciamento de dados e comunicação com um banco de dados MySQL.
2.  **Frontend:** Uma interface de usuário (HTML, CSS, JavaScript) que consome os dados do Backend para exibi-los aos usuários e permitir a interação com a plataforma.
3.  **Banco de Dados:** Um banco de dados MySQL que armazena todas as informações da aplicação, incluindo usuários, animais, postagens e interações.

---

## Principais Funcionalidades

A plataforma funciona como uma rede social focada em conectar animais para adoção com pessoas interessadas.

### 1. Gestão de Usuários
- **Cadastro e Login:** Usuários podem se cadastrar na plataforma com informações como nome, contato, endereço, etc., e fazer login para acessar as funcionalidades.

### 2. Cadastro e Gestão de Animais
- **Perfis Detalhados:** Usuários (ONGs ou protetores) podem cadastrar animais para adoção com informações completas:
    - **Informações básicas:** Nome, sexo, foto, descrição.
    - **Saúde:** Status de castração e vacinação.
    - **Características:** Tipo (cão/gato), raça, tamanho e comportamento (calmo, brincalhão, etc.).
- **Status de Adoção:** Cada animal tem um status, indicando se está "Disponível" ou se já foi "Adotado".

### 3. Processo de Adoção
- **Solicitação Formal:** Um usuário interessado em um animal pode registrar um **"Interesse de Adoção"**.
- **Fluxo de Aprovação:** A solicitação é enviada ao responsável pelo animal, que pode "Aprovar" ou "Recusar" o pedido, organizando o processo de adoção.

### 4. Comunidade e Interação Social
- **Feed de Postagens:** A plataforma possui um sistema de postagens (similar a um feed de notícias) onde os usuários podem criar publicações sobre os animais.
- **Comentários:** Outros usuários podem escrever comentários nessas postagens.
- **Mídia:** É possível anexar mídias (fotos/vídeos) às publicações.

### 5. Eventos
- **Divulgação:** Usuários podem criar e divulgar eventos, como feiras de adoção, campanhas de vacinação ou eventos de arrecadação.

---

## Fluxo de Uso Principal

1.  **Cadastro do Protetor:** Um protetor de animais (ou ONG) se cadastra e faz o login na plataforma.
2.  **Cadastro do Animal:** Ele cria o perfil de um animal que precisa de um lar, com fotos e todas as informações relevantes.
3.  **Busca pelo Adotante:** Outros usuários navegam pela plataforma, veem os animais disponíveis e podem usar filtros para encontrar um animal de seu interesse.
4.  **Solicitação de Adoção:** Ao encontrar um animal, o usuário interessado envia uma solicitação de "Interesse de Adoção".
5.  **Análise e Contato:** O protetor analisa as solicitações recebidas e gerencia o processo de adoção diretamente pela plataforma.
6.  **Interação:** Paralelamente, os usuários podem interagir na comunidade, compartilhando histórias, dicas e participando de eventos.
