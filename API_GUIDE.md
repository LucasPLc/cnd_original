# Guia da API SAAM SPED CND

## Análise da API

### Visão Geral

A API gerencia clientes, empresas e resultados de CND (Certidão Negativa de Débitos). Ela expõe endpoints REST para operações CRUD em clientes e resultados, com validações de negócio e tratamento de erros.

### Endpoints da API (ClienteController)

- `GET /clientes`: Lista todos os clientes.
- `GET /clientes/{clienteId}`: Busca um cliente por ID.
- `POST /clientes`: Cadastra um novo cliente.
- `PUT /clientes/{clienteId}`: Atualiza um cliente existente.
- `DELETE /clientes/{clienteId}`: Remove um cliente.

### Formato JSON Esperado (`POST` e `PUT` /clientes)

O corpo da requisição para cadastrar ou atualizar um cliente deve seguir o seguinte formato:

```json
{
  "cnpj": "XX.XXX.XXX/XXXX-XX",
  "periodicidade": 1,
  "statusCliente": "ativo",
  "nacional": true,
  "municipal": false,
  "estadual": true,
  "empresa": {
    "idEmpresa": "123456",
    "nomeEmpresa": "Nome da Empresa",
    "cnpj": "XX.XXX.XXX/XXXX-XX"
  }
}
```

### Validações

#### Validações de Entrada (`ClienteDTO` e `EmpresaDTO`)

- **cnpj**: Obrigatório, formato `XX.XXX.XXX/XXXX-XX`, máximo de 18 caracteres.
- **periodicidade**: Obrigatório, número inteiro positivo.
- **statusCliente**: Obrigatório, máximo de 50 caracteres.
- **nacional, municipal, estadual**: Obrigatórios, valores booleanos.
- **empresa**: Obrigatório, objeto contendo `idEmpresa`, `nomeEmpresa` e `cnpj`.
- **empresa.idEmpresa**: Obrigatório, máximo de 6 caracteres.
- **empresa.nomeEmpresa**: Obrigatório, máximo de 255 caracteres.
- **empresa.cnpj**: Obrigatório, formato `XX.XXX.XXX/XXXX-XX`, máximo de 18 caracteres.

#### Validações de Negócio (`RegistroClienteService`)

- **Autorização da Empresa**: Antes de salvar um cliente, o sistema valida a autorização da empresa associada através de um serviço externo (`SituacaoValidationService`). O fluxo de validação é o seguinte:
    1.  O `SituacaoValidationService` faz uma chamada HTTP GET para uma URL externa, passando o `idEmpresa`.
    2.  Se a API externa retornar `{"situacao": 1}`, a validação é bem-sucedida.
    3.  Se a API externa retornar um status 4xx ou se o campo `situacao` for diferente de 1, a validação falha e a operação é negada.
    4.  Em caso de falha na comunicação com a API externa, o sistema tenta usar um status armazenado localmente como fallback.
- **Duplicidade de Cliente**: O sistema impede o cadastro de um cliente com o mesmo CNPJ para a mesma empresa.
- **Exclusão de Cliente**: Um cliente não pode ser excluído se houver resultados de CND vinculados a ele.

### Tratamento de Erros (`GlobalExceptionHandler`)

A API trata diversos tipos de erros, retornando códigos de status HTTP e mensagens de erro em JSON. Alguns exemplos:

- `400 Bad Request`: Erros de validação de entrada, como campos obrigatórios ausentes ou em formato inválido.
- `403 Forbidden`: Acesso negado devido à falta de autorização da empresa.
- `404 Not Found`: Cliente ou empresa não encontrados.
- `409 Conflict`: Tentativa de criar um cliente com um CNPJ que já existe para a empresa.
- `500 Internal Server Error`: Erros inesperados no servidor.
- `503 Service Unavailable`: O serviço de validação de autorização da empresa está indisponível.

### Dependência Externa

O funcionamento correto da API, especialmente o cadastro e a atualização de clientes, depende de um serviço de validação externo. Para que um cliente possa ser salvo com sucesso, o `idEmpresa` fornecido na requisição deve ser reconhecido e considerado ativo (`"situacao": 1`) por este serviço.

---

## Guia de Integração Front-end

### Visão Geral

Este guia descreve como o sistema front-end deve interagir com a API SAAM SPED CND, detalhando os fluxos de trabalho, formatos de dados e tratamento de respostas.

### Fluxo de Trabalho Principal: Cadastro e Atualização de Clientes

O fluxo mais complexo é o de cadastro e atualização de clientes, devido à validação externa.

#### Passo 1: Coleta de Dados do Usuário

