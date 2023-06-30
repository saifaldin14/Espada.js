import cleanup from "rollup-plugin-cleanup";
import filesize from "rollup-plugin-filesize";
export default {
  input: "src/index.ts",
  plugins: [cleanup()],
  output: [
    {
      file: "dist/espada.ts",
      format: "esm",
      plugins: [filesize()],
    },
  ],
};
