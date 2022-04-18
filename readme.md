# Arquitetura

A arquitetura escolhida foi a **arquitetura de microsserviços** por entender que assim é possível realizarmos escalabilidade granular nos serviços que estão sendo mais requisitados.

A comunicação escolhida entre os microsserviços foi a **comunicação assíncrona** e a ferramenta de mensageria que foi utilizada no projeto foi **Kafka**.

# Limites de Contexto (Context Boundaries)

![alt text](https://github.com/marceloribeirosilva/desafio-dev-api-rest/blob/master/images/Context%20Boundaries.png?raw=true)

# Diagrama da Arquitetura

![alt text](https://github.com/marceloribeirosilva/desafio-dev-api-rest/blob/master/images/Diagrama.png?raw=true)

# Descrição de funcionamento dos Microsserviços (Regras de negócio)

## Customer

### Criação de um cliente (Portador)

A api recebe de forma síncrona a solicitação, aonde recebe no body o nome, cpf, e-mail e senha.

É feito duas validações, sendo elas:

1) Validação de CPF
2) CPF único na base de cadastro

Uma vez que a solicitação passa por essas duas requisições, a API envia uma mensagem ao Kafka solicitando a abertura da conta que é realizada por outro microsserviço.

**Obs.:** Pensando na segurança dos dados do cliente, é utilizado um hash para salvar a senha do cliente no banco de dados.

### Autenticação de um cliente (Portador)

A api recebe de forma síncrona a solicitação, aonde recebe no body e-mail e senha

Uma vez que o cliente é autorizado a utlizar os serviços do banco, ele recebe um **Token JWT**.

Nesse token, salvamos o CPF do cliente para que a comunicação com os outros microsserviços possa se dar via token, sem a necessidade de explicitar essa informação.

## Account

Esse microsserviço atua como uma **API** recebendo requisições síncronas do usuário e também como um **Consumer** no qual ele se inscreve nos tópicos referentes ao kafka para criar a conta do cliente quando necessário e também atualizar o saldo da conta quando houver uma transição.

Enquanto Consumer, ele fica esperando mensagens do tópico que solicita uma criação de conta e também mensagens do tópico que solicita a atualização do saldo corrente.

Enquanto API, ele pode receber as seguintes requisições:

### Buscar conta

Através do token JWT, conseguimos recuperar o CPF do cliente e com isso a API realiza uma busca em seu banco de dados, trazendo as informações da conta, como Número, Agência, Saldo bancário.

**A conta precisa estar ativa para ser recuperada**

### Desabilitar conta

O próprio usuário pode a qualquer momento desabilitar a sua conta. É necessário JWT

### Bloquear conta

Nesse caso, é um endpoint que será utilizado apenas internamente pelos funcionários Dock, aonde poderão bloquear ou desbloquear a conta a qualquer momento.

**Ponto de melhoria**

Seria interessante criar uma segurança a parte para esse endpoint. De repente um JWT diferente que indicaria que é um funcionario autorizado a realizar essa ação.

### Realizar Depósito

O microsserviço em si não realiza o depósito. Essa responsabilidade ficou para o microsserviço Transactions. As únicas regras de negócio que temos nesse momento é verificar se a conta está **ativa e desbloqueada**.

Nesse momento o microsserviço atua como um **Producer**.

### Realizar Saque

O microsserviço em si não realiza o saque. Essa responsabilidade ficou para o microsserviço Transactions. As únicas regras de negócio que temos nesse momento é verificar se a conta está **ativa e desbloqueada**.

Nesse momento o microsserviço atua como um **Producer**.

## Transactions

Esse microsserviço atua como uma **API** recebendo requisições síncronas do usuário e também como um **Consumer** no qual ele se inscreve nos tópicos referentes ao kafka para realizar uma transação. Ao final da transação ele atua como um **Producer** para que a conta do cliente tenha o seu saldo atualizado.

No momento de realizar a transação, ele possui as seguintes regras de negócio:

1) Verifica se possui saldo suficiente para a transação (Débito)
2) Verifica se o total de transações do dia + o valor da transação atual é maior que 2.000 (Débito)

Enquanto API, ele pode receber as seguintes requisições:

### Extrato Bancário

O microsserviço busca no seu banco todas as transações de um determinado período que é definido via **params** da requisição.

# Docker e Docker-Compose

