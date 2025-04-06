import { faker } from '@faker-js/faker';

describe('Teste Post', () => {

    let emailCadastrado;
      
    
    it('Teste Cadastrar Usuário ', () => {
        
        const usuario = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "true"
        };
        emailCadastrado = usuario.email;
        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: usuario,
                
        
    }).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.message).to.eq("Cadastro realizado com sucesso");
                
         })

    })
    
    it('Cadastro com email Existente', () => {
        const usuarioEmailCadastrado = {
            nome: faker.person.fullName(),
            email: emailCadastrado,
            password: faker.internet.password(),
            administrador: "true"
        };

        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: usuarioEmailCadastrado,
            failOnStatusCode: false
                
        
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.message).to.eq("Este email já está sendo usado");
           
            
         })

         
        
    })


});