export function getRandomColor() {
  // Generate a random number between 0 and 16777215 (FFFFFF in hexadecimal)
  let randomColor = Math.floor(Math.random() * 16777215);

  // Convert the decimal number to a hexadecimal string and prepend "#" to it
  let color = "#" + randomColor.toString(16);

  // Add leading zeros to make sure the string has 6 digits
  color = color.padEnd(7, "0");

  return color;
}