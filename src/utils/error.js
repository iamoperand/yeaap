import { trim, capitalize } from 'lodash';

const graphQLErrorPrefix = 'GraphQL error:';
const ifGraphQLError = (message) => message.includes(graphQLErrorPrefix);

export const getErrorMessage = (
  error,
  defaultMessage = 'There was some error'
) => {
  const { message } = error;

  if (ifGraphQLError(message)) {
    const concernedText = error.message.replace(graphQLErrorPrefix, '');
    const trimmedText = trim(concernedText);
    return capitalize(trimmedText);
  }

  return defaultMessage;
};
