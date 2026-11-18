    
import { useState } from "react";


const MENU_ITEMS = [
  { name: "Biryani", price: 250, category: "biryani" },
  { name: "Chicken 65", price: 180, category: "starter" },
  { name: "Fish Fry", price: 220, category: "starter" },
  { name: "Paneer Tikka", price: 200, category: "starter" },
  { name: "Chicken Tikka", price: 240, category: "starter" },
  { name: "Tandoori Chicken (Half)", price: 280, category: "starter" },
  { name: "Paneer Butter Masala", price: 220, category: "other" },
  { name: "Butter Chicken", price: 280, category: "other" },
  { name: "Chicken Chettinad", price: 250, category: "other" },
  { name: "Dal Tadka", price: 150, category: "other" },
  { name: "Chicken Biryani", price: 250, category: "biryani" },
  { name: "Mutton Biryani", price: 320, category: "biryani" },
  { name: "Veg Biryani", price: 180, category: "biryani" },
  { name: "Egg Biryani", price: 200, category: "biryani" },
  { name: "Butter Naan", price: 55, category: "other" },
  { name: "Garlic Naan", price: 70, category: "other" },
  { name: "Tandoori Roti", price: 35, category: "other" },
  { name: "Kerala Parotta", price: 40, category: "other" },
  { name: "Kothu Parotta", price: 140, category: "other" },
  { name: "Filter Coffee", price: 40, category: "drink" },
  { name: "Masala Chai", price: 30, category: "drink" },
  { name: "Mango Lassi", price: 90, category: "drink" },
  { name: "Cold Coffee", price: 110, category: "drink" },
];

const INGREDIENTS = [
  { id: "rice", name: "Basmati Rice", share: 0.18 },
  { id: "chk", name: "Chicken", share: 0.20 },
  { id: "mut", name: "Mutton", share: 0.12 },
  { id: "pan", name: "Paneer", share: 0.07 },
  { id: "mas", name: "Biryani Masala", share: 0.06 },
  { id: "oil", name: "Cooking Oil", share: 0.08 },
  { id: "cur", name: "Curd", share: 0.04 },
  { id: "flr", name: "Wheat Flour (Maida)", share: 0.06 },
  { id: "mlk", name: "Milk", share: 0.04 },
  { id: "cof", name: "Coffee Decoction", share: 0.02 },
  { id: "onn", name: "Onion", share: 0.08 },
  { id: "tom", name: "Tomato", share: 0.04 },
  { id: "fsh", name: "Seer Fish", share: 0.04 },
  { id: "btr", name: "Butter", share: 0.03 },
  { id: "egg", name: "Eggs", share: 0.03 },
  { id: "pkg", name: "Packaging Box", share: 0.03 },
];

const ELASTICITY = {
  biryani: 0.7,
  starter: 1.1,
  drink: 1.3,
  other: 0.9,
};

const BASE_REVENUE = 1200000;
const BASE_FOOD_COST = 715200;
const BASE_MONTHLY_PROFIT = 180000;

const inr = (value) =>
  "₹" + Math.round(Math.abs(value)).toLocaleString("en-IN");

const signedInr = (value) =>
  `${value >= 0 ? "+" : "−"}${inr(value)}`;

