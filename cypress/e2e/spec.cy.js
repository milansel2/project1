/// <reference types="cypress" />

describe('Saucedemo e2e scenarios', () => {

  beforeEach(function () {
    cy.viewport(1920, 1080);
    cy.fixture("users").as("users");
  })

  it('Login as a standard user', () => {
    cy.get("@users").then((users) => {
      cy.session('userSessionStandard', () => {
        cy.login(users.standard, users.pass)
        cy.getDataTest('error').should('not.exist')
        cy.get('#shopping_cart_container').should('be.visible')
      })
    })
  })

  it(`Login as a performance_glitch_user`, () => {
    cy.get("@users").then((users) => {
      cy.session('userSessionPerformance', () => {
        cy.login(users.performance, users.pass)
        cy.getDataTest('error').should('not.exist')
        cy.get('#shopping_cart_container').should('be.visible')
      })
    })
  })

  it(`Login as an unknown user`, () => {
    cy.get("@users").then((users) => {
      cy.login(users.unknown, 'any_pass')
      cy.getDataTest('error').should('exist').and('contain.text', 'Username and password do not match')
    })
  })

  it(`Standard user checkout with most expensive item`, function () {
    cy.get("@users").then((users) => {
      cy.login(users.standard, users.pass)

      cy.getDataTest('product_sort_container').select('hilo')

      let priceArray = []

      cy.get('.inventory_item_price').each(price => {
        const prices = Number(price.text().substring(1))
        priceArray.push(prices)
        priceArray.sort(function (a, b) { return b - a });
        
      }).then(() => {
        
        console.log('max price: ', priceArray[0])
        cy.contains(`${priceArray[0]}`).next().click()

        cy.get('#shopping_cart_container').click()
        cy.url().should('contain', 'cart.html')

        cy.get('.inventory_item_price').invoke('text').then($cartPrice => {
          const cartPrice = Number($cartPrice.substring(1))
          expect(cartPrice).to.equal(priceArray[0])

        })

        cy.getDataTest('checkout').click()
        cy.url().should('include', 'checkout-step-one.html')

        cy.getDataTest('firstName').type(this.users.standard)
        cy.getDataTest('lastName').type(this.users.lastName)
        cy.getDataTest('postalCode').type(this.users.postalCode)

        cy.getDataTest('continue').click()
        cy.url().should('contain', 'checkout-step-two.html')

        cy.getDataTest('finish').click()
        cy.url().should('contain', 'checkout-complete.html')

        cy.get('#checkout_complete_container').invoke('text').then(text => {
          expect(text).to.contain('Your order has been dispatched')
        })
      })
    })
  })

  it(`Performance_glich user checkout with most expensive item`, function () {
    cy.get("@users").then((users) => {
      cy.login(users.performance, users.pass)

      cy.getDataTest('product_sort_container').select('hilo')

      let priceArray = []

      cy.get('.inventory_item_price').each(price => {
        const prices = Number(price.text().substring(1))
        priceArray.push(prices)

      }).then(() => {
        const maxPrice = priceArray.reduce((acc, price) => {
          if (acc > price)
            return acc
          else
            return price
        }, priceArray[0])
        console.log(maxPrice)

        cy.contains(`${maxPrice}`).next().click()

        cy.get('#shopping_cart_container').click()
        cy.url().should('contain', 'cart.html')

        cy.get('.inventory_item_price').invoke('text').then($cartPrice => {
          const cartPrice = Number($cartPrice.substring(1))
          expect(cartPrice).to.equal(maxPrice)
        })

        cy.getDataTest('checkout').click()
        cy.url().should('include', 'checkout-step-one.html')

        cy.getDataTest('firstName').type(this.users.performance)
        cy.getDataTest('lastName').type(this.users.lastName)
        cy.getDataTest('postalCode').type(this.users.postalCode)

        cy.getDataTest('continue').click()
        cy.url().should('contain', 'checkout-step-two.html')

        cy.getDataTest('finish').click()
        cy.url().should('contain', 'checkout-complete.html')

        cy.get('#checkout_complete_container').invoke('text').then(text => {
          expect(text).to.contain('Your order has been dispatched')
        })
      })
    })
  })

  it(`Standard user checkout with less expensive item`, function () {
    cy.get("@users").then((users) => {
      cy.login(users.standard, users.pass)

      cy.getDataTest('product_sort_container').select('lohi')

      let priceArray = []

      cy.get('.inventory_item_price').each(price => {
        const prices = Number(price.text().substring(1))
        priceArray.push(prices)
        priceArray.sort(function (a, b) { return a - b });
        console.log(priceArray)

      }).then(() => {

        cy.contains(`${priceArray[0]}`).next().click()

        cy.get('#shopping_cart_container').click()
        cy.url().should('contain', 'cart.html')

        cy.get('.inventory_item_price').invoke('text').then($cartPrice => {
          const cartPrice = Number($cartPrice.substring(1))
          expect(cartPrice).to.equal(priceArray[0])
        })

        cy.getDataTest('checkout').click()
        cy.url().should('include', 'checkout-step-one.html')

        cy.getDataTest('firstName').type(this.users.standard)
        cy.getDataTest('lastName').type(this.users.lastName)
        cy.getDataTest('postalCode').type(this.users.postalCode)

        cy.getDataTest('continue').click()
        cy.url().should('contain', 'checkout-step-two.html')

        cy.getDataTest('finish').click()
        cy.url().should('contain', 'checkout-complete.html')

        cy.get('#checkout_complete_container').invoke('text').then(text => {
          expect(text).to.contain('Your order has been dispatched')
        })
      })
    })
  })

  it(`Performance_glich user checkout with less expensive item`, function () {
    cy.get("@users").then((users) => {
      cy.login(users.performance, users.pass)

      cy.getDataTest('product_sort_container').select('lohi')

      let priceArray = []

      cy.get('.inventory_item_price').each(price => {
        const prices = Number(price.text().substring(1))
        priceArray.push(prices)
        priceArray.sort(function (a, b) { return a - b });

      }).then(() => {

        cy.contains(`${priceArray[0]}`).next().click()

        cy.get('#shopping_cart_container').click()
        cy.url().should('contain', 'cart.html')

        cy.get('.inventory_item_price').invoke('text').then($cartPrice => {
          const cartPrice = Number($cartPrice.substring(1))
          expect(cartPrice).to.equal(priceArray[0])
        })

        cy.getDataTest('checkout').click()
        cy.url().should('include', 'checkout-step-one.html')

        cy.getDataTest('firstName').type(this.users.performance)
        cy.getDataTest('lastName').type(this.users.lastName)
        cy.getDataTest('postalCode').type(this.users.postalCode)

        cy.getDataTest('continue').click()
        cy.url().should('contain', 'checkout-step-two.html')

        cy.getDataTest('finish').click()
        cy.url().should('contain', 'checkout-complete.html')

        cy.get('#checkout_complete_container').invoke('text').then(text => {
          expect(text).to.contain('Your order has been dispatched')
        })
      })
    })
  })

  after(() => {
    cy.get("@users").then((users) => {
      cy.login(users.standard, users.pass)

      cy.get('.bm-burger-button').click()
      cy.get('#logout_sidebar_link').click()
    })
  })

})