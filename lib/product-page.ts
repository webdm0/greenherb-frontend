import type { ProductDetail } from "@/lib/product-detail"
export { formatDate } from "@/lib/formatters"

export function formatCategoryLabel(category: string) {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" & ")
}

export function formatDietaryLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function formatFormLabel(form: string) {
  return form
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function buildCategoryHref(category: string) {
  return `/category/${category}`
}

export function formatSupplyLabel(servingsPerContainer: number) {
  return servingsPerContainer >= 100
    ? `Up to ${servingsPerContainer} servings`
    : `${servingsPerContainer} servings`
}

export function getCountLabel(form: ProductDetail["form"]) {
  switch (form) {
    case "capsules":
      return "Capsules"
    case "tablets":
      return "Tablets"
    case "gummies":
      return "Gummies"
    case "teas":
      return "Tea bags"
    case "liquid-extracts":
      return "Bottle size"
    case "powders":
      return "Container size"
    default:
      return "Count"
  }
}

export function getCountValue(product: ProductDetail) {
  if (!product.countInPack) {
    return null
  }

  switch (product.form) {
    case "capsules":
      return `${product.countInPack} capsules`
    case "tablets":
      return `${product.countInPack} tablets`
    case "gummies":
      return `${product.countInPack} gummies`
    case "teas":
      return `${product.countInPack} tea bags`
    case "liquid-extracts":
      return `${product.countInPack} ml bottle`
    case "powders":
      return `${product.countInPack} g container`
    default:
      return `${product.countInPack} count`
  }
}

export function getServingLabel(form: ProductDetail["form"]) {
  return form === "liquid-extracts" ? "Suggested use" : "Serving size"
}

export function getServingValue(product: ProductDetail) {
  if (product.form === "liquid-extracts") {
    return `${product.servingSize} daily`
  }

  return `${product.servingSize} per serving`
}

type ProductContent = {
  heroKicker: string
  madeForTitle: string
  madeForBody: string
  purityTitle: string
  purityBody: string
  freshnessTitle: string
  overviewTitle: string
}

type DietaryContent = {
  eyebrow: string
  title: string
  points: string[]
}

function getCategoryContent(category: ProductDetail["category"]): ProductContent {
  switch (category) {
    case "stress-sleep":
      return {
        heroKicker: "Sleep and relaxation support",
        madeForTitle: "Good for evenings",
        madeForBody:
          "A practical choice for evening routines focused on relaxation, winding down, and better rest.",
        purityTitle: "Simple formula",
        purityBody:
          "Focused on the main ingredients people usually look for in sleep and relaxation support.",
        freshnessTitle: "Latest review",
        overviewTitle: "Evening support made for daily use",
      }
    case "immunity":
      return {
        heroKicker: "Daily immune support",
        madeForTitle: "Made for everyday use",
        madeForBody:
          "Built for regular use with familiar vitamins, herbs, and daily support ingredients.",
        purityTitle: "Straightforward ingredients",
        purityBody:
          "Keeps the formula focused on the main active ingredients without overcomplicating it.",
        freshnessTitle: "Latest review",
        overviewTitle: "Everyday support you can keep in rotation",
      }
    case "joint-mobility":
      return {
        heroKicker: "Joint and mobility support",
        madeForTitle: "For daily movement",
        madeForBody:
          "A practical option for people looking to support joint comfort, mobility, and active routines.",
        purityTitle: "Focused support",
        purityBody:
          "Built around core movement-support ingredients without extra clutter.",
        freshnessTitle: "Latest review",
        overviewTitle: "Support for comfort and everyday flexibility",
      }
    case "energy":
      return {
        heroKicker: "Energy and focus support",
        madeForTitle: "For daytime routines",
        madeForBody:
          "Made for daily routines centered on steady energy, focus, and daytime balance.",
        purityTitle: "Clear ingredient profile",
        purityBody:
          "Keeps the ingredient list easy to understand and simple to work into a daily schedule.",
        freshnessTitle: "Latest review",
        overviewTitle: "Daytime support without extra fuss",
      }
    case "digestive":
      return {
        heroKicker: "Digestive support for daily routines",
        madeForTitle: "For everyday comfort",
        madeForBody:
          "A routine-friendly option for digestive comfort, gut balance, and daily use.",
        purityTitle: "Easy to understand",
        purityBody:
          "Built around familiar digestive support ingredients in a simple, readable formula.",
        freshnessTitle: "Latest review",
        overviewTitle: "A simple choice for daily digestive support",
      }
    default:
      return {
        heroKicker: "Everyday wellness support",
        madeForTitle: "For daily routines",
        madeForBody:
          "A practical everyday product with ingredients commonly used in wellness routines.",
        purityTitle: "Simple formula",
        purityBody:
          "Keeps things focused on the main ingredients without trying to do too much at once.",
        freshnessTitle: "Latest review",
        overviewTitle: "Everyday support with a clear purpose",
      }
  }
}

function includesAny(value: string, phrases: string[]) {
  return phrases.some((phrase) => value.includes(phrase))
}

export function parseIngredientsList(value: string) {
  const ingredients: string[] = []
  let current = ""
  let parenthesesDepth = 0

  for (const character of value) {
    if (character === "(") {
      parenthesesDepth += 1
      current += character
      continue
    }

    if (character === ")") {
      parenthesesDepth = Math.max(0, parenthesesDepth - 1)
      current += character
      continue
    }

    if (character === "," && parenthesesDepth === 0) {
      const ingredient = current.trim()

      if (ingredient) {
        ingredients.push(ingredient)
      }

      current = ""
      continue
    }

    current += character
  }

  const finalIngredient = current.trim()

  if (finalIngredient) {
    ingredients.push(finalIngredient)
  }

  return ingredients
}

export function parseSentenceList(value: string) {
  const sentences: string[] = []
  const abbreviations = new Set(["dr.", "mr.", "mrs.", "ms.", "e.g.", "i.e.", "etc."])
  let current = ""

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    current += character

    if (![".", "!", "?"].includes(character)) {
      continue
    }

    const nextCharacter = value[index + 1]
    const followingCharacter = value[index + 2]

    if (
      character === "." &&
      /\d/.test(value[index - 1] ?? "") &&
      /\d/.test(nextCharacter ?? "")
    ) {
      continue
    }

    const normalizedCurrent = current.trim().toLowerCase()

    if (abbreviations.has(normalizedCurrent.slice(normalizedCurrent.lastIndexOf(" ") + 1))) {
      continue
    }

    if (nextCharacter === " " && /[A-Z]/.test(followingCharacter ?? "")) {
      const sentence = current.trim()

      if (sentence) {
        sentences.push(sentence)
      }

      current = ""
      index += 1
    }
  }

  const finalSentence = current.trim()

  if (finalSentence) {
    sentences.push(finalSentence)
  }

  return sentences
}

