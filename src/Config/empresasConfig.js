import { useCoberturasService } from "../Services/CoverturasService";

export const useEmpresasConfig = () => {
  const {
    getCoberturasPyC,
    getCoberturasSusanita,
    getCoberturasNuvant,
    getCoberturasPirani,
    getCoberturasRolparts,
    getCoberturasGondwana,
    getCoberturasMaquel,
    getCoberturasAcrrin
  } = useCoberturasService();

  const getCoberturas = async (empresa) => {
    if (!empresa) return [];

    try {
      const empresaLower = empresa.toLowerCase();

      // 🔹 PRAGMA / CEIBA / PERCEPTIO
      if (
        empresaLower.includes("pragma") ||
        empresaLower.includes("ceiba") ||
        empresaLower.includes("perceptio")
      ) {
        return await getCoberturasPyC();
      }

      // 🔹 SUSANITA
      if (empresaLower.includes("susanita")) {
        return await getCoberturasSusanita();
      }

      // 🔹 NUVANT
      if (empresaLower.includes("nuvant")) {
        return await getCoberturasNuvant();
      }

      // 🔹 PIRANI
      if (empresaLower.includes("pirani")) {
        return await getCoberturasPirani();
      }

      // 🔹 ROLPARTS
      if (empresaLower.includes("rolparts")) {
        return await getCoberturasRolparts();
      }

      // 🔥 GONDWANA / AYT UMBRIA / GONDWANA SERVICIOS
      if (
        empresaLower.includes("gondwana") ||
        empresaLower.includes("ayt umbria") ||
        empresaLower.includes("gondwana servicios")
      ) {
        return await getCoberturasGondwana();
      }

      // 🔥 MAQUEL
      if (empresaLower.includes("maquel")) {
        return await getCoberturasMaquel();
      }

      // ACRRIN
      if (empresaLower.includes("acrrin")) {
        return await getCoberturasAcrrin();
      }

      return [];
    } catch (error) {
      console.error("Error obteniendo coberturas:", error);
      return [];
    }
  };

  const calcularCobertura = (cobertura, salario, { selectedTier }) => {
    if (!cobertura) return 0;

    if (cobertura.valorFijo) return cobertura.valorFijo;

    if (cobertura.multiplicador && salario)
      return salario * cobertura.multiplicador;

    if (selectedTier && cobertura[selectedTier])
      return cobertura[selectedTier];

    return 0;
  };

  const calcularValorAsegurado = (coberturas, salario, { selectedTier }) => {
    return coberturas.reduce(
      (total, c) => total + calcularCobertura(c, salario, { selectedTier }),
      0
    );
  };

  const empresaUsaTiers = (coberturas) =>
    coberturas.some((c) => c.usaTiers === true);

  const empresaRequiereSalario = (coberturas) =>
    coberturas.some((c) => c.requiereSalario === true);

  return {
    getCoberturas,
    calcularCobertura,
    calcularValorAsegurado,
    empresaUsaTiers,
    empresaRequiereSalario,
  };
};
