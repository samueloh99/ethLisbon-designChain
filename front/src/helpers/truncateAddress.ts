// utils/truncateAddress.ts
const truncateAddress = (address: string, chars = 4): string => {
  const prefix = address.slice(0, chars + 2); // Keep the '0x' and the first few characters
  const suffix = address.slice(-chars);

  return `${prefix}...${suffix}`;
};

export default truncateAddress;
