/* eslint-disable no-console */
export function errorHandler(error: Error): void {
  if (error && error.toString) {
    console.error(error.toString());
  } else {
    console.error('Ops, something went wrong', error);
  }
}
