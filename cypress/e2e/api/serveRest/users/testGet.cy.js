import { faker } from '@faker-js/faker';

describe('Buscar Usuários Cadastrados', () => {
    let userId;
    let userNome;
    let userEmail;

    // Primeiro teste - Buscar todos
    it('Deve buscar todos os usuários cadastrados', () => {
        cy.api({
            method: 'GET',
            url: '/usuarios',
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.usuarios).to.be.an('array')
            expect(response.body.usuarios[0]).to.have.property('nome');
            expect(response.body.usuarios[0]).to.have.property('email');
            expect(response.body.usuarios[0]).to.have.property('administrador');
            expect(response.body.usuarios[0]).to.have.property('_id');
        });
    });

     
    context('Buscar usuário específico', () => {
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

                userId = response.body._id;
                userNome = usuarioCadastrado.nome;
                userEmail = usuarioCadastrado.email;
                        

                cy.log(userId);
                cy.log(userNome);
                cy.log(userEmail);
            });
        });

        it('Deve buscar um usuário cadastrado', () => {
            cy.api({
                method: 'GET',
                url: `/usuarios/${userId}`,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.administrador).to.eq("true");
                expect(response.body.nome).to.eq(userNome);
                expect(response.body.email).to.eq(userEmail);
                expect(response.body._id).to.eq(userId);
            });
        });
    });
});

    
    

