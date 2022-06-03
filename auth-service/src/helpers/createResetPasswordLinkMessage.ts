const createResetPasswordLinkMessage = ({
  url,
  token,
}: {
  url: string;
  token: string;
}) => {
  const link = `${url}/reset-password?token=${token}`;

  return `
    You have started reset password link process. Please follow link to continue.
    
    <a href="${link}">Reset password link</a>
    `;
};

export { createResetPasswordLinkMessage };
