describe("Color Button List", () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })
    it("Renders 12 buttons on the screen", () => {
        cy.get("#color-button-unordered-list").find('.color-button').its('length').should('eq', 12)
    }),
    it("Renders all buttons text", () => {
        cy.fixture('colorList').as('colorList').then((colorList) => {
            colorList["colorList"].forEach(color => {
                cy.get(`#color-button-${color.name.replace(/\s+/g, '-').toLowerCase()}`).find('span').should('have.text', `${color.name}`)
            })
        })
    })
    it("Renders all button images", () => {
        cy.fixture('colorList').as('colorList').then((colorList) => {
            colorList["colorList"].forEach(color => {
                cy.get(`#color-button-${color.name.replace(/\s+/g, '-').toLowerCase()}`).find('img').should('be.visible')
            })
        })
    })
})