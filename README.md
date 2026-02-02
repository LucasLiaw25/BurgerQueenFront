# 🍟 BurgerQueen Web

![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![SASS](https://img.shields.io/badge/SASS-hotpink?style=for-the-badge&logo=sass)

O **BurgerQueen Web** é o portal do cliente da nossa hamburgueria. Uma aplicação SPA (Single Page Application) focada em performance e usabilidade, permitindo que os usuários escolham seus produtos e finalizem pedidos de forma intuitiva.

## 🚀 Funcionalidades
- **Catálogo Dinâmico:** Listagem de produtos por categorias consumindo a API BurgerQueen.
- **Carrinho de Compras:** Gerenciamento de itens e cálculo total em tempo real.
- **Checkout:** Integração com o fluxo de pagamento PIX do Back-end.
- **Área do Cliente:** Histórico de pedidos e status de entrega.

## 🛠️ Tecnologias Utilizadas
- **Framework:** Angular 17+ (ou sua versão atual).
- **Estilização:** SCSS / Tailwind CSS (ajuste conforme o seu uso).
- **Comunicação:** HttpClient para consumo de APIs REST.
- **Segurança:** Interceptadores para envio de Token JWT.

## ⚙️ Pré-requisitos
Antes de rodar o front-end, certifique-se de que a [BurgerQueen API](LINK_DO_SEU_REPO_BACK) está rodando (preferencialmente via Docker).

## 📦 Como Rodar o Projeto

1. **Instale as dependências:**
   ```bash
   npm install
