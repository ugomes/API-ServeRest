import { faker } from '@faker-js/faker';



describe('Teste - DELETE Produto', () => {
    let token;

    beforeEach(() => {
        cy.criarUsuario()
            .then(usuario => {
                return cy.login(usuario.email, usuario.password);
            })
            .then(authToken => {
                token = authToken;
            });
       

    });



    const produto = {
        nome: faker.commerce.productName(), 
        preco: 100, 
        descricao: faker.commerce.productDescription(), 
        quantidade: 100, 
      };

      it('Deve deletar produto', () => {
          cy.api({
              method: 'POST',
              url: '/produtos',
              body: produto,
              headers: {
                  'Authorization': token
              },
          }).then((response) => {

              const idProduto = response.body._id;
              cy.api({
                  method: 'DELETE',
                  headers: {
                      'Authorization': token
                  },
                  url: `/produtos/${idProduto}`,
              }).then((response) => {
                  expect(response.status).to.eq(200);
                  expect(response.body.message).to.eq("Registro excluído com sucesso");
              });
          });
       })
    
    
});

describe('Teste - DELETE - ROTA EXCLUSIVA PARA ADMINISTRADORES', () => {
    let email;
    let password;
    let token;

    beforeEach(() => {
        const usuario = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "false"
        };

        cy.api({
            method: 'POST',
            url: '/usuarios',
            body: usuario,
        }).then(() => {
            email = usuario.email;
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
        });
     });
   
  it('Deve falhar - Rota exclusiva para administradores', () => {
        
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
            body: cadastroProduto,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body.message).to.eq("Rota exclusiva para administradores");
        });
    });
    
});

describe('Teste - DELETE - PRODUTO NO CARRINHO', () => {
        let token;
        let idProduto;

        beforeEach(() => {
            cy.criarUsuario()
                .then(usuario => {
                    return cy.login(usuario.email, usuario.password);
                })
                .then(authToken => {
                    token = authToken;

                    cy.api({
                        method: 'POST',
                        url: '/produtos',
                        body: {
                            nome: faker.commerce.productName(),
                            preco: 100,
                            descricao: faker.commerce.productDescription(),
                            quantidade: 100,
                        },
                        headers: {
                            'Authorization': token
                        },
                    }).then((response) => {
                         idProduto = response.body._id;
                        cy.api({                        
                            method: 'POST', 
                            url: '/carrinhos', 
                            headers: {
                                'Authorization': token
                            },
                            body: {
                                produtos:[{
                                    idProduto: idProduto,
                                    quantidade: 100

                                }
                                ],
                            }
                    });        
            });
           
    });
    
});

it('Não dever excluir o produto - PRODUTO NO CARRINHO ', () => {

    cy.api({
        method: 'DELETE',
        headers: {
            'Authorization': token
        },
        url: '/carrinhos,',
        failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(405);
        expect(response.body.message).to.eq("Não é possível realizar DELETE em /carrinhos,. Acesse https://serverest.dev para ver as rotas disponíveis e como utilizá-las.");
    });
    
});

});