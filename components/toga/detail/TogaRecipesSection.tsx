"use client";

import { motion } from "framer-motion";
import { CupSoda, ArrowRight } from "lucide-react";
import {
  TOGA_DETAIL_CONTENT,
  parseTogaRecipes,
  getTogaAccentFromSlug,
  nextTogaAccent,
  TOGA_ACCENT_STYLES,
  type TogaPlant,
} from "@/constants/toga";

type TogaRecipesSectionProps = {
  plant: TogaPlant;
};

export function TogaRecipesSection({ plant }: TogaRecipesSectionProps) {
  const recipes = parseTogaRecipes(plant.recipes);
  if (recipes.length === 0) return null;

  const accent = getTogaAccentFromSlug(plant.slug);
  const styles = TOGA_ACCENT_STYLES[accent];
  // Selang-seling per kartu resep supaya tidak seragam satu warna saat resep lebih dari satu.
  const altStyles = TOGA_ACCENT_STYLES[nextTogaAccent(accent)];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`p-6 md:p-8 bg-background border-4 ${styles.border} rounded-2xl hard-shadow-lg space-y-6`}
    >
      <h2 className="font-serif text-xl font-black text-on-surface flex items-center gap-2 border-b-2 border-dashed border-outline-variant pb-4">
        <CupSoda className={`w-5 h-5 ${styles.text}`} />
        {TOGA_DETAIL_CONTENT.recipesTitle}
      </h2>

      <div className="space-y-6">
        {recipes.map((recipe, i) => {
          const ingredients = recipe.ingredients?.filter((ing) => ing.trim()) ?? [];
          const steps = recipe.steps?.filter((step) => step.trim()) ?? [];
          const recipeStyles = i % 2 === 0 ? styles : altStyles;

          return (
            <div
              key={i}
              className="bg-surface-container-low border-2 border-on-surface rounded-lg p-5 space-y-4"
            >
              <h3 className="font-serif font-black text-lg text-on-surface flex items-center gap-2">
                <ArrowRight className={`w-4 h-4 shrink-0 ${recipeStyles.text}`} />
                {recipe.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-2">
                    {TOGA_DETAIL_CONTENT.ingredientsLabel}
                  </h4>
                  <ul className="list-disc list-inside text-sm text-on-surface-variant font-medium space-y-1.5">
                    {ingredients.map((ing, j) => (
                      <li key={j}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-2">
                    {TOGA_DETAIL_CONTENT.stepsLabel}
                  </h4>
                  <ol className="list-decimal list-inside text-sm text-on-surface-variant font-medium space-y-1.5">
                    {steps.map((step, j) => (
                      <li key={j}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
