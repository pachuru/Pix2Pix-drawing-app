describe("Color Button List", () => {
    it("Renders 12 buttons on the screen", () => {
        cy.visit('http://localhost:3000')
        cy.waitForReact();
        cy.get("#color-button-unordered-list").find('.color-button').its('length').should('eq', 12)
    })
})