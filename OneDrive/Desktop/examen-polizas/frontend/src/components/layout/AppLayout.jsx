import {
    NavLink,
    Outlet,
} from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-logo">PI</div>

                    <div>
                        <strong>Inversión</strong>
                        <span>Polizas</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        <span>⌂</span>
                        Inicio
                    </NavLink>

                    <NavLink
                        to="/clients"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        <span>👥</span>
                        Clientes
                    </NavLink>

                    <NavLink
                        to="/policies"
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link sidebar-link-active"
                                : "sidebar-link"
                        }
                    >
                        <span>📈</span>
                        <span>Simular póliza</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <span>Sistema de inversiones</span>
                    <small>Desarrollo de Software II</small>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div>
                        <strong>Panel administrativo</strong>
                    </div>

                    <div className="user-badge">
                        <span>GL</span>

                        <div>
                            <strong>Administrador</strong>
                            <small>Usuario del sistema</small>
                        </div>
                    </div>
                </header>

                <div className="page-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}