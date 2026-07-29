import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <section className="not-found">
            <span className="eyebrow">Error 404</span>

            <h1>Página no encontrada</h1>

            <p>
                La dirección solicitada no existe.
            </p>

            <Link
                to="/"
                className="button button-primary"
            >
                Volver al inicio
            </Link>
        </section>
    );
}