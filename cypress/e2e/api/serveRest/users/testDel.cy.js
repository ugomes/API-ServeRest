import { faker } from '@faker-js/faker';

describe('Deletar Usuário', () => {
  let idUsuario;
  
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
      
    });
  });

  it('Deve deletar um usuário cadastrado', () => {  
    cy.api({
      method: 'DELETE',
      url: `/usuarios/${idUsuario}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq("Registro excluído com sucesso");
    });
    
});

});