
import React, { useEffect, useState } from "react";
import "../../../assets/styles/sop.css";

const INITIAL_RECIPES = [
  {
    name: "Chicken Biryani",
    version: 3,
    chef: "Chef Murugan",
    ingredients: [
      { name: "Basmati Rice", qty: "0.2 kg", cost: 23.60 },
      { name: "Chicken", qty: "0.25 kg", cost: 52.50 },
      { name: "Biryani Masala", qty: "0.02 kg", cost: 10.40 },
      { name: "Cooking Oil", qty: "0.03 L", cost: 4.05 },
      { name: "Curd", qty: "0.04 kg", cost: 2.80 },
      { name: "Onion", qty: "0.08 kg", cost: 3.04 },
    ],
    method: `1. Wash and soak rice for 30 minutes; marinate chicken for 2 hours.
2. Fry onions until golden brown and par-boil rice to 70%.
3. Layer chicken, rice, fried onions and mint.
4. Seal and dum cook for 25 minutes on low flame.
5. Rest for 5 minutes, fluff gently and portion by weight.
6. Pass to KOT counter within 8 minutes of fire.`,
    portion: "1 portion · 350 g",
    prepTime: "45 min batch",
    holding: "Hot-hold ≥ 60°C, max 2 hrs",
    allergens: "Dairy; check spice blend",
    plating: "Copper handi, mint, fried onion, raita and salan",
  },
  {
    name: "Mutton Biryani",
    version: 1,
    chef: "Chef Murugan",
    ingredients: [
      { name: "Basmati Rice", qty: "0.2 kg", cost: 23.60 },
      { name: "Mutton", qty: "0.25 kg", cost: 100.00 },
      { name: "Biryani Masala", qty: "0.02 kg", cost: 10.40 },
      { name: "Cooking Oil", qty: "0.03 L", cost: 4.05 },
      { name: "Curd", qty: "0.04 kg", cost: 2.80 },
      { name: "Onion", qty: "0.08 kg", cost: 3.04 },
    ],
    method: `1. Clean and marinate mutton with curd, spices and ginger-garlic.
2. Soak rice for 30 minutes and prepare fried onions.
3. Cook mutton until tender.
4. Layer mutton, rice, mint and fried onions.
5. Dum cook until rice is fluffy and meat is fully cooked.
6. Rest briefly and portion consistently before serving.`,
    portion: "1 portion · 400 g",
    prepTime: "60–90 min batch",
    holding: "Hot-hold ≥ 60°C, max 2 hrs",
    allergens: "Dairy; check spice blend",
    plating: "Copper handi, mint, fried onion, raita and salan",
  },
  {
    name: "Chicken 65",
    version: 1,
    chef: "Chef Kumar",
    ingredients: [
      { name: "Chicken", qty: "0.25 kg", cost: 52.50 },
      { name: "Corn Flour", qty: "0.03 kg", cost: 1.80 },
      { name: "Curd", qty: "0.02 kg", cost: 1.40 },
      { name: "Ginger-Garlic Paste", qty: "0.01 kg", cost: 2.00 },
      { name: "Spices", qty: "0.01 kg", cost: 5.00 },
      { name: "Cooking Oil", qty: "0.05 L", cost: 6.75 },
    ],
    method: `1. Cut chicken into bite-sized pieces.
2. Mix with curd, ginger-garlic, spices and corn flour.
3. Marinate for 30 minutes under refrigeration.
4. Fry in small batches until fully cooked and crisp.
5. Toss with curry leaves and green chilli.
6. Drain excess oil and serve immediately.`,
    portion: "1 portion · 250 g",
    prepTime: "35 min batch",
    holding: "Serve immediately for best crispness",
    allergens: "Dairy; check spice blend",
    plating: "White platter with curry leaves, lemon and onion",
  },
  {
    name: "Paneer Butter Masala",
    version: 1,
    chef: "Chef Ravi",
    ingredients: [
      { name: "Paneer", qty: "0.2 kg", cost: 70.00 },
      { name: "Tomato", qty: "0.15 kg", cost: 6.00 },
      { name: "Butter", qty: "0.03 kg", cost: 15.00 },
      { name: "Cream", qty: "0.03 L", cost: 12.00 },
      { name: "Cashew", qty: "0.01 kg", cost: 8.00 },
      { name: "Spices", qty: "0.01 kg", cost: 5.00 },
    ],
    method: `1. Prepare tomato, cashew and spice gravy.
2. Cook until the raw tomato aroma disappears.
3. Blend gravy until smooth.
4. Add butter, cream and paneer cubes.
5. Simmer gently until paneer is heated through.
6. Finish with cream and serve hot.`,
    portion: "1 portion · 300 g",
    prepTime: "35 min batch",
    holding: "Hot-hold ≥ 60°C, max 2 hrs",
    allergens: "Dairy, cashew",
    plating: "Shallow bowl, cream swirl and coriander",
  },
  {
    name: "Butter Chicken",
    version: 1,
    chef: "Chef Ravi",
    ingredients: [
      { name: "Chicken", qty: "0.25 kg", cost: 52.50 },
      { name: "Tomato", qty: "0.15 kg", cost: 6.00 },
      { name: "Butter", qty: "0.03 kg", cost: 15.00 },
      { name: "Cream", qty: "0.03 L", cost: 12.00 },
      { name: "Cashew", qty: "0.01 kg", cost: 8.00 },
      { name: "Tandoori Spices", qty: "0.01 kg", cost: 6.00 },
    ],
    method: `1. Marinate chicken with curd and tandoori spices.
2. Roast or grill chicken until fully cooked.
3. Prepare smooth tomato-cashew gravy.
4. Add butter, cream and cooked chicken.
5. Simmer gently until flavours combine.
6. Garnish and send to the pass.`,
    portion: "1 portion · 350 g",
    prepTime: "45 min batch",
    holding: "Hot-hold ≥ 60°C, max 2 hrs",
    allergens: "Dairy, cashew",
    plating: "Black bowl, cream swirl and coriander",
  },
  {
    name: "Butter Naan",
    version: 1,
    chef: "Chef Imran",
    ingredients: [
      { name: "Maida", qty: "0.15 kg", cost: 7.50 },
      { name: "Curd", qty: "0.02 kg", cost: 1.40 },
      { name: "Butter", qty: "0.02 kg", cost: 10.00 },
      { name: "Milk", qty: "0.02 L", cost: 1.20 },
      { name: "Yeast", qty: "0.002 kg", cost: 1.00 },
      { name: "Salt and Sugar", qty: "0.005 kg", cost: 0.50 },
    ],
    method: `1. Mix flour, yeast, salt, sugar, curd and milk.
2. Knead into a soft dough.
3. Rest until the dough rises.
4. Roll into naan shape.
5. Cook in a hot tandoor until puffed and spotted.
6. Brush with butter and serve hot.`,
    portion: "2 pieces",
    prepTime: "90 min dough batch",
    holding: "Serve fresh; keep covered briefly",
    allergens: "Gluten, dairy",
    plating: "Oval basket lined with food-safe paper",
  },
  {
    name: "Filter Coffee",
    version: 1,
    chef: "Chef Priya",
    ingredients: [
      { name: "Coffee Powder", qty: "0.015 kg", cost: 8.00 },
      { name: "Milk", qty: "0.15 L", cost: 9.00 },
      { name: "Sugar", qty: "0.01 kg", cost: 0.50 },
      { name: "Water", qty: "0.05 L", cost: 0.10 },
    ],
    method: `1. Add coffee powder to the filter.
2. Pour hot water and allow decoction to drip.
3. Heat milk thoroughly.
4. Combine decoction, milk and sugar.
5. Froth by pouring between vessels.
6. Serve immediately.`,
    portion: "1 tumbler · 180 ml",
    prepTime: "10 min batch",
    holding: "Prepare fresh; serve hot",
    allergens: "Dairy",
    plating: "Traditional stainless-steel tumbler and davara",
  },
  {
    name: "Fish Fry",
    version: 1,
    chef: "Chef Kumar",
    ingredients: [
      { name: "Fish", qty: "0.2 kg", cost: 80.00 },
      { name: "Chilli Powder", qty: "0.01 kg", cost: 3.00 },
      { name: "Turmeric", qty: "0.003 kg", cost: 0.60 },
      { name: "Ginger-Garlic Paste", qty: "0.01 kg", cost: 2.00 },
      { name: "Lemon", qty: "0.02 kg", cost: 1.50 },
      { name: "Cooking Oil", qty: "0.03 L", cost: 4.05 },
    ],
    method: `1. Clean fish and pat dry.
2. Mix chilli, turmeric, ginger-garlic, lemon and salt.
3. Coat fish and marinate under refrigeration.
4. Shallow-fry until crisp and fully cooked.
5. Check the thickest part for safe doneness.
6. Drain and serve immediately.`,
    portion: "1 portion · 200 g",
    prepTime: "25 min batch",
    holding: "Serve immediately; avoid extended holding",
    allergens: "Fish; check shared fryer cross-contact",
    plating: "Banana-leaf-lined platter with lemon and onion",
  },
  {
    name: "Mango Lassi",
    version: 1,
    chef: "Chef Priya",
    ingredients: [
      { name: "Mango Pulp", qty: "0.15 kg", cost: 18.00 },
      { name: "Curd", qty: "0.15 kg", cost: 10.50 },
      { name: "Sugar", qty: "0.015 kg", cost: 0.75 },
      { name: "Ice", qty: "0.05 kg", cost: 0.50 },
      { name: "Cardamom", qty: "0.001 kg", cost: 1.00 },
    ],
    method: `1. Chill mango pulp and curd.
2. Add sugar and cardamom.
3. Blend with ice until smooth.
4. Adjust consistency without diluting flavour.
5. Pour into a chilled glass.
6. Serve immediately.`,
    portion: "1 glass · 300 ml",
    prepTime: "5 min",
    holding: "Keep refrigerated; serve fresh",
    allergens: "Dairy",
    plating: "Tall chilled glass with mango garnish",
  },
  {
    name: "Egg Biryani",
    version: 1,
    chef: "Chef Murugan",
    ingredients: [
      { name: "Basmati Rice", qty: "0.2 kg", cost: 23.60 },
      { name: "Eggs", qty: "2 pcs", cost: 14.00 },
      { name: "Onion", qty: "0.08 kg", cost: 3.04 },
      { name: "Tomato", qty: "0.05 kg", cost: 2.00 },
      { name: "Biryani Masala", qty: "0.015 kg", cost: 7.80 },
      { name: "Cooking Oil", qty: "0.03 L", cost: 4.05 },
    ],
    method: `1. Wash and soak rice for 30 minutes.
2. Boil eggs thoroughly, peel and lightly season.
3. Fry onions and prepare masala.
4. Par-boil rice and layer with masala.
5. Add eggs and dum cook until rice is done.
6. Rest briefly, fluff and portion.`,
    portion: "1 portion · 350 g",
    prepTime: "40 min batch",
    holding: "Hot-hold ≥ 60°C, max 2 hrs",
    allergens: "Egg; check spice blend",
    plating: "Copper handi with fried onion and coriander",
  },
  {
    name: "Veg Biryani",
    version: 1,
    chef: "Chef Murugan",
    ingredients: [
      { name: "Basmati Rice", qty: "0.2 kg", cost: 23.60 },
      { name: "Mixed Vegetables", qty: "0.15 kg", cost: 15.00 },
      { name: "Onion", qty: "0.08 kg", cost: 3.04 },
      { name: "Curd", qty: "0.03 kg", cost: 2.10 },
      { name: "Biryani Masala", qty: "0.015 kg", cost: 7.80 },
      { name: "Cooking Oil", qty: "0.03 L", cost: 4.05 },
    ],
    method: `1. Wash and soak rice for 30 minutes.
2. Chop vegetables into even pieces.
3. Fry onions and cook vegetables with spices.
4. Par-boil rice and layer with vegetables.
5. Dum cook until rice is tender.
6. Rest, fluff gently and portion.`,
    portion: "1 portion · 350 g",
    prepTime: "40 min batch",
    holding: "Hot-hold ≥ 60°C, max 2 hrs",
    allergens: "Dairy; check spice blend",
    plating: "Copper handi with mint and fried onion",
  },
  {
    name: "Paneer Tikka",
    version: 1,
    chef: "Chef Imran",
    ingredients: [
      { name: "Paneer", qty: "0.2 kg", cost: 70.00 },
      { name: "Curd", qty: "0.04 kg", cost: 2.80 },
      { name: "Capsicum", qty: "0.05 kg", cost: 4.00 },
      { name: "Onion", qty: "0.05 kg", cost: 2.00 },
      { name: "Tikka Masala", qty: "0.01 kg", cost: 5.00 },
      { name: "Cooking Oil", qty: "0.01 L", cost: 1.35 },
    ],
    method: `1. Cut paneer and vegetables into cubes.
2. Mix curd, tikka masala and oil.
3. Coat paneer and vegetables.
4. Thread onto skewers.
5. Roast in the tandoor, turning evenly.
6. Finish with lemon and serve hot.`,
    portion: "1 portion · 250 g",
    prepTime: "30 min batch",
    holding: "Serve hot; avoid extended holding",
    allergens: "Dairy",
    plating: "Sizzler platter with mint chutney and lemon",
  },
  {
    name: "Chicken Tikka",
    version: 1,
    chef: "Chef Imran",
    ingredients: [
      { name: "Chicken", qty: "0.25 kg", cost: 52.50 },
      { name: "Curd", qty: "0.04 kg", cost: 2.80 },
      { name: "Tikka Masala", qty: "0.015 kg", cost: 7.50 },
      { name: "Ginger-Garlic Paste", qty: "0.01 kg", cost: 2.00 },
      { name: "Lemon", qty: "0.02 kg", cost: 1.50 },
      { name: "Cooking Oil", qty: "0.01 L", cost: 1.35 },
    ],
    method: `1. Cut chicken into even pieces.
2. Mix curd, spices, ginger-garlic and lemon.
3. Marinate under refrigeration.
4. Thread onto skewers.
5. Roast until the centre reaches a safe temperature.
6. Rest briefly and serve with chutney.`,
    portion: "1 portion · 250 g",
    prepTime: "35 min batch",
    holding: "Hot-hold ≥ 60°C, max 2 hrs",
    allergens: "Dairy; check spice blend",
    plating: "Sizzler platter with onion rings and mint chutney",
  },
  {
    name: "Tandoori Chicken (Half)",
    version: 1,
    chef: "Chef Imran",
    ingredients: [
      { name: "Chicken", qty: "0.4 kg", cost: 84.00 },
      { name: "Curd", qty: "0.05 kg", cost: 3.50 },
      { name: "Tandoori Masala", qty: "0.02 kg", cost: 10.00 },
      { name: "Ginger-Garlic Paste", qty: "0.015 kg", cost: 3.00 },
      { name: "Lemon", qty: "0.02 kg", cost: 1.50 },
      { name: "Cooking Oil", qty: "0.015 L", cost: 2.03 },
    ],
    method: `1. Clean and score chicken for even cooking.
2. Apply curd, spices, ginger-garlic and lemon marinade.
3. Refrigerate for adequate marination.
4. Roast in a hot tandoor, turning as required.
5. Confirm the thickest part reaches a safe temperature.
6. Rest briefly and serve with accompaniments.`,
    portion: "Half chicken · approx. 400 g raw",
    prepTime: "45 min batch, excluding marination",
    holding: "Hot-hold ≥ 60°C, max 2 hrs",
    allergens: "Dairy; check spice blend",
    plating: "Sizzler platter with lemon and mint chutney",
  },
  {
    name: "Chicken Chettinad",
    version: 1,
    chef: "Chef Kumar",
    ingredients: [
      { name: "Chicken", qty: "0.25 kg", cost: 52.50 },
      { name: "Onion", qty: "0.08 kg", cost: 3.04 },
      { name: "Tomato", qty: "0.08 kg", cost: 3.20 },
      { name: "Coconut", qty: "0.03 kg", cost: 6.00 },
      { name: "Chettinad Spice Mix", qty: "0.015 kg", cost: 8.00 },
      { name: "Cooking Oil", qty: "0.02 L", cost: 2.70 },
    ],
    method: `1. Roast whole spices until aromatic.
2. Grind spices with coconut to make the masala.
3. Sauté onions until golden and add tomatoes.
4. Add chicken and ground masala.
5. Cook until chicken is fully cooked and gravy thickens.
6. Garnish with curry leaves and serve hot.`,
    portion: "1 portion · 300 g",
    prepTime: "40 min batch",
    holding: "Hot-hold ≥ 60°C, max 2 hrs",
    allergens: "Check spice mix and shared preparation surfaces",
    plating: "Clay pot with curry leaves and coriander",
  },
  {
    name: "Dal Tadka",
    version: 1,
    chef: "Chef Ravi",
    ingredients: [
      { name: "Toor Dal", qty: "0.1 kg", cost: 12.00 },
      { name: "Onion", qty: "0.04 kg", cost: 1.52 },
      { name: "Tomato", qty: "0.05 kg", cost: 2.00 },
      { name: "Butter", qty: "0.015 kg", cost: 7.50 },
      { name: "Garlic", qty: "0.01 kg", cost: 2.00 },
      { name: "Spices", qty: "0.005 kg", cost: 2.50 },
    ],
    method: `1. Wash dal and pressure-cook until soft.
2. Sauté onion, tomato and spices.
3. Add cooked dal and simmer to the required consistency.
4. Prepare a garlic and cumin tempering.
5. Pour tempering over dal.
6. Garnish and serve hot.`,
    portion: "1 portion · 250 g",
    prepTime: "35 min batch",
    holding: "Hot-hold ≥ 60°C, max 2 hrs",
    allergens: "Dairy if butter is used",
    plating: "Deep bowl with cumin tempering and coriander",
  },
  {
    name: "Garlic Naan",
    version: 1,
    chef: "Chef Imran",
    ingredients: [
      { name: "Maida", qty: "0.15 kg", cost: 7.50 },
      { name: "Curd", qty: "0.02 kg", cost: 1.40 },
      { name: "Butter", qty: "0.02 kg", cost: 10.00 },
      { name: "Garlic", qty: "0.01 kg", cost: 2.00 },
      { name: "Yeast", qty: "0.002 kg", cost: 1.00 },
      { name: "Coriander", qty: "0.005 kg", cost: 1.00 },
    ],
    method: `1. Prepare a soft dough using flour, yeast and curd.
2. Allow dough to rise.
3. Roll into naan shapes.
4. Apply chopped garlic and coriander.
5. Cook in a hot tandoor until fully baked.
6. Brush with butter and serve immediately.`,
    portion: "2 pieces",
    prepTime: "90 min dough batch",
    holding: "Serve fresh; keep covered briefly",
    allergens: "Gluten, dairy",
    plating: "Oval basket with garlic and coriander garnish",
  },
  {
    name: "Tandoori Roti",
    version: 1,
    chef: "Chef Imran",
    ingredients: [
      { name: "Whole Wheat Flour", qty: "0.12 kg", cost: 6.00 },
      { name: "Salt", qty: "0.002 kg", cost: 0.10 },
      { name: "Water", qty: "0.07 L", cost: 0.10 },
      { name: "Oil", qty: "0.005 L", cost: 0.68 },
    ],
    method: `1. Mix whole wheat flour, salt and water.
2. Knead into a smooth dough.
3. Rest the dough before portioning.
4. Roll into even discs.
5. Cook on the tandoor wall until done.
6. Brush lightly with oil if requested and serve hot.`,
    portion: "2 pieces",
    prepTime: "30 min dough batch",
    holding: "Serve fresh; keep covered briefly",
    allergens: "Gluten",
    plating: "Roti basket lined with food-safe paper",
  },
  {
    name: "Kerala Parotta",
    version: 1,
    chef: "Chef Kumar",
    ingredients: [
      { name: "Maida", qty: "0.15 kg", cost: 7.50 },
      { name: "Oil", qty: "0.02 L", cost: 2.70 },
      { name: "Salt", qty: "0.003 kg", cost: 0.15 },
      { name: "Sugar", qty: "0.005 kg", cost: 0.25 },
      { name: "Water", qty: "0.07 L", cost: 0.10 },
    ],
    method: `1. Mix flour, salt, sugar, water and oil.
2. Knead until elastic and smooth.
3. Rest the dough well.
4. Stretch thinly, fold into layers and coil.
5. Roll gently and cook on a hot griddle.
6. Flake the layers and serve hot.`,
    portion: "2 pieces",
    prepTime: "60 min dough batch",
    holding: "Serve fresh; keep covered briefly",
    allergens: "Gluten",
    plating: "Stacked on a warm plate with salna",
  },
  {
    name: "Kothu Parotta",
    version: 1,
    chef: "Chef Kumar",
    ingredients: [
      { name: "Parotta", qty: "2 pcs", cost: 15.00 },
      { name: "Egg", qty: "1 pc", cost: 7.00 },
      { name: "Onion", qty: "0.05 kg", cost: 1.90 },
      { name: "Tomato", qty: "0.05 kg", cost: 2.00 },
      { name: "Salna", qty: "0.1 L", cost: 8.00 },
      { name: "Oil and Spices", qty: "0.02 kg", cost: 4.00 },
    ],
    method: `1. Chop cooked parotta into small pieces.
2. Sauté onions, tomatoes and spices on a hot griddle.
3. Add egg and cook thoroughly.
4. Add parotta and salna.
5. Chop and toss together until evenly mixed and hot.
6. Serve immediately.`,
    portion: "1 plate · 350 g",
    prepTime: "15 min",
    holding: "Serve immediately",
    allergens: "Gluten, egg; dairy if used in parotta",
    plating: "Hot plate with onion raita and salna",
  },
  {
    name: "Masala Chai",
    version: 1,
    chef: "Chef Priya",
    ingredients: [
      { name: "Milk", qty: "0.15 L", cost: 9.00 },
      { name: "Water", qty: "0.08 L", cost: 0.10 },
      { name: "Tea Powder", qty: "0.008 kg", cost: 3.00 },
      { name: "Sugar", qty: "0.012 kg", cost: 0.60 },
      { name: "Ginger and Spices", qty: "0.005 kg", cost: 2.00 },
    ],
    method: `1. Bring water to a boil with crushed ginger and spices.
2. Add tea powder and simmer briefly.
3. Add milk and sugar.
4. Simmer until the required strength is reached.
5. Strain into a serving cup.
6. Serve hot.`,
    portion: "1 cup · 180 ml",
    prepTime: "10 min",
    holding: "Prepare fresh; serve hot",
    allergens: "Dairy",
    plating: "Ceramic tea cup with saucer",
  },
  {
    name: "Cold Coffee",
    version: 1,
    chef: "Chef Priya",
    ingredients: [
      { name: "Milk", qty: "0.2 L", cost: 12.00 },
      { name: "Coffee Powder", qty: "0.008 kg", cost: 4.50 },
      { name: "Sugar", qty: "0.015 kg", cost: 0.75 },
      { name: "Ice", qty: "0.05 kg", cost: 0.50 },
      { name: "Chocolate Syrup", qty: "0.01 L", cost: 3.00 },
    ],
    method: `1. Chill milk and prepare coffee.
2. Add coffee, milk, sugar and ice to a blender.
3. Blend until smooth and frothy.
4. Drizzle chocolate syrup inside the glass.
5. Pour the blended coffee.
6. Serve immediately.`,
    portion: "1 glass · 300 ml",
    prepTime: "5 min",
    holding: "Keep refrigerated; serve fresh",
    allergens: "Dairy; check chocolate syrup label",
    plating: "Tall chilled glass with chocolate drizzle",
  },
];


