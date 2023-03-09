
# NestJS App

Esta aplicação em NestJS faz o gerenciamento de usuários através dos métodos CRUD.


## Features

- Criar um usuário (admin)
- Listar todos os usuários (admin)
- Busca por nome ou email (admin)
- Atualizar dados de usuário
- Deletar um usuário


## Instalação

1 - Clone o repositório
```bash
  git clone https://github.com/fvbalmeida/nestjs-user-management.git
```
2 - Instale as dependências 
```bash
  npm install
```
3 - Rode a aplicação
```bash
  npm run start:dev
```


    
## API Reference

#### Criar usuário

```http
  POST /user/create
```

| Prop | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `nome` | `string` | **Required** |
|`email` | `string` |  **Required**|
| `password` | `string` | **Required**|
| `phone` | `string` | **Required** |
| `permission` | `enum` | **Required**. 'admin' ou 'standard'|


#### Listar todos os usuários

```http
  GET /user
```

#### Buscar por nome ou email

```http
  GET /user/search/:string
```
| Param | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Optional** |
| `name` | `string` | **Optional** |

#### Editar um usuário

```http
  PUT /user/update/:id
```
| Param | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | **Required** |

#### Remover um usuário

```http
  DELETE /user/remove/:id
```
| Param | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | **Required** |

#### Fazer login

```http
  POST /auth/login
```

| Prop | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required** |
|`password` | `string` |  **Required**|




## Tech Stack

**Server:** NestJS, MySQL, JWT