Os microsserviços foram todos dockeirizados a fim de facilitar, em um futuro pipeline o CI e CD.

Foi também realizado um **push** ao **docker hub** para que as imagens pudessem ser usadas no docker-compose.

## Serviços que sobem automaticamente no docker-compose

![alt text](https://github.com/marceloribeirosilva/desafio-dev-api-rest/blob/master/images/docker-compose-ps.png?raw=true)

## Pontos de melhoria

As imagens criadas dos microsserviços não foi uma imagem propícia para produção. Ou seja, não foi feito o build e consequentemente não estão no tamanho menor.

No Dockerfile, é interessante realizar essa melhoria para que ao invés de subir todos os arquivos do projeto, subir no container somente os arquivos da pasta dist e o restante necessário.

# Serviço KOWL

Para que possamos acompanhar as trocas de mensagens pelo Kafka, subi juntamente no docker-compose o servço KOWL no qual ele nos mostra todas as trocas de mensagens que estão sendo realizadas em tempo real.

![alt text](https://github.com/marceloribeirosilva/desafio-dev-api-rest/blob/master/images/Kowl1.png?raw=true)

![alt text](https://github.com/marceloribeirosilva/desafio-dev-api-rest/blob/master/images/Kowl2.png?raw=true)

# Cenário

A Dock está crescendo e expandindo seus negócios, gerando novas oportunidades de revolucionar o mercado financeiro e criar produtos diferenciados.
Nossa próxima missão é construir uma nova conta digital Dock para nossos clientes utilizarem através de endpoints, onde receberemos requisições em um novo backend que deverá gerenciar as contas e seus portadores (os donos das contas digitais).

# Requisitos

- Deve ser possível criar e remover **portadores**
    - Um **portador** deve conter apenas seu *nome completo* e *CPF*
    - O *CPF* deve ser válido e único no cadastro de **portadores**
- As **contas digital Dock** devem conter as seguintes funcionalidades:
    - A conta deve ser criada utilizando o *CPF* do **portador**
    - Uma conta deve ter seu *saldo*, *número* e *agência* disponíveis para consulta
    - Necessário ter funcionalidade para fazer a *consulta de extrato* da conta *por período*
    - Um **portador** pode fechar a **conta digital Dock** a qualquer instante
    - Executar as operações de *saque* e *depósito*
        - *Depósito* é liberado para todas as *contas ativas* e *desbloqueadas*
        - *Saque* é permitido para todas as *contas ativas* e *desbloqueadas* desde que haja *saldo disponível* e não ultrapasse o limite diário de *2 mil reais*

## Regulação obrigatória

- Precisamos *bloquear* e *desbloquear* a **conta digital Dock** a qualquer momento
- A **conta digital Dock** nunca poderá ter o *saldo negativo*


#  Orientações

Utilize qualquer uma das linguagens de programação:
- Java
- Javascript
- Typescript
- Python
- Kotlin
- Golang

Desenvolva o case seguindo as melhores práticas que julgar necessário, aplique todos os conceitos, se atente a qualidade, utilize toda e qualquer forma de governança de código válido. Vamos considerar toda e qualquer implementação, trecho de código, documentação e/ou intenção compartilhada conosco. Esperamos também que o desafio seja feito dentro do tempo disponibilizado e que esteja condizente com a posição pretendida.

É necessário ter o desafio 100% funcional contendo informações e detalhes sobre: como iniciar a aplicação, interagir com as funcionalidades disponíveis e qualquer outro ponto adicional.

## Diferenciais

- Práticas, padrões e conceitos de microservices será considerado um diferencial para nós por existir uma variedade de produtos e serviços dentro da Dock.
- Temos 100% das nossas aplicações e infraestrutura na nuvem, consideramos um diferencial, caso o desafio seja projeto para ser executado na nuvem.
- Nossos times são autônomos e têm liberdade para definir arquiteturas e soluções. Por este motivo será considerado diferencial toda: arquitetura, design, paradigma e documentação detalhando a sua abordagem.

### Instruções
      1. Faça o fork do desafio;
      2. Crie um repositório privado no seu github para o projeto e adicione como colaborador, os usuários informados no email pelo time de recrutameto ;
      3. Após concluir seu trabalho faça um push; 
      4. Envie um e-mail à pessoa que está mantendo o contato com você durante o processo notificando a finalização do desafio para validação.
