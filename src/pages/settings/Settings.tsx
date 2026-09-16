import { Link } from "react-router-dom";
import { ChevronRight, Tags, Palette } from "lucide-react";

import "./Settings.css";

export function Settings() {
  return (
    <main className="settings-page">
      <header className="settings-header">
        <div>
          <p className="settings-eyebrow">
            Personalizza
          </p>

          <h1>Impostazioni</h1>
        </div>

        <div className="settings-header-icon">
          ⚙️
        </div>
      </header>

      <section className="settings-section">
        <div className="settings-section-heading">
          <span>Gestione</span>

          <h2>La tua app</h2>
        </div>

        <div className="settings-list">
          <Link
            to="/categorie"
            className="settings-item"
          >
            <div className="settings-item-icon">
              <Tags size={21} />
            </div>

            <div className="settings-item-content">
              <strong>Categorie</strong>

              <span>
                Gestisci le categorie delle tue spese
              </span>
            </div>

            <ChevronRight
              className="settings-item-arrow"
              size={21}
            />
          </Link>

          <div className="settings-item settings-item-disabled">
            <div className="settings-item-icon settings-item-icon-purple">
              <Palette size={21} />
            </div>

            <div className="settings-item-content">
              <strong>Aspetto</strong>

              <span>
                Personalizza colori e aspetto dell'app
              </span>
            </div>

            <span className="settings-coming-soon">
              Presto
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
