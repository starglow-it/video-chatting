enum TokenTypes {
    Confirm = 'confirm',
    Access = 'access',
    Refresh = 'refresh',
    Reset = 'reset',
    ResetPassword = 'reset_password',
}

const TokenTypesValues = Object.values(TokenTypes);

export {
    TokenTypes,
    TokenTypesValues
};