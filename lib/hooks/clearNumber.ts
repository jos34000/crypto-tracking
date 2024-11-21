const clearNumber = (num: string): string => {
  let prix = num
    .toLocaleString()
    .replace(".", ",")
    .replace(/(,)(\d*?)0+$/, "$1$2")
    .replace(/,$/, "");
  return prix;
};
export default clearNumber;
let ok = "ok";
ok = ok.toLocaleString();
