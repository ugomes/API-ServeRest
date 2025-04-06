**Testes de API com Cypress e o Plugin cy.api**

Este repositório contém testes de API utilizando o Cypress, juntamente com o plugin cy.api, que simplifica a realização de testes de APIs REST.

**Pré-requisitos**

Antes de começar, você precisará ter o Node.js e o npm instalados em sua máquina. Você pode baixar e instalar o Node.js: https://nodejs.org/pt

**Instalação**

**1 - Clone este repositório:**

   git clone https://github.com/ugomes/API-ServeRest.git
   cd nome-do-repositorio

**2 - Instale as dependências do projeto:**   
       npm install
       
**3 - Instale o plugin cy.api:**    

       npm install --save-dev cypress-plugin-api
       
**4 - Adicione o plugin ao seu arquivo no cypress/support/e2e.js**

      import 'cypress-plugin-api';
  
**5 - Executando os Testes**

**Para executar os testes, você pode usar o seguinte comando:**

    npx cypress open
    npx cypress run ( modo headless)


