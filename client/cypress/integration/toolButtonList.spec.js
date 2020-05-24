describe("Tool Button List", () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })
    
    it("Renders 4 tool list", () => {
        cy.get(".tool-button-unordered-list").its('length').should('eq', 4)
    })

    describe("First list", () => {
        it("Renders 5 buttons in the first list", () => {
            cy.get(".tool-button-unordered-list").eq(0).find('li').should('have.length', 5)
        })
        it("Renders an icon for every one of them", () => {
            for(let i = 0; i < 5; i++)
                cy.get(".tool-button-unordered-list").eq(0).find('li').eq(i).find('img').should('be.visible')
        })  
        it("Loads the correct icons", () => {
            let index = 0;
            cy.fixture('toolList_1').as('toolList').then((toolList) => {
                toolList["toolList"].forEach(tool => {
                    cy.get(".tool-button-unordered-list").eq(0).find('li').eq(index).find('img').invoke('attr', 'src').should('contain', `${tool.name}`)
                    index += 1
                })
            })
        })
    })

    describe("Second list", () => {
        it("Renders 5 buttons in the second list", () => {
            cy.get(".tool-button-unordered-list").eq(1).find('li').should('have.length', 5)
        })
        it("Renders an icon for every one of them", () => {
            for(let i = 0; i < 5; i++)
                cy.get(".tool-button-unordered-list").eq(1).find('li').eq(i).find('img').should('be.visible')
        })  
        it("Loads the correct icons", () => {
            let index = 0;
            cy.fixture('toolList_2').as('toolList').then((toolList) => {
                toolList["toolList"].forEach(tool => {
                    cy.get(".tool-button-unordered-list").eq(1).find('li').eq(index).find('img').invoke('attr', 'src').should('contain', `${tool.name}`)
                    index += 1
                })
            })
        })
    })

    describe("Third list", () => {
        it("Renders 1 button in the second list", () => {
            cy.get(".tool-button-unordered-list").eq(2).find('li').should('have.length', 1)
        })
        it("Renders an icon for every it", () => {
            cy.get(".tool-button-unordered-list").eq(2).find('li').eq(0).find('img').should('be.visible')
        })  
        it("Loads the correct icon", () => {
            cy.get(".tool-button-unordered-list").eq(2).find('li').eq(0).find('img').invoke('attr', 'src').should('contain', 'convert')
        })
    })

    describe("Fourth list", () => {
        it("Renders 1 button in the second list", () => {
            cy.get(".tool-button-unordered-list").eq(3).find('li').should('have.length', 1)
        })
        it("Renders an icon for every it", () => {
            cy.get(".tool-button-unordered-list").eq(3).find('li').eq(0).find('img').should('be.visible')
        })  
        it("Loads the correct icon", () => {
            cy.get(".tool-button-unordered-list").eq(3).find('li').eq(0).find('img').invoke('attr', 'src').should('contain', 'save')
        })
    })

    


})