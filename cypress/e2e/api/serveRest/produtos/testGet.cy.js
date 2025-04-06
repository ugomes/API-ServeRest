import { faker } from '@faker-js/faker';

describe('Teste Buscar todos os Produtos Cadastrados', () => {
   
    it('Deve buscar todos os produtos cadastrados', () => {
        cy.api({
            method: 'GET',
            url: '/produtos',
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.produtos).to.be.an('array')
            expect(response.body.produtos[0]).to.have.property('nome');
            expect(response.body.produtos[0]).to.have.property('preco');
            expect(response.body.produtos[0]).to.have.property('descricao');
            expect(response.body.produtos[0]).to.have.property('quantidade');
            expect(response.body.produtos[0]).to.have.property('_id');
        });
        
    });
   
describe(' Teste Não deve buscar produto com ID inexistente', () => {
    it('Deve não encontrar o produto com ID inexistente', () => {
        
        cy.api({
            method: 'GET',
            url: `/produtos/12345`,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.message).to.eq("Produto não encontrado");
        });
        
    });

});
    
});
    

describe('Teste Buscar um Produto Cadastrado pelo ID', () => {
    let token;
    let idProduto;
    let nomeProduto;
    let precoProduto;
    let quantidadeProduto;


    beforeEach(() => {
        cy.criarUsuario().then(usuario => {
            cy.login(usuario.email, usuario.password).then(authToken => {
                token = authToken;
            });
        });

    });

    it('Deve buscar um produto pelo ID', () => {
        const cadastroProduto = {
            nome: faker.commerce.productName(),
            preco: 100,
            descricao: faker.commerce.productDescription(),
            quantidade: 100,
        };

        cy.api({
            method:'POST',
            url:'/produtos',
            headers: {
                'Authorization': token
            },

            body: cadastroProduto,
           
        }).then((response) => {
            idProduto = response.body._id;
            nomeProduto = cadastroProduto.nome;
            precoProduto = cadastroProduto.preco;
            quantidadeProduto = cadastroProduto.quantidade;
        

            cy.api({
                method: 'GET',
                url: `/produtos/${idProduto}`,
                headers: {
                    'Authorization': token
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.nome).to.eq(nomeProduto);
                expect(response.body.preco).to.eq(precoProduto);
                expect(response.body.quantidade).to.eq(quantidadeProduto);
                expect(response.body._id).to.eq(idProduto);
            });
        });
    });
});


