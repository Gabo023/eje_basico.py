import { useMemo, useState } from "react";

const TERM_OPTIONS = [
    { months: 3, rate: 5 },
    { months: 6, rate: 6.5 },
    { months: 9, rate: 7 },
    { months: 12, rate: 8 },
    { months: 24, rate: 9 },
];

const WITHHOLDING_RATE = 2;

const initialForm = {
    clientName: "",
    identification: "",
    amount: "",
    termMonths: "12",
    startDate: getToday(),
};

export default function PolicySimulatorPage() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);

    const selectedTerm = useMemo(() => {
        return TERM_OPTIONS.find(
            (option) => option.months === Number(form.termMonths)
        );
    }, [form.termMonths]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            [name]: "",
        }));

        setResult(null);
    }

    function validateForm() {
        const nextErrors = {};
        const amount = Number(form.amount);

        if (!form.clientName.trim()) {
            nextErrors.clientName = "Ingresa el nombre del cliente.";
        }

        if (!form.identification.trim()) {
            nextErrors.identification = "Ingresa la identificación.";
        }

        if (!form.amount) {
            nextErrors.amount = "Ingresa el monto de inversión.";
        } else if (Number.isNaN(amount) || amount <= 0) {
            nextErrors.amount = "El monto debe ser mayor que cero.";
        } else if (amount < 100) {
            nextErrors.amount = "El monto mínimo para simular es $100.";
        }

        if (!form.termMonths) {
            nextErrors.termMonths = "Selecciona un plazo.";
        }

        if (!form.startDate) {
            nextErrors.startDate = "Selecciona la fecha de inicio.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const amount = Number(form.amount);
        const termMonths = Number(form.termMonths);
        const annualRate = selectedTerm?.rate ?? 0;

        const grossInterest =
            amount * (annualRate / 100) * (termMonths / 12);

        const withholding =
            grossInterest * (WITHHOLDING_RATE / 100);

        const netProfit = grossInterest - withholding;
        const finalAmount = amount + netProfit;

        const maturityDate = addMonths(
            form.startDate,
            termMonths
        );

        setResult({
            clientName: form.clientName.trim(),
            identification: form.identification.trim(),
            amount,
            termMonths,
            annualRate,
            grossInterest,
            withholding,
            netProfit,
            finalAmount,
            startDate: form.startDate,
            maturityDate,
        });
    }

    function handleReset() {
        setForm(initialForm);
        setErrors({});
        setResult(null);
    }

    return (
        <section className="page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">
                        Inversiones
                    </span>

                    <h1>Simulador de póliza</h1>

                    <p>
                        Calcula el rendimiento estimado de una
                        póliza de inversión.
                    </p>
                </div>
            </div>

            <div className="policy-simulator-grid">
                <div className="content-card">
                    <form
                        className="policy-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-section-header">
                            <div>
                                <h2>Datos de la simulación</h2>
                                <p>
                                    Completa la información para calcular
                                    el rendimiento.
                                </p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="clientName">
                                    Nombre del cliente
                                </label>

                                <input
                                    id="clientName"
                                    name="clientName"
                                    type="text"
                                    value={form.clientName}
                                    onChange={handleChange}
                                    placeholder="Ej. Gabriel Lascano"
                                />

                                {errors.clientName && (
                                    <small className="field-error">
                                        {errors.clientName}
                                    </small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="identification">
                                    Identificación
                                </label>

                                <input
                                    id="identification"
                                    name="identification"
                                    type="text"
                                    value={form.identification}
                                    onChange={handleChange}
                                    placeholder="Cédula o RUC"
                                />

                                {errors.identification && (
                                    <small className="field-error">
                                        {errors.identification}
                                    </small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="amount">
                                    Monto a invertir
                                </label>

                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    min="100"
                                    step="0.01"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="10000.00"
                                />

                                {errors.amount && (
                                    <small className="field-error">
                                        {errors.amount}
                                    </small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="termMonths">
                                    Plazo
                                </label>

                                <select
                                    id="termMonths"
                                    name="termMonths"
                                    value={form.termMonths}
                                    onChange={handleChange}
                                >
                                    {TERM_OPTIONS.map((option) => (
                                        <option
                                            key={option.months}
                                            value={option.months}
                                        >
                                            {option.months} meses —{" "}
                                            {formatPercentage(option.rate)}
                                        </option>
                                    ))}
                                </select>

                                {errors.termMonths && (
                                    <small className="field-error">
                                        {errors.termMonths}
                                    </small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="startDate">
                                    Fecha de inicio
                                </label>

                                <input
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    value={form.startDate}
                                    onChange={handleChange}
                                />

                                {errors.startDate && (
                                    <small className="field-error">
                                        {errors.startDate}
                                    </small>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Tasa anual aplicada</label>

                                <div className="rate-display">
                                    {formatPercentage(
                                        selectedTerm?.rate ?? 0
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="simulation-note">
                            El cálculo utiliza interés simple y una
                            retención simulada del{" "}
                            {formatPercentage(WITHHOLDING_RATE)} sobre
                            el interés generado.
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="button button-secondary"
                                onClick={handleReset}
                            >
                                Limpiar
                            </button>

                            <button
                                type="submit"
                                className="button button-primary"
                            >
                                Simular póliza
                            </button>
                        </div>
                    </form>
                </div>

                <div className="content-card policy-result-card">
                    {!result ? (
                        <div className="simulation-empty">
                            <div className="simulation-empty-icon">
                                $
                            </div>

                            <h2>Resultado de la simulación</h2>

                            <p>
                                Completa el formulario y presiona
                                “Simular póliza”.
                            </p>
                        </div>
                    ) : (
                        <div className="simulation-result">
                            <div className="result-header">
                                <div>
                                    <span className="result-label">
                                        Monto final estimado
                                    </span>

                                    <strong className="result-total">
                                        {formatCurrency(result.finalAmount)}
                                    </strong>
                                </div>

                                <span className="result-badge">
                                    Simulación
                                </span>
                            </div>

                            <div className="result-client">
                                <strong>{result.clientName}</strong>
                                <span>{result.identification}</span>
                            </div>

                            <div className="result-summary-grid">
                                <ResultItem
                                    label="Monto invertido"
                                    value={formatCurrency(result.amount)}
                                />

                                <ResultItem
                                    label="Plazo"
                                    value={`${result.termMonths} meses`}
                                />

                                <ResultItem
                                    label="Tasa anual"
                                    value={formatPercentage(
                                        result.annualRate
                                    )}
                                />

                                <ResultItem
                                    label="Interés bruto"
                                    value={formatCurrency(
                                        result.grossInterest
                                    )}
                                />

                                <ResultItem
                                    label="Retención"
                                    value={formatCurrency(
                                        result.withholding
                                    )}
                                />

                                <ResultItem
                                    label="Ganancia neta"
                                    value={formatCurrency(
                                        result.netProfit
                                    )}
                                    highlighted
                                />
                            </div>

                            <div className="result-dates">
                                <div>
                                    <span>Fecha de inicio</span>
                                    <strong>
                                        {formatDate(result.startDate)}
                                    </strong>
                                </div>

                                <div>
                                    <span>Fecha de vencimiento</span>
                                    <strong>
                                        {formatDate(result.maturityDate)}
                                    </strong>
                                </div>
                            </div>

                            <div className="result-disclaimer">
                                Este resultado es una simulación
                                referencial y no representa una oferta
                                financiera real.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function ResultItem({
    label,
    value,
    highlighted = false,
}) {
    return (
        <div
            className={`result-item ${highlighted ? "result-item-highlighted" : ""
                }`}
        >
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function getToday() {
    const today = new Date();
    const timezoneOffset =
        today.getTimezoneOffset() * 60000;

    return new Date(today.getTime() - timezoneOffset)
        .toISOString()
        .split("T")[0];
}

function addMonths(dateString, months) {
    const date = new Date(`${dateString}T00:00:00`);

    const originalDay = date.getDate();

    date.setDate(1);
    date.setMonth(date.getMonth() + months);

    const lastDayOfTargetMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();

    date.setDate(
        Math.min(originalDay, lastDayOfTargetMonth)
    );

    return date.toISOString().split("T")[0];
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(value);
}

function formatPercentage(value) {
    return `${Number(value).toFixed(2)}%`;
}

function formatDate(dateString) {
    return new Intl.DateTimeFormat("es-EC", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        timeZone: "UTC",
    }).format(new Date(`${dateString}T00:00:00Z`));
}