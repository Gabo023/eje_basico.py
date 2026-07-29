import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    createClient,
    getClientById,
    updateClient,
} from "../services/clientService.js";

const initialForm = {
    identification: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    hasPendingObligations: false,
    status: "ACTIVE",
};

export default function ClientFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isEditing) {
            return;
        }

        async function loadClient() {
            try {
                setLoading(true);
                setError("");

                const response = await getClientById(id);

                const client = response.data ?? response;

                setForm({
                    identification: client.identification ?? "",
                    firstName: client.firstName ?? "",
                    lastName: client.lastName ?? "",
                    email: client.email ?? "",
                    phone: client.phone ?? "",
                    address: client.address ?? "",
                    hasPendingObligations:
                        client.hasPendingObligations ?? false,
                    status: client.status ?? "ACTIVE",
                });
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadClient();
    }, [id, isEditing]);

    function handleChange(event) {
        const { name, value, type, checked } =
            event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function validateForm() {
        if (!form.identification.trim()) {
            return "La identificación es obligatoria";
        }

        if (!form.firstName.trim()) {
            return "Los nombres son obligatorios";
        }

        if (!form.lastName.trim()) {
            return "Los apellidos son obligatorios";
        }

        if (!form.email.trim()) {
            return "El correo electrónico es obligatorio";
        }

        if (!form.email.includes("@")) {
            return "Ingresa un correo electrónico válido";
        }

        return "";
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                identification: form.identification.trim(),
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                hasPendingObligations:
                    form.hasPendingObligations,
                status: form.status,
            };

            if (isEditing) {
                await updateClient(id, payload);
            } else {
                await createClient(payload);
            }

            navigate("/clients", {
                replace: true,
                state: {
                    successMessage: isEditing
                        ? "Cliente actualizado correctamente"
                        : "Cliente creado correctamente",
                },
            });
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <section className="page">
                <div className="content-card">
                    <p>Cargando información del cliente...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">
                        Gestión de clientes
                    </span>

                    <h1>
                        {isEditing
                            ? "Editar cliente"
                            : "Nuevo cliente"}
                    </h1>

                    <p>
                        Completa la información personal y comercial
                        del cliente.
                    </p>
                </div>

                <Link
                    to="/clients"
                    className="button button-secondary"
                >
                    Volver
                </Link>
            </div>

            <form
                className="content-card client-form"
                onSubmit={handleSubmit}
            >
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <div className="form-section">
                    <div className="form-section-header">
                        <h2>Información personal</h2>
                        <p>
                            Datos principales para identificar al
                            cliente.
                        </p>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="identification">
                                Identificación *
                            </label>

                            <input
                                id="identification"
                                name="identification"
                                type="text"
                                value={form.identification}
                                onChange={handleChange}
                                placeholder="Ej. 1712345678"
                                maxLength={20}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="firstName">
                                Nombres *
                            </label>

                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="Ej. Carlos Andrés"
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">
                                Apellidos *
                            </label>

                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Ej. Mendoza López"
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                Correo electrónico *
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="cliente@correo.com"
                                maxLength={150}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">
                                Teléfono
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Ej. 0999999999"
                                maxLength={30}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">
                                Estado
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="ACTIVE">
                                    Activo
                                </option>

                                <option value="INACTIVE">
                                    Inactivo
                                </option>
                            </select>
                        </div>

                        <div className="form-group form-group-full">
                            <label htmlFor="address">
                                Dirección
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Dirección del cliente"
                                rows={3}
                                maxLength={250}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="form-section-header">
                        <h2>Información financiera</h2>
                        <p>
                            Esta condición podrá utilizarse para
                            validar futuras renovaciones.
                        </p>
                    </div>

                    <label className="checkbox-card">
                        <input
                            name="hasPendingObligations"
                            type="checkbox"
                            checked={form.hasPendingObligations}
                            onChange={handleChange}
                        />

                        <span>
                            <strong>
                                Tiene obligaciones pendientes
                            </strong>

                            <small>
                                El cliente registra obligaciones
                                financieras pendientes.
                            </small>
                        </span>
                    </label>
                </div>

                <div className="form-actions">
                    <Link
                        to="/clients"
                        className="button button-secondary"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        className="button button-primary"
                        disabled={saving}
                    >
                        {saving
                            ? "Guardando..."
                            : isEditing
                                ? "Actualizar cliente"
                                : "Guardar cliente"}
                    </button>
                </div>
            </form>
        </section>
    );
}