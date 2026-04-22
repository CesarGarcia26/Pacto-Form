// src/CeibaComponents/SaludVida/Step2V.jsx
import React, { useState, useEffect } from "react";
import styles from "../../CeibaComponents/SaludVida/StepsVCSS.module.css";
import { useAuth } from "../../../Context/authContext";
import { useEmpresasConfig } from "../../../Config/empresasConfig";
import ShowMessage from "../../../Config/ShowMessage";

const Step2V = ({ onPrevious, onNext, initialData = {} }) => {
  const { userInfo } = useAuth();
  const { getCoberturas, calcularCobertura, calcularValorAsegurado } =
    useEmpresasConfig();

  const [formData, setFormData] = useState({
    empresa: userInfo?.empresa || "",
    salario: "",
    coberturaVidaTier: "",
    ValorFinal_CyP: "",
  });

  const [coberturas, setCoberturas] = useState([]);
  const [requiereSalario, setRequiereSalario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detectar si la empresa es Ceiba o Pragma
  //son empresas con planes
  const esEmpresaPyC = (empresa) => {
    const e = empresa?.toLowerCase() || "";
    return (
      e.includes("pragma") ||
      e.includes("ceiba") ||
      e.includes("perceptio")||
      e.includes("pirani") ||
      e.includes("rolparts")||
      e.includes("gondwana")||
      e.includes("ayt umbria")||
      e.includes("gondwana servicios")||
      e.includes("maquel")||
      e.includes("acrrin")
    );
  };

  // Detectar si la empresa es Susanita
  const esEmpresaSusanita = (empresa) => {
    const e = empresa?.toLowerCase() || "";
    return e.includes("susanita");
  };

  const obtenerPlanesDisponibles = () => {
    const coberturaVida = coberturas.find((c) =>
      c.cobertura.toLowerCase().includes("vida")
    );

    if (!coberturaVida) return [];

    const letras = Object.keys(coberturaVida)
      .filter((key) => key.length === 1 && key.match(/[a-z]/i))
      .sort(); // orden alfabético

    return letras;
  };

  // Cargar coberturas
  useEffect(() => {
    let cancelado = false;

    const fetchCoberturas = async () => {
      try {
        const empresaActual = userInfo?.empresa || formData.empresa;

        const data = await getCoberturas(empresaActual);

        if (!cancelado) {
          setCoberturas(data);
          const algunaRequiereSalario = data.some((c) => c.requiereSalario);
          setRequiereSalario(algunaRequiereSalario);

          // Para Susanita, extraer automáticamente el valor de la cobertura "Vida"
          if (esEmpresaSusanita(empresaActual)) {
            const coberturaVida = data.find((c) =>
              c.cobertura.toLowerCase().includes("vida")
            );
            if (coberturaVida && coberturaVida.valorFijo) {
              setFormData((prev) => ({
                ...prev,
                coberturaVidaTier: "vida", // Identificador para Susanita
                ValorFinal_CyP: coberturaVida.valorFijo,
              }));
            }
          }
        }
      } catch (err) {
        console.error("Error al obtener coberturas");
        if (!cancelado)
          setError("No se pudieron cargar las coberturas. Intenta nuevamente.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    fetchCoberturas();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (Object.keys(initialData).length > 0) setFormData(initialData);
  }, [initialData]);

  const cleanNumber = (value) =>
    value ? Number(value.toString().replace(/\D/g, "")) : 0;

  // Formatear salario con puntos y limitar a 1 millón
  const handleSalarioChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // quitar todo menos números
    if (value === "") value = "0";

    let numericValue = parseInt(value, 10);
    if (numericValue > 1000000000) numericValue = 1000000000; // límite máximo

    const formattedValue = new Intl.NumberFormat("es-CO").format(numericValue);

    setFormData((prev) => ({
      ...prev,
      salario: formattedValue,
    }));
  };

  const obtenerValorPlan = (tier) => {
    const coberturasVida = coberturas.find((c) =>
      c.cobertura.toLowerCase().includes("vida")
    );

    if (!coberturasVida || !tier) return "Seleccione un plan";

    const valor = coberturasVida[tier.toLowerCase()];
    return valor ? `$${new Intl.NumberFormat("es-CO").format(valor)}` : "N/A";
  };

  // Función para obtener el valor monetario del plan seleccionado
  const obtenerValorMonetarioPlan = (tier) => {
    const coberturasVida = coberturas.find((c) =>
      c.cobertura.toLowerCase().includes("vida")
    );

    if (!coberturasVida || !tier) return 0;

    const valor = coberturasVida[tier.toLowerCase()];
    return valor || 0;
  };

  const calcularValor = () => {
    let total = 0;
    const salario = cleanNumber(formData.salario);

    if (esEmpresaPyC(formData.empresa)) {
      const tier = formData.coberturaVidaTier?.toLowerCase();

      coberturas.forEach((c) => {
        if (c.valorFijo !== null && c.valorFijo !== undefined) {
          total += c.valorFijo;
        } else if (tier && c[tier] !== null && c[tier] !== undefined) {
          total += c[tier];
        }
      });
      return total;
    }

    if (formData.empresa.toLowerCase().includes("nuvant")) {
      coberturas.forEach((c) => {
        if (c.valorFijo) total += c.valorFijo;
        else if (c.multiplicador && salario) total += salario * c.multiplicador;
      });
      return total;
    }

    return calcularValorAsegurado(coberturas, salario, {
      selectedTier: formData.coberturaVidaTier,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (esEmpresaPyC(formData.empresa) && !formData.coberturaVidaTier) {
      ShowMessage("alerta", "Por favor seleccione un tipo de plan");
      return;
    }

    // Para Ceiba, Pragma y Susanita, usar el valor almacenado en ValorFinal_CyP
    const valorFinal = (esEmpresaPyC(formData.empresa) || esEmpresaSusanita(formData.empresa))
      ? String(formData.ValorFinal_CyP || obtenerValorMonetarioPlan(formData.coberturaVidaTier))
      : "0";

    const dataToSend = {
      ...formData,
      valorFinal_CyP: valorFinal,
      salario: cleanNumber(formData.salario),
      valorAseguradoTotal: calcularValor(),

    };

    onNext(dataToSend);
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    onPrevious({
      ...formData,
      salario: cleanNumber(formData.salario),
      valorAseguradoTotal: calcularValor(),
    });
  };

  if (loading)
    return (
      <div className={styles.formCard}>
        <p className={styles.loadingText}>Cargando coberturas...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.formCard}>
        <div
          style={{
            padding: "20px",
            backgroundColor: "#ffebee",
            borderRadius: "8px",
            color: "#c62828",
          }}
        >
          <h3>Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.submitButton}
            style={{ marginTop: "10px" }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>
        Información del seguro - {formData.empresa}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Empresa</label>
          <input
            type="text"
            value={formData.empresa}
            disabled
            className={styles.input}
            style={{
              backgroundColor: "#f5f5f5",
              color: "#1976d2",
              fontWeight: "bold",
            }}
          />
        </div>

        {/* Campo de salario con formato y límite */}
        {requiereSalario && (
          <div className={styles.formGroup}>
            <label htmlFor="salario">Salario mensual *</label>
            <input
              id="salario"
              type="text"
              placeholder="Ingrese su salario"
              value={formData.salario}
              onChange={handleSalarioChange}
              className={styles.input}
              required
            />
          </div>
        )}

        {/* Selector de plan */}
        {esEmpresaPyC(formData.empresa) && (
          <div className={styles.formGroup}>
            <label htmlFor="coberturaVidaTier">
              ¿A qué tipo de plan desea acceder? *
            </label>
            <select
              id="coberturaVidaTier"
              value={formData.coberturaVidaTier}
              onChange={(e) => {
                const tierSeleccionado = e.target.value;
                const valorMonetario = obtenerValorMonetarioPlan(tierSeleccionado);
                setFormData((prev) => ({
                  ...prev,
                  coberturaVidaTier: tierSeleccionado,
                  ValorFinal_CyP: valorMonetario,
                }));
              }}
              className={styles.input}
              required
            >
              <option value="">Seleccione un plan</option>

              {obtenerPlanesDisponibles().map((letra) => (
                <option key={letra} value={letra}>
                  Plan {letra.toUpperCase()} - {obtenerValorPlan(letra)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Coberturas dinámicas */}
        <div className={styles.coberturas}>
          <h4 className={styles.sectionSubtitle}>
            Coberturas disponibles
            {formData.coberturaVidaTier
              ? ` - Plan ${formData.coberturaVidaTier.toUpperCase()}`
              : ""}
          </h4>

          {coberturas.length > 0 ? (
            coberturas.map((cobertura) => {
              let valor = 0;
              const salario = cleanNumber(formData.salario);

              if (formData.empresa.toLowerCase().includes("nuvant")) {
                if (cobertura.valorFijo) valor = cobertura.valorFijo;
                else if (cobertura.multiplicador && salario)
                  valor = salario * cobertura.multiplicador;
              } else if (esEmpresaPyC(formData.empresa)) {
                if (cobertura.valorFijo) valor = cobertura.valorFijo;
                else {
                  const tier = formData.coberturaVidaTier?.toLowerCase();
                  if (tier && cobertura[tier]) valor = cobertura[tier];
                }
              } else {
                valor = calcularCobertura(cobertura, salario, {
                  selectedTier: formData.coberturaVidaTier,
                });
              }

              return (
                <div key={cobertura.id} className={styles.coberturaRow}>
                  <label className={styles.checkboxLabel}>
                    {cobertura.cobertura}
                  </label>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontWeight: "bold",
                      color: valor > 0 ? "#1976d2" : "#999",
                    }}
                  >
                    {valor > 0
                      ? `${new Intl.NumberFormat("es-CO").format(valor)}`
                      : "N/A"}
                  </span>
                </div>
              );
            })
          ) : (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              No hay coberturas disponibles para esta empresa.
            </p>
          )}
        </div>

        <div className={styles.divider}></div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={handlePrevious}
          >
            ← Preguntas anteriores
          </button>
          <button type="submit" className={styles.submitButton}>
            Siguientes preguntas →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2V;
