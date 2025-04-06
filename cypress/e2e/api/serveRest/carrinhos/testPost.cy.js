import { faker } from '@faker-js/faker';

describe('POST - Carrinho', () => {
    let token;
    let idProduto;
    

    beforeEach(() => {
        cy.criarUsuario()
            .then(usuario => {
                return cy.login(usuario.email, usuario.password);
            })
            .then(authToken => {
                token = authToken;
            
        
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
             idProduto = response.body._id;
           
            });  
     });     

    });

    it('Deve colocar o produto no carrinho', () => {

            const carrinho = {
            produtos:[  {  
                idProduto: idProduto,
                quantidade: 5,
                }
                ]   
            };

        cy.api({    
            method: 'POST',
            url: '/carrinhos',
            body: carrinho,
            headers: {
                'Authorization': token
            },
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.eq("Cadastro realizado com sucesso");
            expect(response.body).to.have.property('_id');
    });
});

    it('Não deve colocar produto no carrinho - Token Ausente', () => {
        const carrinho = {
            produtos:[  {  
                idProduto: idProduto,
                quantidade: 5,
                }
                ]   
            };

        cy.api({    
            method: 'POST',
            url: '/carrinhos',
            body: carrinho,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
        });
    });    

});