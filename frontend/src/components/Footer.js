import React from 'react';
import {Link} from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-light text-center text-lg-start mt-5">
            <div className="text-center p-3">
                <p>&copy; 2024 MDTREZA. Tous droits réservés.</p>
                <Link to="/legal">Mentions légales</Link>
            </div>
        </footer>
    );
}

export default Footer;
