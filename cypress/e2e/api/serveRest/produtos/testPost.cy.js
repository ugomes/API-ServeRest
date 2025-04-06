import { faker } from '@faker-js/faker';


describe('Teste Cadastrar Produto',  () => {
  let email;
  let password; 
  let token; 
  let nomeProduto;

    beforeEach(() => {
        const usuarioCadastrado = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "true"
        };
        
        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: usuarioCadastrado,
        }).then(() => {
            password = usuarioCadastrado.password;
            email = usuarioCadastrado.email;
                 
        cy.api({
            
            method: 'POST',
            url: '/login',
            body: {
                email: email,
                password: password,
            }

        }).then((response) => {
            token = response.body.authorization;
        })    
    });  
      
      
      });
         
    
    it('Deve cadastrar produto',   () => {
        
        
        const produto = {
            nome: faker.commerce.productName(),
            preco: 100,
            descricao: faker.commerce.productDescription(),
            quantidade: 100,
        };
        
        cy.api({
            method: 'POST',
            url: '/produtos',
            headers: {
                'Authorization': token
            },
            body: produto,
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.eq("Cadastro realizado com sucesso");
            expect(response.body).to.have.property('_id');
            nomeProduto = produto.nome;
        })
           
        
    });

    it('Teste - Deve falhar -Já existe produto com esse nome', () => {
        
        const produto = {
            nome: nomeProduto,
            preco: 100,
            descricao: faker.commerce.productDescription(),
            quantidade: 100,
        };
        
        cy.api({
            method: 'POST',
            url: '/produtos',
            headers: {
                'Authorization': token
            },
            body: produto,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.message).to.eq("Já existe produto com esse nome");
           

        
    });
     
});

})

describe('Teste - Rota da Usuario - Adm - FALSE', () => {
    let token;  
    let password;
    let email;
    beforeEach(() => {
        const usuarioCadastrado = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "false"
        };
        
        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: usuarioCadastrado,
        }).then(() => {
            password = usuarioCadastrado.password;
            email = usuarioCadastrado.email;
                 
        cy.api({
            
            method: 'POST',
            url: '/login',
            body: {
                email: email,
                password: password,
            }

        }).then((response) => {
            token = response.body.authorization;
        })    
    });  

    
    
});

    it('Teste - Deve falhar - Rota da Usuario - Adm - FALSE', () => { 

        const produto = {
            nome: faker.commerce.productName(),
            preco: 100,
            descricao: faker.commerce.productDescription(),
            quantidade: 100,
        };
        
        cy.api({
            method: 'POST',
            url: '/produtos',
            headers: {
                'Authorization': token
            },
            body: produto,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body.message).to.eq("Rota exclusiva para administradores");
    });
});

});