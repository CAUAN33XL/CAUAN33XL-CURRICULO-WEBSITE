import QRCode from "qrcode";

async function main() {
  const url = await QRCode.toDataURL("https://example.com");
  console.log(url.slice(0, 50));
}
main();
