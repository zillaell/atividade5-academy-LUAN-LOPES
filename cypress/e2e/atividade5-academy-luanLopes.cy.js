import { faker } from '@faker-js/faker'
const nome = faker.person.fullName()
const email= faker.internet.email()

describe('acessar o frontend Rarocrud', () => {
  beforeEach(()=>{
    cy.visit('/users');
  });

  it('listar usuários', () => {
    cy.viewport(1000, 660);
    cy.url('').should('equal', 'https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    cy.get('#listaUsuarios');

  })
  it('1. Todos as informações de usuários cadastrados devem ser fornecidas após a consulta', () => {

  })
  it('2. Caso não existam usuários cadastrados, deve existir uma opção para cadastrar um usuário', () => {
    cy.intercept('GET','rarocrud-80bf38b38f1f.herokuapp.com/api/v1/users').as('listaVazia');
    //cy.wait('@listavazia');
    // cy.contains('a','Novo').click()
    // cy.url('').should('equal','https://rarocrud-frontend-88984f6e4454.herokuapp.com/users/novo');
  })
})
//////////////°°//////////////////////
describe('criação de usuário', () => {
  const aleatorionumero = faker.number.int({length:16})
  beforeEach(()=>{
    cy.visit('/users/novo');
  });
  it('conseguir criar um usuário válido', () => {
    cy.viewport(1000, 660);
    cy.get('#email').type(email);
    cy.get('#name').type(nome);
    cy.get('.sc-dAlyuH.jdAtLn').click();
    cy.wait(2000);
    cy.contains('Usuário salvo com sucesso!');
  })
  it('conseguir criar um usuário válido com 100 caracteres no nome', () => {
   const username = faker.name.firstName({ minLength: 5, maxLength: 5 })
    cy.intercept('POST','/users/novo',
    // {
    //   statusCode: 201,
    //   body:{
    //     name: nome.repeat(10),
    //     email: email,
    //   },
    // }
  ).as('postUsuario100');

    cy.viewport(1000, 660);
    cy.get('#email').type(email);
    cy.get('#name').type(username.repeat(20));
    //cy.wait('@postUsuario100').then((data)=> cy.log(data));
    cy.get('.sc-dAlyuH.jdAtLn').click();
    cy.contains('Usuário salvo com sucesso!');
  })
  it('conseguir criar um usuário válido com 60 caracteres no e-mail', () => {
    cy.intercept('POST','/users/novo',
    ).as('postUsuario100');

    cy.viewport(1000, 660);
    cy.get('#email').type(aleatorionumero +'qwertyuiopasdfghjklczxcvbnmqwertyuiop@qa.com');
    cy.get('#name').type(nome);
    cy.get('.sc-dAlyuH.jdAtLn').click();
    cy.wait(2000);
    cy.contains('Usuário salvo com sucesso!');
  })
  describe('Bad request, na criação de usuário', () => {  
    it('não preencheu o campo de email',()=>{
      cy.get('#name').type(nome);
      cy.get('.sc-dAlyuH.jdAtLn').click();
      cy.wait(1000);
      cy.get('span.sc-cPiKLX.feFrSQ');
      cy.contains('O campo e-mail é obrigatório.');
    })
    it('não preencheu o campo de nome',()=>{
      cy.get('#email').type(email);
      cy.get('.sc-dAlyuH.jdAtLn').click();
      cy.wait(1000);
      cy.contains('O campo nome é obrigatório.');
    })
   // CASO NÂO ESPECIDICADO NA API
    // it('não preencheu o campo de nome com mais de 4 caracteres',()=>{
    //   cy.get('#email').type(email);
    //   cy.get('#name').type(' ');
    //   cy.get('.sc-dAlyuH.jdAtLn').click();
    //   cy.wait(1000);
    //   cy.contains('Informe pelo menos 4 letras para o nome.');
    // })
    it('E-mail informado possuir um formato inválido,', () => {
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
      //   statusCode: 422,
      //   body:{
      //     'Este e-mail já é utilizado por outro usuário'
      //   }
      // }).as('postUsuário');
      cy.get('#email').type(email);
      cy.get('#name').type(nome + 'Martins');
      cy.get('.sc-dAlyuH.jdAtLn').click();
      // duas vezes para garantir que existirá um usuário com esse email
      cy.wait(3000);
      cy.contains('Este e-mail já é utilizado por outro usuário');
    })
    it('Nome com mais de 100 caracteres.', () => {
      cy.get('#email').type(email);
      cy.get('#name').type(nome + 'Garciakjhdikjdhjdhjdhjdhjdhdjhdjhdjhdjdhjdhdjhdjhdjdhjdhdjhdjhdjhdjhdjdhdjhdjhdjhdjdhjdhdjhdjhdhdjhdjdhjdhdjhdjdh');
      cy.get('.sc-dAlyuH.jdAtLn').click();
      cy.wait(1000);
      cy.contains('Informe no máximo 100 caracteres para o nome')   
    })
    it('E-mail com mais de 60 caracteres.', () => {
      cy.get('#email').type('muitograndemuitograndemuitograndemuitograndemuitograndemuitomuitogrande'+ email);
      cy.get('#name').type(nome);
      cy.get('.sc-dAlyuH.jdAtLn').click();
      cy.wait(1000);
      cy.contains('Informe no máximo 60 caracteres para o e-mail');
    })
  })
})
describe('Pesquisa de usuario', () => {
  it('pesquisar usuário por email', () => {
    cy.viewport(1000, 660);
    cy.visit('/users');
    cy.get('[placeholder="E-mail ou nome"]').type(email);
    cy.wait(1000);
    cy.get('#userDataDetalhe').click()
    cy.get('[autocomplete="off"]').invoke('val')
    .then((data)=> cy.log(data));

  })
  it('pesquisar pelo identificador unico (id)', () => {
    cy.viewport(1000, 660);
    cy.visit('/users');
    cy.contains('a','Ver detalhes').click()
    cy.get('[autocomplete="off"]').invoke('val')
    .should('equal','2b523b2b-dc6b-4910-97e6-47c5da4cb85e');
    cy.wait(1000);
  })
  it('pesquisar pelo identificador unico (id) no link e conferir se é o usuario correto ', () => {
    cy.viewport(1000, 660);
    cy.visit('/users/2b523b2b-dc6b-4910-97e6-47c5da4cb85e');
    cy.get('[autocomplete="off"]').invoke('val')
    .should('equal','2b523b2b-dc6b-4910-97e6-47c5da4cb85e');
    cy.get('#userName').invoke('val').should('equal','Daisy Langosh');
    cy.get('#userEmail').invoke('val').should('equal','kavon.kerluke-jacobs16@yahoo.com');
    cy.wait(1000);
  })
  it('usuário não encontrado', () => {
    cy.intercept('https://rarocrud-frontend-88984f6e4454.herokuapp.com/users');
    cy.viewport(1000, 660);
    cy.visit('/users');
    cy.get('[placeholder="E-mail ou nome"]').type('jotaro Kujo');
    cy.wait(1000);
    cy.contains('Ops! Não existe nenhum usuário para ser exibido.')
  })

})