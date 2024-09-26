import React from 'react';
import { Helmet } from 'react-helmet-async';

function LegalMentionsPage() {
    return (
        <div className="container mt-4">
            <Helmet>
                <title>Mentions Légales - MDTREZA</title>
                <meta name="description" content="Consultez les mentions légales du Domaine Thermal." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <h1>Mentions Légales</h1>
            <p>Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l’économie numérique, dite L.C.E.N., nous portons à la connaissance des utilisateurs et visiteurs du site www.mdtreza.com les informations suivantes :</p>

            <h2>Éditeur du site</h2>
            <p>
                Le site www.mdtreza.com est édité par : <br/>
                Société Ouam, SARL au capital de 1000€, <br/>
                Siège social : 123 Rue je ne sais plus où, 75000 Paris <br/>
                Téléphone : 01 23 45 67 89 <br/>
                Email : contact@mdtreza.com
            </p>

            <h2>Responsable de la publication</h2>
            <p>
                Responsable de la publication : Ouam, Directeur Général <br/>
                Email : ouam@mdtreza.com
            </p>

            <h2>Hébergement du site</h2>
            <p>
                Le site est hébergé par : <br/>
                OVNVI, SAS au capital de 10 000€, <br/>
                Siège social : 2 Rue je ne sais toujours pas où, 59100 Roubaix <br/>
                Téléphone : 09 87 65 43 21
            </p>

            <h2>Propriété intellectuelle</h2>
            <p>
                Toute utilisation, reproduction, diffusion, commercialisation, modification de toute ou partie du site sans l’autorisation de l’Éditeur est prohibée et pourra entraîner des actions et poursuites judiciaires telles que prévues notamment par le Code de la propriété intellectuelle et le Code civil.
            </p>
        </div>
    );
}

export default LegalMentionsPage;
