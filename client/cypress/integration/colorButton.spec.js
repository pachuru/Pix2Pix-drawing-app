describe("Color Button", () => {
    it("Renders on the screen", () => {
        cy.visit('http://localhost:3000')
        cy.get('.color-button').should('exist')
    }),
    it("Changes the app state", () => {
        cy.waitForReact();
        cy.react('App', {selectedColor:'#00aaff'})
    })
})