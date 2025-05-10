import { faker } from '@faker-js/faker';

describe('GET - Carrinho', () => {
   let token;
   let idProduto;
   let idCarrinho;
   let idPrecoUnitario;

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
                body: produto,
                headers: {
                    'Authorization': token
                },
              
                
            }).then((response) => {
             idProduto = response.body._id;
           
            });   
        });
    });

  it('Deve retornar todos os carrinhos cadastrados', () => {

      cy.api({
        method: 'GET',
        url: '/carrinhos',
        headers: {
          'Authorization': token
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.carrinhos).to.be.an('array')
        expect(response.body.carrinhos[0]).to.have.property('produtos');
        expect(response.body.carrinhos[0]).to.have.property('_id');
      });
    
  });

  it('Deve retornar um carrinho cadastrado pelo ID ', () => {   
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
       idCarrinho = response.body._id;
       

    cy.api({
      method: 'GET',
      url: `/carrinhos/${idCarrinho}`,
      headers: {
        'Authorization': token
      },
    }).then((response) => {
      idPrecoUnitario = response.body.produtos[0].precoUnitario;
      expect(response.status).to.eq(200);
      expect(response.body.produtos).to.be.an('array')
      expect(response.body.produtos[0]).to.have.property('idProduto');
      expect(response.body.produtos[0]).to.have.property('quantidade');
      expect(response.body.produtos[0]).to.have.property('precoUnitario');
      expect(response.body.produtos[0].precoUnitario).to.eq(idPrecoUnitario);
      
    });

    
      });

  });

  it('Não deve encontrar o carrinho com ID inexistente', () => {
    
    cy.api({    
        method: 'GET',
        url: '/carrinhos/1234567890123456',
        failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq("Carrinho não encontrado");
    });
    
});


});



