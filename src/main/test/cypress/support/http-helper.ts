export const testHttpCallsCount = (count: number, mockName: string): void => {
  cy.get(mockName).should('have.length', count);
};

export const testUrl = (path: string): void => {
  const baseUrl: string = Cypress.config().baseUrl;
  cy.url().should('eq', `${baseUrl}${path}`);
};