export function getProductContent(product: ProductDetail): ProductContent {
  const categoryContent = getCategoryContent(product.category)
  const searchableText = [
    product.name,
    product.ingredients,
    product.howToUse,
    product.description,
  ]
    .join(" ")
    .toLowerCase()

  if (
    includesAny(searchableText, ["melatonin"]) ||
    includesAny(searchableText, ["before bedtime", "bedtime", "restful sleep"])
  ) {
    return {
      heroKicker: "Sleep support for evening use",
      madeForTitle: "Made for nighttime routines",
      madeForBody:
        "A practical evening option for people looking to support relaxation and more consistent sleep habits.",
      purityTitle: "Simple evening formula",
      purityBody:
        "Built around familiar bedtime ingredients in a format that is easy to keep in your nightly routine.",
      freshnessTitle: "Latest review",
      overviewTitle: "A straightforward option for better nighttime routines",
    }
  }

  if (
    includesAny(searchableText, ["vitamin d3", "vitamin d", "cholecalciferol"]) &&
    includesAny(searchableText, ["vitamin k2", "menaquinone", "k2"])
  ) {
    return {
      heroKicker: "Daily vitamin support for bones and immunity",
      madeForTitle: "Everyday basics",
      madeForBody:
        "An easy daily option for customers looking for foundational vitamin support.",
      purityTitle: "Focused daily formula",
      purityBody:
        "Combines familiar nutrients in a simple formula that fits neatly into everyday use.",
      freshnessTitle: "Latest review",
      overviewTitle: "A simple daily staple for steady routines",
    }
  }

  if (includesAny(searchableText, ["omega-3", "fish oil", "epa", "dha"])) {
    return {
      heroKicker: "Omega support for everyday use",
      madeForTitle: "A daily staple",
      madeForBody:
        "A classic everyday supplement often chosen for general heart, brain, and joint support.",
      purityTitle: "Classic, simple formula",
      purityBody:
        "Keeps the formula focused and easy to understand for repeat daily use.",
      freshnessTitle: "Latest review",
      overviewTitle: "A familiar everyday omega option",
    }
  }

  if (includesAny(searchableText, ["ashwagandha", "rhodiola", "adaptogen"])) {
    return {
      heroKicker: "Adaptogen support for daily balance",
      madeForTitle: "Good for busy routines",
      madeForBody:
        "Made for people looking to add adaptogens to a steady daily routine.",
      purityTitle: "Balanced ingredient profile",
      purityBody:
        "A more direct formula that keeps the ingredient story clear and approachable.",
      freshnessTitle: "Latest review",
      overviewTitle: "Adaptogen support that is easy to work into daily use",
    }
  }

  if (product.form === "liquid-extracts") {
    return {
      ...categoryContent,
      madeForBody:
        "Comes in a liquid format that is easy to measure and easy to fit into a daily routine.",
    }
  }

  if (product.form === "gummies") {
    return {
      ...categoryContent,
      madeForBody:
        "An easy-to-take format for people who prefer a simpler daily routine.",
    }
  }

  return categoryContent
}

