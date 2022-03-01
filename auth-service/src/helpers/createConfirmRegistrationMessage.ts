const createConfirmRegistrationMessage = ({ link }: { link: string }) => {
  return `
    You have started registration process. Please follow link to continue registration process
    
    <a href="${link}">Confirm link</a>
    `;
};

export { createConfirmRegistrationMessage };