function WhatIfSimulatorTab() {
  const [selectedDish, setSelectedDish] = useState("Biryani");
  const [priceChange, setPriceChange] = useState(20);

  const [selectedIngredient, setSelectedIngredient] = useState("chk");
  const [ingredientChange, setIngredientChange] = useState(15);

  const dish = MENU_ITEMS.find(
    (item) => item.name === selectedDish
  );

  const ingredient = INGREDIENTS.find(
    (item) => item.id === selectedIngredient
  );

  // PRICE SIMULATION
  const elasticity = ELASTICITY[dish.category];

  const volumeChange =
    -(priceChange / dish.price) * elasticity * 100;

  const actualVolumeChange = Math.max(
    -50,
    Math.min(50, volumeChange)
  );

  // Monthly sales assumption for selected menu item
  const monthlyQuantity = 1800;

  const oldRevenue = dish.price * monthlyQuantity;

  const newQuantity =
    monthlyQuantity * (1 + actualVolumeChange / 100);

  const newRevenue =
    (dish.price + priceChange) * newQuantity;

  // Estimate selected dish contribution
  const dishFoodCost = dish.price * 0.596;

  const priceProfitImpact =
    newRevenue -
    oldRevenue -
    dishFoodCost * (newQuantity - monthlyQuantity);

  // INGREDIENT COST SIMULATION
  const monthlyIngredientCost =
    BASE_FOOD_COST * ingredient.share;

  const ingredientCostImpact =
    monthlyIngredientCost * (ingredientChange / 100);

  const newFoodCost =
    BASE_FOOD_COST + ingredientCostImpact;

  const newTotalRevenue =
    BASE_REVENUE +
    (newRevenue - oldRevenue);

  const newFoodCostPercent =
    (newFoodCost / newTotalRevenue) * 100;

  const oldFoodCostPercent =
    (BASE_FOOD_COST / BASE_REVENUE) * 100;

  // MONTHLY PROFIT
  const profitImpact =
    priceProfitImpact - ingredientCostImpact;

  const monthlyProfit =
    BASE_MONTHLY_PROFIT + profitImpact;

  const suggestedRise = Math.max(
    0,
    (ingredientCostImpact / monthlyQuantity) * 0.8
  );

  // CUSTOMER SENSITIVITY
  const sensitivity =
    Math.abs(actualVolumeChange) < 3
      ? "Low"
      : Math.abs(actualVolumeChange) < 8
      ? "Medium"
      : "High";

  const formatPercent = (value) =>
    `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

  return (
    <div className="what-if">

      {/* SIMULATOR CARD */}
      <div className="what-if-card">

        <div className="what-if-card-header">
          Restaurant business simulator
        </div>

        {/* CONTROLS */}
        <div className="what-if-controls">

          {/* MENU PRICE */}
          <div className="what-if-field">

            <label>Change price of</label>

            <select
              value={selectedDish}
              onChange={(e) => setSelectedDish(e.target.value)}
            >
              {MENU_ITEMS.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>

            <input
              type="range"
              min="-30"
              max="60"
              step="5"
              value={priceChange}
              onChange={(e) =>
                setPriceChange(Number(e.target.value))
              }
            />

            <strong className="what-if-range-value">
              {priceChange >= 0 ? "+" : "−"}{inr(priceChange)}
            </strong>

          </div>

          {/* INGREDIENT PRICE */}
          <div className="what-if-field">

            <label>Ingredient price change</label>

            <select
              value={selectedIngredient}
              onChange={(e) =>
                setSelectedIngredient(e.target.value)
              }
            >
              {INGREDIENTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <input
              type="range"
              min="-20"
              max="40"
              step="1"
              value={ingredientChange}
              onChange={(e) =>
                setIngredientChange(Number(e.target.value))
              }
            />

            <strong className="what-if-range-value">
              {ingredientChange >= 0 ? "+" : ""}
              {ingredientChange}%
            </strong>

          </div>

        </div>

        {/* TOP METRICS */}
        <div className="what-if-metrics">

          <div className="what-if-metric">
            <span>Sales volume</span>
            <strong className={actualVolumeChange < 0 ? "negative" : "positive"}>
              {formatPercent(actualVolumeChange)}
            </strong>
          </div>

          <div className="what-if-metric">
            <span>Food cost %</span>
            <strong>
              {oldFoodCostPercent.toFixed(1)} →{" "}
              {newFoodCostPercent.toFixed(1)}%
            </strong>
          </div>

          <div className="what-if-metric">
            <span>Monthly profit</span>
            <strong className={monthlyProfit >= BASE_MONTHLY_PROFIT ? "positive" : "negative"}>
              {inr(monthlyProfit)}
            </strong>
          </div>

          <div className="what-if-metric">
            <span>Customer sensitivity</span>
            <strong className={`sensitivity-${sensitivity.toLowerCase()}`}>
              {sensitivity}
            </strong>
          </div>

        </div>

        {/* BOTTOM METRICS */}
        <div className="what-if-impact-grid">

          <div className="what-if-metric">
            <span>Monthly food cost</span>
            <strong>
              {signedInr(ingredientCostImpact)}
            </strong>
          </div>

          <div className="what-if-metric">
            <span>Profit impact</span>
            <strong className={profitImpact >= 0 ? "positive" : "negative"}>
              {signedInr(profitImpact)}
            </strong>
          </div>

          <div className="what-if-metric">
            <span>Suggested price rise</span>
            <strong className="suggested">
              ₹{Math.floor(suggestedRise)}–₹
              {Math.ceil(suggestedRise + 1)} / dish
            </strong>
          </div>

        </div>

        {/* MODEL NOTE */}
        <div className="what-if-note">
          Model: illustrative monthly sales mix ×30, estimated recipe
          costs and price elasticity by category (biryani −0.7,
          starters −1.1, drinks −1.3, others −0.9).
          Treat as a planning estimate, not actual live business data.
        </div>

      </div>
    </div>
  );
}

export default WhatIfSimulatorTab;
