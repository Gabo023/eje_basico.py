import { useEffect, useMemo, useState } from "react";
import {
    Link,
    useLocation,
} from "react-router-dom";

import {
    deleteClient,
    getClients,
} from "../services/clientService.js";

export default function ClientsPage() {
    const location = useLocation();

    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(
        location.state?.successMessage || ""
    );

    async function loadClients() {
        try {
            setLoading(true);
            setError("");

            const response = await getClients();

            const data =
                response.data ??
                response.clients ??
                response;

            setClients(Array.isArray(data) ? data : []);
        } catch (requestError) {
            setError(requestError.message);
            setClients([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadClients();
    }, []);

    useEffect(() => {
        if (!successMessage) {
            return;
        }

        const timeout = setTimeout(() => {
            setSuccessMessage("");
        }, 4000);

        return () => clearTimeout(timeout);
    }, [successMessage]);

    const filteredClients = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        if (!normalizedSearch) {
            return clients;
        }

        return clients.filter((client) => {
            const searchableText = [
                client.identification,
                client.firstName,
                client.lastName,
                client.email,
                client.phone,
                client.status,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedSearch);
        });
    }, [clients, search]);

    async function handleDelete(client) {
        const fullName = [
            client.firstName,
            client.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        const confirmed = window.confirm(
            `¿Estás seguro de eliminar al cliente ${fullName || client.identification || ""
            }?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(client.id);
            setError("");
            setSuccessMessage("");

            await deleteClient(client.id);

            setClients((currentClients) =>
                currentClients.filter(
                    (currentClient) =>
                        currentClient.id !== client.id
                )
            );

            setSuccessMessage(
                "Cliente eliminado correctamente"
            );
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <section className="page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">
                        Administración
                    </span>

                    <h1>Clientes</h1>

                    <p>
                        Consulta y administra los clientes
                        registrados.
                    </p>
                </div>

                <Link
                    to="/clients/new"
                    className="button button-primary"
                >
                    + Nuevo cliente
                </Link>
            </div>

            {successMessage && (
                <div className="alert alert-success">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div className="content-card">
                <div className="clients-toolbar">
                    <div className="search-field">
                        <label htmlFor="client-search">
                            Buscar cliente
                        </label>

                        <input
                            id="client-search"
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Buscar por nombre, identificación o correo"
                        />
                    </div>

                    <div className="clients-count">
                        {filteredClients.length} cliente
                        {filteredClients.length === 1
                            ? ""
                            : "s"}
                    </div>
                </div>

                {loading ? (
                    <div className="table-message">
                        Cargando clientes...
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            👥
                        </div>

                        <h2>
                            {search
                                ? "No se encontraron clientes"
                                : "Todavía no existen clientes"}
                        </h2>

                        <p>
                            {search
                                ? "Prueba con otro término de búsqueda."
                                : "Registra el primer cliente del sistema."}
                        </p>

                        {!search && (
                            <Link
                                to="/clients/new"
                                className="button button-primary"
                            >
                                Crear cliente
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="clients-table">
                            <thead>
                                <tr>
                                    <th>Identificación</th>
                                    <th>Cliente</th>
                                    <th>Contacto</th>
                                    <th>Estado</th>
                                    <th>Obligaciones</th>
                                    <th className="actions-column">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredClients.map((client) => {
                                    const fullName = [
                                        client.firstName,
                                        client.lastName,
                                    ]
                                        .filter(Boolean)
                                        .join(" ");

                                    const isDeleting =
                                        deletingId === client.id;

                                    return (
                                        <tr key={client.id}>
                                            <td>
                                                <strong>
                                                    {client.identification ||
                                                        "Sin identificación"}
                                                </strong>
                                            </td>

                                            <td>
                                                <div className="client-name-cell">
                                                    <span className="client-avatar">
                                                        {getInitials(client)}
                                                    </span>

                                                    <div>
                                                        <strong>
                                                            {fullName ||
                                                                "Sin nombre"}
                                                        </strong>

                                                        <small>
                                                            {client.address ||
                                                                "Sin dirección"}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="contact-cell">
                                                    <span>
                                                        {client.email ||
                                                            "Sin correo"}
                                                    </span>

                                                    <small>
                                                        {client.phone ||
                                                            "Sin teléfono"}
                                                    </small>
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        client.status ===
                                                            "INACTIVE"
                                                            ? "status-badge status-inactive"
                                                            : "status-badge status-active"
                                                    }
                                                >
                                                    {client.status ===
                                                        "INACTIVE"
                                                        ? "Inactivo"
                                                        : "Activo"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        client.hasPendingObligations
                                                            ? "obligation-badge obligation-pending"
                                                            : "obligation-badge obligation-clear"
                                                    }
                                                >
                                                    {client.hasPendingObligations
                                                        ? "Pendientes"
                                                        : "Al día"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <Link
                                                        to={`/clients/${client.id}/edit`}
                                                        className="action-button action-edit"
                                                    >
                                                        Editar
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="action-button action-delete"
                                                        disabled={isDeleting}
                                                        onClick={() =>
                                                            handleDelete(client)
                                                        }
                                                    >
                                                        {isDeleting
                                                            ? "Eliminando..."
                                                            : "Eliminar"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

function getInitials(client) {
    const firstInitial =
        client.firstName?.trim()?.charAt(0) || "";

    const lastInitial =
        client.lastName?.trim()?.charAt(0) || "";

    return (
        `${firstInitial}${lastInitial}`.toUpperCase() ||
        "CL"
    );
}