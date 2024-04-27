import { faker } from '@faker-js/faker'
const nome = faker.person.fullName()
const email= faker.internet.email()

describe('acessar o frontend Rarocrud', () => {
  it('listar usuários', () => {
    cy.viewport(1000, 660);
    cy.on('uncaught: exception', () => {
      return false;
    })
    cy.visit('/users');
    cy.url('').should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    cy.get('#listaUsuarios');

  })
  it('1. Todos as informações de usuários cadastrados devem ser fornecidas após a consulta', () => {
    cy.visit('/users');
  })
  it('2. Caso não existam usuários cadastrados, deve existir uma opção para cadastrar um usuário', () => {
    cy.visit('/users');
    cy.contains('a','Novo').click()
    cy.url('').should('equal','https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');
  })
})
//////////////°°//////////////////////
describe('criação de usuário', () => {
  it('conseguir criar usuário válido', () => {
    cy.viewport(1000, 660);
    cy.visit('/users/novo');
    cy.get('#email').type(email);
    cy.get('#name').type(nome);
    cy.get('.sc-dAlyuH.jdAtLn').click();
    cy.wait(1000);
    cy.contains('Usuário salvo com sucesso!');
  })
  describe('Bad request', () => {  
    it('não preencheu o campo de email',()=>{
      cy.visit('/users/novo');
      cy.get('#name').type(nome);
      cy.get('.sc-dAlyuH.jdAtLn').click();
      cy.wait(1000);
      cy.get('span.sc-cPiKLX.feFrSQ');
      cy.contains('O campo e-mail é obrigatório.');
    })
    it('não preencheu o campo de nome',()=>{
      cy.visit('/users/novo');
      cy.get('#email').type(email);
      cy.get('.sc-dAlyuH.jdAtLn').click();
      cy.wait(1000);
      cy.contains('O campo nome é obrigatório.');
    })
    it('não preencheu o campo de nome com mais de 4 caracteres',()=>{
      cy.visit('/users/novo');
      cy.get('#email').type(email);
      cy.get('#name').type(' ');
      cy.get('.sc-dAlyuH.jdAtLn').click();
      cy.wait(1000);
      cy.contains('Informe pelo menos 4 letras para o nome.');
    })
    it('E-mail informado possuir um formato inválido,', () => {
      cy.visit('/users/novo');
      cy.get('#email').type(nome);
      cy.get('#name').type(nome);
      cy.get('.sc-dAlyuH.jdAtLn').click();
      cy.wait(1000);
      cy.contains('Formato de e-mail inválido');
    })
    it('E-mail já está em uso', () => {
      // cy.intercept({
      //   method: 'POST',
      //   url: '/users/novo'
      //   body:{
      //
      //   }
      // })
      cy.visit('/users/novo');
      cy.get('#email').type(email);
      cy.get('#name').type(nome + 'Martins');
      cy.get('.sc-dAlyuH.jdAtLn').click();
      // duas vezes para garantir que existirá um usuário com esse email
      cy.wait(3000);
      cy.contains('Este e-mail já é utilizado por outro usuário');
    })
    it('Nome com mais de 100 caracteres.', () => {
      cy.visit('/users/novo');
      cy.get('#email').type(email);
      cy.get('#name').type(nome + 'Garciakjhdikjdhjdhjdhjdhjdhdjhdjhdjhdjdhjdhdjhdjhdjdhjdhdjhdjhdjhdjhdjdhdjhdjhdjhdjdhjdhdjhdjhdhdjhdjdhjdhdjhdjdh');
      cy.get('.sc-dAlyuH.jdAtLn').click();
      cy.wait(1000);
      cy.contains('Informe no máximo 100 caracteres para o nome')   
    })
    it('E-mail com mais de 60 caracteres.', () => {
      cy.visit('/users/novo');
      cy.get('#email').type('muitograndemuitograndemuitograndemuitograndemuitograndemuitomuitogrande'+ email);
      cy.get('#name').type(nome);
      cy.get('.sc-dAlyuH.jdAtLn').click();
      cy.wait(1000);
      cy.contains('Informe no máximo 60 caracteres para o e-mail');
    })
  })
})
describe.only('Pesquisa de usuario', () => {
  it('pesquisar usuário', () => {
    cy.viewport(1000, 660);
    cy.visit('/users');
    cy.get('[placeholder="E-mail ou nome"]').type(email);
    cy.wait(1000);
    cy.get('#userDataDetalhe');

  })
  it('usuário não encontrado', () => {
    cy.intercept('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users').as(espiada)
    cy.viewport(1000, 660);
    cy.visit('/users');
    cy.get('[placeholder="E-mail ou nome"]').type('jotaro Kujo');
    cy.wait(espiada).then((resultado)=>{
      cy.log(resultado);
      expect(resultado.response.status).to.equal(200);
    });
    cy.contains('Ops! Não existe nenhum usuário para ser exibido.')
  })
})