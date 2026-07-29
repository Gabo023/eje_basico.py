import { Link } from "react-router-dom";

export default function DashboardPage() {
    return (
        <section className="page">
            <div className="page-header">
                <div>
                    <span className="eyebrow">
                        Sistema financiero
                    </span>

                    <h1>Gestión de pólizas de inversión</h1>

                    <p>
                        Administra clientes y simula pólizas de
                        inversión.
                    </p>
                </div>
            </div>

            <div className="dashboard-grid">
                <Link
                    to="/clients"
                    className="dashboard-card"
                >
                    <span className="dashboard-card-icon">
                        👥
                    </span>

                    <h2>Clientes</h2>

                    <p>
                        Registra, consulta y actualiza la
                        información de los clientes.
                    </p>

                    <span className="dashboard-card-link">
                        Gestionar clientes →
                    </span>
                </Link>

                <Link
                    to="/policies"
                    className="dashboard-card"
                >
                    <span className="dashboard-card-icon">
                        📄
                    </span>

                    <h2>Simulador de pólizas</h2>

                    <p>
                        Simula inversiones, calcula intereses y
                        consulta el monto final estimado.
                    </p>

                    <span className="dashboard-card-link">
                        Simular póliza →
                    </span>
                </Link>

                <article className="dashboard-card dashboard-card-disabled">
                    <span className="dashboard-card-icon">
                        📊
                    </span>

                    <h2>Seguimiento</h2>

                    <p>
                        Consulta el estado de las operaciones
                        comerciales.
                    </p>

                    <span className="dashboard-card-link">
                        Próximamente
                    </span>
                </article>
            </div>
        </section>
    );
}