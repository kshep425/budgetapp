/*global describe, it, expect, cy*/
/*eslint no-undef: "error"*/
describe("My First Test", function() {
    it("Visits the budget app", function() {
        cy.visit("http://localhost:3000")
        //cy.visit("https://example.cypress.io")
    })
})