export function getUsageCue(product: ProductDetail) {
  const usageText = product.howToUse.toLowerCase()

  if (includesAny(usageText, ["before bedtime", "bedtime"])) {
    return "Bedtime routine"
  }

  if (includesAny(usageText, ["with meals", "with food"])) {
    return "Best with meals"
  }

  if (includesAny(usageText, ["as needed"])) {
    return "Flexible support"
  }

  if (
    product.form === "liquid-extracts" &&
    includesAny(usageText, ["mixed with food", "mixed with", "beverage"])
  ) {
    return "Easy to mix"
  }

  if (product.form === "powders" && includesAny(usageText, ["mix", "water"])) {
    return "Easy to mix"
  }

  if (includesAny(usageText, ["daily", "once daily"])) {
    return "Daily routine"
  }

  return formatFormLabel(product.form)
}

export function getPurityContent(product: ProductDetail) {
  const ingredientCount = parseIngredientsList(product.ingredients).length

  if (ingredientCount <= 4) {
    return {
      title: "Minimal formula",
      body: "A shorter ingredient list keeps the formula easy to read and easier to compare while shopping.",
    }
  }

  if (includesAny(product.description.toLowerCase(), ["blend", "comprehensive"])) {
    return {
      title: "Comprehensive blend",
      body: "Brings several commonly paired ingredients together in one formula for customers who prefer an all-in-one option.",
    }
  }

  if (product.dietary.includes("organic")) {
    return {
      title: "Clean sourcing",
      body: "Made with sourcing and ingredient quality in mind for customers who pay close attention to labels.",
    }
  }

  return {
    title: "Focused essentials",
    body: "Keeps the focus on the main active ingredients without adding extra complexity.",
  }
}

export function getDietaryContent(product: ProductDetail): DietaryContent {
  const usageText = product.howToUse.toLowerCase()
  const dietaryTitle = product.dietary.length > 0 ? "Dietary fit" : "Formula notes"

  const supportingPoints = [
    product.dietary.includes("organic")
      ? "Includes organic ingredients where listed on the label."
      : null,
    product.dietary.includes("vegan") ? "Suitable for plant-based routines." : null,
    product.dietary.includes("gluten-free")
      ? "Suitable for gluten-free diets."
      : null,
    product.dietary.includes("non-gmo")
      ? "Made with non-GMO ingredients."
      : null,
    product.dietary.includes("sugar-free")
      ? "A good fit for lower-sugar routines."
      : null,
    includesAny(usageText, ["with meals", "with food"])
      ? "Easy to take with meals."
      : null,
    includesAny(usageText, ["before bedtime", "bedtime"])
      ? "Well suited to evening use."
      : null,
    product.form === "liquid-extracts"
      ? "Liquid format for flexible everyday use."
      : null,
    product.form === "gummies"
      ? "Easy-to-take format for daily use."
      : null,
  ].filter(Boolean) as string[]

  return {
    eyebrow: product.dietary.length > 0 ? "Clean labels" : "Formula notes",
    title: dietaryTitle,
    points: supportingPoints.slice(0, 2),
  }
}

export function getProductHighlights(product: ProductDetail) {
  const countValue = getCountValue(product)

  return [
    { label: "Dosage", value: product.dosage },
    { label: getServingLabel(product.form), value: getServingValue(product) },
    ...(countValue
      ? [{ label: getCountLabel(product.form), value: countValue }]
      : []),
    ...(product.servingsPerContainer
      ? [
          {
            label: "Supply",
            value: formatSupplyLabel(product.servingsPerContainer),
          },
        ]
      : []),
  ]
}
