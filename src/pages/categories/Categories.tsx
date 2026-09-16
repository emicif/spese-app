import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import "./Categories.css";

import {
  getCategories,
  addCategory,
  deleteCategory,
} from "../../repositories/categoryRepository";

import type { Category } from "../../types/category";

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📦");
  const [color, setColor] = useState("#2563eb");
  const [isSaving, setIsSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    const result = await getCategories();

    setCategories(result);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await addCategory({
        name: trimmedName,
        icon: icon.trim() || "📦",
        color,
        sortOrder: categories.length,
        active: true,
      });

      setName("");
      setIcon("📦");
      setColor("#2563eb");

      await loadCategories();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteCategory(id: number) {
    const confirmed = window.confirm(
      "Vuoi eliminare questa categoria?",
    );

    if (!confirmed) {
      return;
    }

    await deleteCategory(id);

    await loadCategories();
  }

  return (
    <main className="categories-page">
      <header className="categories-header">
        <div>
          <p className="categories-eyebrow">
            Personalizza
          </p>

          <h1>Categorie</h1>
        </div>

        <div className="categories-header-icon">
          🏷️
        </div>
      </header>

      <section className="categories-intro">
        <p>
          Organizza le tue spese con categorie
          personalizzate.
        </p>
      </section>

      <section className="categories-form-card">
        <div className="categories-section-heading">
          <div>
            <span>Nuova categoria</span>

            <h2>Aggiungi categoria</h2>
          </div>
        </div>

        <form
          className="category-form"
          onSubmit={handleSubmit}
        >
          <div className="category-form-row">
            <div className="category-icon-field">
              <label htmlFor="category-icon">
                Icona
              </label>

              <input
                id="category-icon"
                type="text"
                value={icon}
                maxLength={2}
                onChange={(event) =>
                  setIcon(event.target.value)
                }
                aria-label="Icona categoria"
              />
            </div>

            <div className="category-name-field">
              <label htmlFor="category-name">
                Nome
              </label>

              <input
                id="category-name"
                type="text"
                placeholder="es. Alimentari"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </div>
          </div>

          <div className="category-color-field">
            <label htmlFor="category-color">
              Colore
            </label>

            <div className="category-color-control">
              <input
                id="category-color"
                type="color"
                value={color}
                onChange={(event) =>
                  setColor(event.target.value)
                }
              />

              <span>{color}</span>
            </div>
          </div>

          <button
            type="submit"
            className="category-add-button"
            disabled={isSaving}
          >
            {isSaving
              ? "Salvataggio..."
              : "+ Aggiungi categoria"}
          </button>
        </form>
      </section>

      <section className="categories-section">
        <div className="categories-section-heading">
          <div>
            <span>Le tue categorie</span>

            <h2>
              {categories.length}{" "}
              {categories.length === 1
                ? "categoria"
                : "categorie"}
            </h2>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="categories-empty">
            <div className="categories-empty-icon">
              🏷️
            </div>

            <strong>Nessuna categoria</strong>

            <p>
              Crea la tua prima categoria per
              organizzare le spese.
            </p>
          </div>
        ) : (
          <div className="categories-list">
            {categories.map((category) => {
              const categoryColor =
                category.color || "#2563eb";

              return (
                <article
                  className="category-card"
                  key={category.id}
                >
                  <div className="category-card-left">
                    <div
                      className="category-icon"
                      style={{
                        backgroundColor: `${categoryColor}18`,
                        color: categoryColor,
                      }}
                    >
                      {category.icon || "📦"}
                    </div>

                    <div className="category-info">
                      <strong>
                        {category.name}
                      </strong>

                      <small>
                        Categoria spese
                      </small>
                    </div>
                  </div>

                  {category.id !== undefined && (
                    <button
                      type="button"
                      className="category-delete-button"
                      onClick={() =>
                        handleDeleteCategory(
                          category.id!,
                        )
                      }
                      aria-label={`Elimina ${category.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
