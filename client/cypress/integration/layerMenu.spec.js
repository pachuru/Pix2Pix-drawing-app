describe("Layer Menu", () => {

    describe("Add Layer Button", () => {
        before(() => {
            cy.visit('http://localhost:3000')
        })

        it("Should render", () => {
            cy.get("#layer-menu-wrapper").find("#add-layer-button-wrapper").should('exist')
        })
        it("Should have text ADD LAYER", () => {
            cy.get("#layer-menu-wrapper").find("#add-layer-button-wrapper").find("#add-layer-text").should('have.text', 'ADD LAYER')
        })
        it("Should have a visible icon", () => {
            cy.get("#layer-menu-wrapper").find("#add-layer-button-wrapper").find("#add-layer-icon").should('be.visible')

        })
        it("Should load the correct icon", () => {
            cy.get("#layer-menu-wrapper").find("#add-layer-button-wrapper").find("#add-layer-icon").invoke('attr', 'src').should('contain', 'add')
        })
        it("Should add a new layer", () => {
            cy.get("#layer-menu-wrapper").find("#add-layer-button-wrapper").find("#add-layer-button").click()
            cy.get("#new-layer-form").find("#new-layer-input-text").type("Cypress Layer")
            cy.get('#new-layer-form').find("#new-layer-input-button").click()
            cy.get("#layer-menu-wrapper").find(".layer-input-text").invoke('attr', 'value').should('contain', 'Cypress Layer').should('exist')
        })
    })

    describe("Layer Button", () => {

        before(() => {
            cy.visit('http://localhost:3000')
            cy.get("#layer-menu-wrapper").find("#add-layer-button-wrapper").find("#add-layer-button").click()
            cy.get("#new-layer-form").find("#new-layer-input-text").type("Cypress Layer")
            cy.get('#new-layer-form').find("#new-layer-input-button").click()
        })

        it("Should display a text", () => {
            cy.get("#layer-menu-wrapper").find(".layer-input-text").invoke('attr', 'value').should('contain', 'Cypress Layer')
        })

        it("Should change the text", () => {
            cy.get("#layer-menu-wrapper").find(".layer-input-text").clear()
            cy.get("#layer-menu-wrapper").find(".layer-input-text").type('Changed Cypress Layer')
            cy.get("#layer-menu-wrapper").find(".layer-input-text").invoke('attr', 'value').should('contain', 'Changed Cypress Layer')
        })

        it("Should render a hide image icon and load the correct file", () => {
            cy.get("#layer-menu-wrapper").find(".hide-layer-icon").should('be.visible')
            cy.get("#layer-menu-wrapper").find(".hide-layer-icon").invoke('attr', 'src').should('contain', 'hide')
        })

        it("Should render a delete image icon and load the correct file", () => {
            cy.get("#layer-menu-wrapper").find(".delete-layer-icon").should('be.visible')
            cy.get("#layer-menu-wrapper").find(".delete-layer-icon").invoke('attr', 'src').should('contain', 'remove')
        })

        it("Should render an up image icon and load the correct file", () => {
            cy.get("#layer-menu-wrapper").find(".up-layer-icon").should('be.visible')
            cy.get("#layer-menu-wrapper").find(".up-layer-icon").invoke('attr', 'src').should('contain', 'up')
        })

        it("Should render a down image icon and load the correct file", () => {
            cy.get("#layer-menu-wrapper").find(".down-layer-icon").should('be.visible')
            cy.get("#layer-menu-wrapper").find(".down-layer-icon").invoke('attr', 'src').should('contain', 'down')
        })
    })
})