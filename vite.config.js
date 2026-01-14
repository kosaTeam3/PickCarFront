const path = require("node:path");
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react-swc").default;

module.exports = defineConfig(() => {
    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
    };
});
