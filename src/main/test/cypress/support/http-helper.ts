export const testHttpCallsCount = (count: number): void => {
  cy.get('@loginRequest.all').should('have.length', count);
};

export const testUrl = (path: string): void => {
  const baseUrl: string = Cypress.config().baseUrl;
  cy.url().should('eq', `${baseUrl}${path}`);
};
