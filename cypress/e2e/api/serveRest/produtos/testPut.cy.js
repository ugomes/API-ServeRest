import { faker } from '@faker-js/faker';

describe('Teste - Atualizar Produto Válido', () => {
    let token;
    let idProduto;


    beforeEach(() => {
        // Criar usuário e fazer login
        cy.criarUsuario()
            .then(usuario => {
                return cy.login(usuario.email, usuario.password);
            })
            .then(authToken => {
                token = authToken;
            });
    });

    it('Deve atualizar produto', () => {
        // Cadastrar produto para teste
        const cadastroProduto = {
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
            body: cadastroProduto
        }).then((response) => {
            idProduto = response.body._id;

            const produtoAtualizado = {
                nome: faker.commerce.productName(),
                preco: 100,
                descricao: faker.commerce.productDescription(),
                quantidade: 100,
            };

            cy.api({
                method: 'PUT',
                url: `/produtos/${idProduto}`,
                headers: {
                    'Authorization': token
                },
                body: produtoAtualizado,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.message).to.eq("Registro alterado com sucesso");
            });
        });
    });

    it('Deve cadastrar o produto caso o ID não exista', () => {
        const produto = {
            nome: faker.commerce.productName(),
            preco: 100,
            descricao: faker.commerce.productDescription(),
            quantidade: 100,
        };

        cy.api({
            method: 'PUT',
            url: '/produtos/123456',
            headers: {
                'Authorization': token
            },
            body: produto,
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.eq("Cadastro realizado com sucesso");
            expect(response.body).to.have.property('_id');
            cy.log(response.body);
        });
    });
});

describe('Teste ROTA EXCLUSIVA  PARA ADMINISTRADORES', () => {
    
    let email;
    let password;
    let token;

    beforeEach(() => {

    const usuario= {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        administrador: "false"

    }

    cy.api({
        method: 'POST',
        url: '/usuarios',
        body: usuario,

    }).then(() => {
        email =  usuario.email;
        password = usuario.password;

        cy.api({
            method: 'POST',
            url: '/login',
            body: {
                email: email,
                password: password,
                
            },
        }).then((response) => {
            token = response.body.authorization;
            
        });
        
    })
    });

    it('Deve falhar - Rota exclusiva para administradores', () => {
        const produto = {
            nome: faker.commerce.productName(),
            preco: 100,
            descricao: faker.commerce.productDescription(),
            quantidade: 100,
        };

        cy.api({
            method: 'PUT',
            url: '/produtos/123456',
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
    
