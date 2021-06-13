export const colors = [
  { name: "blue", bg: "#0074d9" },
  { name: "navy", bg: "#001f3f" },
  { name: "lime", bg: "#01ff70" },
  { name: "teal", bg: "#39cccc" },
  { name: "olive", bg: "#3d9970" },
  { name: "fuchsia", bg: "#f012be" },
  { name: "red", bg: "#ff4136" },
  { name: "green", bg: "#2ecc40" },
  { name: "orange", bg: "#ff851b" },
  { name: "maroon", bg: "#85144b" },
  { name: "purple", bg: "#b10dc9" },
  { name: "yellow", bg: "#ffdc00" },
  { name: "aqua", bg: "#7fdbff" },
];

export const hashString = (str) => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }

  return hash > 0 ? hash : -hash;
};