O front-end deve apresentar um formulário para coletar os seguintes dados do cliente:

- **CNPJ do Cliente**: `cnpj` (string, formato `XX.XXX.XXX/XXXX-XX`)
- **Periodicidade**: `periodicidade` (número inteiro)
- **Status do Cliente**: `statusCliente` (string, ex: "ativo", "inativo")
- **Tipos de CND**: `nacional`, `municipal`, `estadual` (booleanos)
- **ID da Empresa**: `idEmpresa` (string, até 6 caracteres)
- **Nome da Empresa**: `nomeEmpresa` (string)
- **CNPJ da Empresa**: `cnpj` da empresa (string, formato `XX.XXX.XXX/XXXX-XX`)

#### Passo 2: Montagem do Objeto JSON

Com os dados coletados, o front-end deve montar um objeto JSON no seguinte formato para enviar no corpo da requisição `POST /clientes` ou `PUT /clientes/{clienteId}`:

```json
{
  "cnpj": "12.345.678/0001-99",
  "periodicidade": 30,
  "statusCliente": "ativo",
  "nacional": true,
  "municipal": true,
  "estadual": false,
  "empresa": {
    "idEmpresa": "EMP123",
    "nomeEmpresa": "Empresa de Exemplo Ltda.",
    "cnpj": "98.765.432/0001-11"
  }
}
```

**Observação Importante**: Todos os campos são obrigatórios.

#### Passo 3: Envio da Requisição

- **Cadastro (POST)**: Envie uma requisição `POST` para a URL `/clientes` com o objeto JSON no corpo.
- **Atualização (PUT)**: Envie uma requisição `PUT` para a URL `/clientes/{clienteId}` com o objeto JSON no corpo.

#### Passo 4: Tratamento das Respostas

O front-end deve estar preparado para tratar as seguintes respostas da API:

##### Sucesso

- **201 Created (POST)** ou **200 OK (PUT)**: A operação foi bem-sucedida. O corpo da resposta conterá o objeto do cliente salvo. O front-end pode usar esses dados para atualizar a interface.

##### Erros

O front-end deve exibir mensagens de erro amigáveis para o usuário com base no código de status e na mensagem de erro retornada pela API.

- **400 Bad Request**:
  - **Causa**: Geralmente, um erro de validação nos dados enviados. O corpo da resposta conterá uma mensagem de erro específica.
  - **Exemplo de Resposta**: `{"error": "Campo 'cnpj' deve estar no formato XX.XXX.XXX/XXXX-XX."}`
  - **Ação do Front-end**: Exibir a mensagem de erro para o usuário, indicando qual campo precisa ser corrigido.

- **403 Forbidden**:
  - **Causa**: A empresa (`idEmpresa`) não tem autorização para ser cadastrada.
  - **Exemplo de Resposta**: `{"error": "Acesso negado. Cliente sem autorização ativa."}`
  - **Ação do Front-end**: Informar ao usuário que a empresa não está autorizada e que ele deve entrar em contato com o suporte.

- **404 Not Found**:
  - **Causa**: O `clienteId` informado na URL de um `PUT` não existe.
  - **Exemplo de Resposta**: `{"error": "Cliente não encontrado para o ID informado."}`
  - **Ação do Front-end**: Informar ao usuário que o cliente que ele está tentando editar não foi encontrado.

- **409 Conflict**:
  - **Causa**: Já existe um cliente com o mesmo CNPJ para a empresa informada.
  - **Exemplo de Resposta**: `{"error": "Violação de chave única ou integridade referencial."}`
  - **Ação do Front-end**: Informar ao usuário que o CNPJ já está cadastrado para esta empresa.

- **503 Service Unavailable**:
  - **Causa**: O serviço de validação de empresas da API está temporariamente indisponível.
  - **Exemplo de Resposta**: `{"error": "Serviço de validação indisponível. Tente novamente mais tarde."}`
  - **Ação do Front-end**: Pedir para o usuário tentar novamente em alguns minutos.

### Outras Operações

#### Listar Clientes (GET /clientes)

- **Ação**: Fazer uma requisição `GET` para `/clientes`.
- **Resposta**: Um array de objetos de cliente.

#### Excluir Cliente (DELETE /clientes/{clienteId})

- **Ação**: Fazer uma requisição `DELETE` para `/clientes/{clienteId}`.
- **Resposta**:
  - **204 No Content**: Sucesso.
  - **400 Bad Request**: Se o cliente tiver resultados vinculados (`{"error": "Não é possível excluir o cliente. Existem resultados vinculados."}`).
  - **404 Not Found**: Se o cliente não for encontrado.
