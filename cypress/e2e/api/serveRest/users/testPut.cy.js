import { faker } from '@faker-js/faker';

    let idUsuario; 
    let nomeUsuario;
    let password;
    let email;
    let idNaoCadastrado = 123456;

describe('Atualizar Usuário Válido', () => {
    

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
        }).then((response) => {
            idUsuario = response.body._id;
            nomeUsuario = usuarioCadastrado.nome;
            password = usuarioCadastrado.password
         });
    });

    it('Deve atualizar usuário', () => {
        const usuarioAtualizado = {
            nome: nomeUsuario ,
            email: faker.internet.email(),
            password:password ,
            administrador: "true"
        };

        cy.api({
            method: 'PUT',
            url: `/usuarios/${idUsuario}`,
            body: usuarioAtualizado,
        }).then((response) => {
            email = usuarioAtualizado.email;
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq("Registro alterado com sucesso");

            
        })
    });

    it('Deve cadastrar o usuario', () => {
        const usuarioCadstroNovo = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "true"
        };

        cy.api({
            method: 'PUT',
            url: `/usuarios/${idNaoCadastrado}`,
            body: usuarioCadstroNovo,
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.eq("Cadastro realizado com sucesso");
            expect(response.body).to.have.property('_id');
            cy.log(response.body);
        });
        
    });
});

describe('Não deve atualizar o usuario com email já cadastrado', () => {

    it('Não deve atualizar com email já cadastrado', () => {
       
        const usuarioComEmailCadastrado = {
            nome: faker.person.fullName(),
            email:  email,
            password: faker.internet.password(),
            administrador: "true"
        };
        cy.api({
            method: 'PUT',
            url: `/usuarios/${idUsuario}`,
            body: usuarioComEmailCadastrado,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.message).to.eq("Este email já está sendo usado");
            cy.log(response.body);
        });
                   
    });
    
});
