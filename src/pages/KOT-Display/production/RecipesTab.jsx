import { useState } from "react";

const INITIAL_RECIPES = [
    {
        id: "dough",
        name: "Parotta dough",
        code: "DGH",
        step: "Portion and roll",
        type: "WIP",
        batchSize: 20,
        unit: "kg",
        recipe: "Wheat Flour (Maida) 14 kg, Cooking Oil 1.2 L, Milk 1.5 L",
        stdCost: 43.1,
        waste: 2,
        shelf: 8,
        soldAs: "Not sold directly",
    },
    {
        id: "par",
        name: "Half-cooked parotta",
        code: "PAR",
        step: "Final cook on the tawa",
        type: "Semi-finished",
        batchSize: 300,
        unit: "pcs",
        recipe: "Parotta dough 20 kg, Cooking Oil 1 L",
        stdCost: 3.32,
        waste: 3,
        shelf: 10,
        soldAs: "Kothu Parotta (2 pcs each)",
    },
    {
        id: "mch",
        name: "Marinated chicken",
        code: "MCH",
        step: "Fry or grill",
        type: "Semi-finished",
        batchSize: 27,
        unit: "kg",
        recipe: "Chicken 25 kg, Curd 3 kg, Biryani Masala 0.4 kg, Cooking Oil 1 L",
        stdCost: 214.93,
        waste: 4,
        shelf: 12,
        soldAs: "Not sold directly",
    },
    {
        id: "fry",
        name: "Chicken fry",
        code: "FRY",
        step: "Sell or serve",
        type: "Finished",
        batchSize: 40,
        unit: "portions",
        recipe: "Marinated chicken 8 kg, Cooking Oil 2.4 L",
        stdCost: 51.09,
        waste: 3,
        shelf: 6,
        soldAs: "Chicken 65 (1 portions each)",
    },
    {
        id: "cry",
        name: "Chicken curry base",
        code: "CUR",
        step: "Sell or serve",
        type: "Finished",
        batchSize: 100,
        unit: "portions",
        recipe:
            "Chicken 22 kg, Tomato 8 kg, Onion 5 kg, Cooking Oil 3 L, Biryani Masala 0.6 kg",
        stdCost: 58.63,
        waste: 2,
        shelf: 12,
        soldAs: "Butter Chicken (1 portions each)",
    },
];

const formatCost = (value) =>
    `₹${value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const typeClass = (type) =>
    type === "Finished"
        ? "tag-completed"
        : type === "Semi-finished"
            ? "tag-semi-finished"
            : "tag-wip";

const RecipesTab = ({ onChange }) => {
    const [recipes, setRecipes] = useState(INITIAL_RECIPES);

    const updateRecipe = (id, field, value, fallback) => {
        const parsed = Number(value);
        const next = Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;

        const updated = recipes.map((item) =>
            item.id === id ? { ...item, [field]: next } : item
        );

        setRecipes(updated);
        if (onChange) onChange(updated);
    };

    return (
        <div className="production-recipes">
            <div className="production-table-wrap">
                <table className="production-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Type</th>
                            <th className="num-r">Batch size</th>
                            <th>Recipe per batch</th>
                            <th className="num-r">Std cost / unit</th>
                            <th className="num-r">Expected waste %</th>
                            <th className="num-r">Shelf life (h)</th>
                            <th>Sold as</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recipes.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <strong>{item.name}</strong>
                                    <span className="production-sub">
                                        {item.code} · {item.step}
                                    </span>
                                </td>

                                <td>
                                    <span className={`production-tag ${typeClass(item.type)}`}>
                                        {item.type}
                                    </span>
                                </td>

                                <td className="num-r">
                                    <div className="production-field">
                                        <input
                                            className="production-input production-input-md"
                                            type="number"
                                            min="1"
                                            value={item.batchSize}
                                            aria-label={`${item.name} batch size`}
                                            onChange={(e) =>
                                                updateRecipe(item.id, "batchSize", e.target.value, item.batchSize)
                                            }
                                        />
                                        <span className="production-unit">{item.unit}</span>
                                    </div>
                                </td>

                                <td className="production-ingredients">{item.recipe}</td>

                                <td className="num-r">{formatCost(item.stdCost)}</td>

                                <td className="num-r">
                                    <input
                                        className="production-input production-input-sm"
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={item.waste}
                                        aria-label={`${item.name} expected waste percent`}
                                        onChange={(e) =>
                                            updateRecipe(item.id, "waste", e.target.value, 0)
                                        }
                                    />
                                </td>

                                <td className="num-r">
                                    <input
                                        className="production-input production-input-sm"
                                        type="number"
                                        min="1"
                                        value={item.shelf}
                                        aria-label={`${item.name} shelf life in hours`}
                                        onChange={(e) =>
                                            updateRecipe(item.id, "shelf", e.target.value, 1)
                                        }
                                    />
                                </td>

                                <td
                                   
                                >
                                    {item.soldAs}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="production-note">
                A product can use raw materials and earlier-stage products, so cost
                carries forward through every stage. Ingredient lines are fixed in this
                version.
            </p>
        </div>
    );
};

export default RecipesTab;
