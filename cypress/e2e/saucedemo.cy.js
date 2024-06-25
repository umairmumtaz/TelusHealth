
// The describe() function is used to group related test cases together.
// The it() function is used to define an individual test case.

describe('template spec', () => {

  // This is a setup function that runs before each test case.
  // It visits the web application's homepage before each test case.
  const userNAme = 'standard_user'
  const password = 'secret_sauce'
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com',{failOnStatusCode: false})
  })

  // This is the first test case.
  // It logs in to the web application and verifies that the user is redirected to the Products page.
  it('Test1', () => {
    login(userNAme, password);
        
  })

  // This is the second test case.
  // It logs in to the web application, clicks on the "Add to Cart" button three times,
  // checks out the items, and verifies that the user is redirected to the Checkout page.
  it('Test2', () => {

    login(userNAme, password);
    addFirstThreeProducts();
    checkout();
    
     
  })

  // This is the third test case.
  // It logs in to the web application, adds items to the cart until the total order amount is between $30 and $60,
  // checks out the items, and verifies that the user is redirected to the Checkout page.
  it('Test3', () => {
    login(userNAme, password);
    makeTotalOrder();
    checkout();
  
  })
})

// This function logs in to the web application.
// It enters the username and password, clicks the login button, and verifies that the user is redirected to the Products page.
function login(userName, password) {
  cy.get('input[data-test="username"]').should('exist').type(userName)
  cy.get('input[data-test="password"]').should('exist').type(password)
  cy.get('input[data-test="login-button"]').should('exist').click()
  cy.get('span[data-test="title"]').should('have.text','Products')
}

// These are the selectors for the price and "Add to Cart" buttons.
const selectorPrice = 'div[data-test="inventory-item-price"]';
const selectorAddToCart = 'button[data-test^="add-to-cart-sauce-lab"]';

// This function clicks on the "Add to Cart" for first 3 items/products.
function addFirstThreeProducts() {
  for (let i = 0; i < 3; i++) {
    cy.get('button[data-test^="add-to-cart-sauce-lab"]').eq(i).click();
  }
}

// This function retrieves the price of an item.
/// remove the dollar sign from the text, parse the text as a float, and return the price.
function getPrice(locator,i) {
     cy.get(locator).eq(i).invoke('text').then((text) => {
      const price = parseFloat(text.replace('$', ''));
      return price;
    });
      
}

// This function adds items to the cart until the total order amount is between $30 and $60.
// It uses the getPrice() function to retrieve the price of each item and adds it to the total order amount.
// If the total order amount is between $30 and $60, it breaks out of the loop.
function makeTotalOrder() { 
  var sum = 0; 
  for (let i = 0; i < 3; i++) {
    sum += getPrice(selectorPrice,i);
    cy.get(selectorAddToCart).eq(i).click();
 
    if(sum >= 30 && sum <= 60) {
      break
   } 
  }
}

// This function comples a the checkout process and validates the required elements.
function checkout() {
  cy.get('a[data-test^="shopping-cart-link"]').should('exist').click()
  cy.get('button[data-test^="remove-sauce-labs"]').first().click()
  cy.get('button[data-test="checkout"]').should('exist').click()

  cy.get('input[data-test="firstName"]').type('Umair')
  cy.get('input[data-test="lastName"]').type('Mumtaz')
  cy.get('input[data-test="postalCode"]').type('12345')
  cy.get('input[data-test="continue"]').should('exist').click()
  cy.get('span[data-test="title"]').should('exist').should('have.text','Checkout: Overview')
  cy.get('button[data-test="finish"]').should('exist').click()

  cy.get('span[data-test="title"]').should('exist').should('have.text','Checkout: Complete!')   
  cy.get('h2[data-test="complete-header"]').should('exist').should('have.text','Thank you for your order!')

}

//This function is Not used so far, but i have craeted to Retrive the Password Dynamically from the Website.
function getPassword() {
    cy.get('div[data-test="login-password"]').then(($password) => {
    // store the password as text
    console.log($password.text())
    return $password.text()

  })


}
