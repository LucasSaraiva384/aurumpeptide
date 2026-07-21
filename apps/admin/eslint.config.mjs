// eslint-config-next@16 exporta um flat config nativo (array), sem precisar
// de FlatCompat/nomes legados ("next/core-web-vitals") — usar isso direto
// evita um bug de referência circular ao carregar o preset via FlatCompat
// nesta combinação de versões (eslint 9 + eslint-config-next 16).
import nextConfig from "eslint-config-next";

const eslintConfig = [...nextConfig];

export default eslintConfig;