const EMPTY_FORM = {
  method: "",
  portion: "",
  prepTime: "",
  holding: "",
  allergens: "",
  plating: "",
};

const formatCost = (cost) =>
  `₹${cost.toFixed(2)}`;

const SOP = () => {
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [selectedRecipe, setSelectedRecipe] =
    useState("Chicken Biryani");
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedMessage, setSavedMessage] = useState("");

  const recipe = recipes.find(
    (item) => item.name === selectedRecipe
  );

  useEffect(() => {
    setForm({
      method: recipe?.method || "",
      portion: recipe?.portion || "",
      prepTime: recipe?.prepTime || "",
      holding: recipe?.holding || "",
      allergens: recipe?.allergens || "",
      plating: recipe?.plating || "",
    });

    setSavedMessage("");
  }, [selectedRecipe, recipes]);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setSavedMessage("");
  };

  const selectRecipe = (name) => {
    setSelectedRecipe(name);
  };

  const saveSop = () => {
    setRecipes((previous) =>
      previous.map((item) =>
        item.name === selectedRecipe
          ? {
              ...item,
              ...form,
              version: item.version + 1,
            }
          : item
      )
    );

    setSavedMessage(
      `${selectedRecipe} SOP saved successfully.`
    );
  };

  const foodCost = recipe?.ingredients
    ? recipe.ingredients.reduce(
        (total, item) => total + item.cost,
        0
      )
    : 0;

  return (
    <div className="sop-page">
      <div className="sop-panel">
        <div className="sop-panel-header">
          <span className="sop-title">
            📖 Standard recipe SOP
            <span className="sop-linked-badge">
              linked to KOT
            </span>
          </span>
        </div>

        <div className="sop-content">
          <div className="sop-layout">
            {/* LEFT: RECIPE DETAILS */}
            <div className="sop-card">
              <div className="sop-card-header">
                <span>{recipe?.name}</span>
                <span className="sop-version-badge">
                  v{recipe?.version}
                  {recipe?.chef
                    ? ` · ${recipe.chef}`
                    : ""}
                </span>
              </div>

              {recipe?.ingredients ? (
                <div className="sop-table-wrapper">
                  <table className="sop-table">
                    <thead>
                      <tr>
                        <th>Ingredient</th>
                        <th className="sop-right">
                          Qty / portion
                        </th>
                        <th className="sop-right">
                          Cost
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {recipe.ingredients.map((item) => (
                        <tr key={item.name}>
                          <td>{item.name}</td>
                          <td className="sop-number sop-right">
                            {item.qty}
                          </td>
                          <td className="sop-number sop-right">
                            {formatCost(item.cost)}
                          </td>
                        </tr>
                      ))}

                      <tr className="sop-total-row">
                        <td colSpan={2}>
                          Food cost / portion
                        </td>
                        <td className="sop-number sop-right">
                          {formatCost(foodCost)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="sop-empty">
                  Ingredient details are not configured
                  for this recipe yet.
                </div>
              )}

              <div className="sop-form-group">
                <label htmlFor="sop-method">
                  Method (shown to kitchen on KOT pass)
                </label>
                <textarea
                  id="sop-method"
                  className="sop-input sop-textarea"
                  rows={8}
                  value={form.method}
                  onChange={(e) =>
                    updateField("method", e.target.value)
                  }
                  placeholder="Enter preparation steps"
                />
              </div>

              <div className="sop-fields-grid">
                <div className="sop-form-group">
                  <label htmlFor="sop-portion">
                    Portion
                  </label>
                  <input
                    id="sop-portion"
                    className="sop-input"
                    value={form.portion}
                    onChange={(e) =>
                      updateField("portion", e.target.value)
                    }
                  />
                </div>

                <div className="sop-form-group">
                  <label htmlFor="sop-prep">
                    Prep time
                  </label>
                  <input
                    id="sop-prep"
                    className="sop-input"
                    value={form.prepTime}
                    onChange={(e) =>
                      updateField("prepTime", e.target.value)
                    }
                  />
                </div>

                <div className="sop-form-group">
                  <label htmlFor="sop-holding">
                    Holding / shelf life
                  </label>
                  <input
                    id="sop-holding"
                    className="sop-input"
                    value={form.holding}
                    onChange={(e) =>
                      updateField("holding", e.target.value)
                    }
                  />
                </div>

                <div className="sop-form-group">
                  <label htmlFor="sop-allergens">
                    Allergens
                  </label>
                  <input
                    id="sop-allergens"
                    className="sop-input"
                    value={form.allergens}
                    onChange={(e) =>
                      updateField("allergens", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="sop-form-group">
                <label htmlFor="sop-plating">
                  Plating standard
                </label>
                <input
                  id="sop-plating"
                  className="sop-input"
                  value={form.plating}
                  onChange={(e) =>
                    updateField("plating", e.target.value)
                  }
                />
              </div>

              <button
                type="button"
                className="sop-save-button"
                onClick={saveSop}
              >
                ✓ Save SOP (new version)
              </button>

              {savedMessage && (
                <p className="sop-success">
                  {savedMessage}
                </p>
              )}
            </div>

            {/* RIGHT: RECIPE LIST */}
            <div className="sop-card sop-recipes-card">
              <div className="sop-card-header">
                Recipes
              </div>

              <div className="sop-recipe-list">
                {recipes.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    className={`sop-recipe-button ${
                      selectedRecipe === item.name
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      selectRecipe(item.name)
                    }
                  >
                    <span>{item.name}</span>
                    <span className="sop-muted">
                      v{item.version}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOP;
