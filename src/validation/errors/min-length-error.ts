export class MinLengthError extends Error {
  constructor(private readonly minLenght) {
    super(`Minimo ${minLenght} caracter${minLenght > 1 ? 's' : ''}`);
  }
}
