import { faker } from '@faker-js/faker';

// Criar usuário
Cypress.Commands.add('criarUsuario', () => {
    const usuario = {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        administrador: "true"
    };

    return cy.api({
        method: 'POST',
        url: '/usuarios',
        body: usuario
    }).then(() => {
        return usuario; // Retorna o usuário criado para ser utilizado no teste
    });
});

// Login com usuário criado
Cypress.Commands.add('login', (email, password) => {
    return cy.api({
        method: 'POST',
        url: '/login',
        body: { email, password }
    }).then(response => {
        expect(response.status).to.eq(200);
        return response.body.authorization; // Retorna o token
    });
});