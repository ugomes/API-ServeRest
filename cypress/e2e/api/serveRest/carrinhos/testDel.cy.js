import { faker } from '@faker-js/faker';

describe('DELETE - CONCLUIR CARRINHO - Carrinho', () => {
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

            cy.api({
                method: 'POST',
                url: '/carrinhos',
                body: {
                    produtos:[  {  
                        idProduto: idProduto,
                        quantidade: 5,
                        }
                        ]   
                    },
                headers: {
                    'Authorization': token
                },
            })
           
        });
    });
  })

  it('Deve deletar o carrinho - Concluir Compra', () => {
      cy.api({
        method: 'DELETE',
        url: '/carrinhos/concluir-compra',
        headers: {
          'Authorization': token
        },
      }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq("Registro excluído com sucesso");
      });
  });

  it('Não deve cancelar o carrinho - Token Ausente', () => {
      cy.api({
        method: 'DELETE',
        url: '/carrinhos/concluir-compra',
        failOnStatusCode: false,
      }).then((response) => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.eq("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
      });
    
  });

});

describe('DELETE - CANCELAR CARRINHO - Carrinho', () => {
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

             cy.api({
                 method: 'POST',
                 url: '/carrinhos',
                 body: {
                     produtos:[  {  
                         idProduto: idProduto,
                         quantidade: 5,
                         }
                         ]   
                     },
                 headers: {
                     'Authorization': token
                 },
             })
            
         });
     });
   })
 it('Deve deletar o carrinho - Cancelar Compra', () => {
     cy.api({
       method: 'DELETE',
       url: '/carrinhos/cancelar-compra',
       headers: {
         'Authorization': token
       },
     }).then((response) => {
         expect(response.status).to.eq(200);
         expect(response.body.message).to.eq("Registro excluído com sucesso. Estoque dos produtos reabastecido");
     });
 });

 it('Deve não cancelar o carrinho - Token Ausente', () => {
     cy.api({
       method: 'DELETE',
       url: '/carrinhos/cancelar-compra',
       failOnStatusCode: false,
     }).then((response) => {
         expect(response.status).to.eq(401);
         expect(response.body.message).to.eq("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
     });
   
 });
    
});