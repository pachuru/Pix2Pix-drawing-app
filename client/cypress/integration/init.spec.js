describe('Cypress', () => {
    it('is working', () => {
        expect(true).to.equal(true)
        cy.visit('http://localhost:3000')
    })
})