import { trim, capitalize } from 'lodash';

const ifGraphQLError = (message) => message.includes('GraphQL error:');

export const getErrorMessage = (error) => {
  const { message } = error;
  if (ifGraphQLError(message)) {
    const concernedText = error.message.replace(/GraphQL error:/i, '');
    const trimmedText = trim(concernedText);
    return capitalize(trimmedText);
  }
  return 'Something failed. Please try again!';
};
