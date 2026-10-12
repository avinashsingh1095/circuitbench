/* Calculator formulas live in this file. Keep displayed units, input validation, and worked examples in sync when editing a calculator. */
"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function showError(form, message) {
  const error = $("[data-error]", form);
  error.textContent = message;
  error.hidden = false;
  const output = $("[data-output]");
  if (output) output.replaceChildren(Object.assign(document.createElement("p"), { className: "result-placeholder", textContent: "Correct the inputs and calculate again." }));
}

function clearError(form) {
  const error = $("[data-error]", form);
  error.textContent = "";
  error.hidden = true;
}

function readPositive(form, name, label) {
  const input = $(`[name="${name}"]`, form);
  const value = Number(input.value);
  if (input.value.trim() === "" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a number greater than zero.`);
  }
  return value;
}

function format(value, digits = 4) {
  if (!Number.isFinite(value)) return "Not finite";
  return new Intl.NumberFormat(undefined, { maximumSignificantDigits: digits }).format(value);
}

function withUnit(value, unit) {
  return `${format(value)} ${unit}`;
}

function setResult(primary, rows = []) {
  const output = $("[data-output]");
  const fragment = document.createDocumentFragment();
  const value = document.createElement("p");
  value.className = "result-value";
  value.textContent = primary;
  fragment.append(value);
  if (rows.length) {
    const list = document.createElement("ul");
    list.className = "result-list";
    for (const [label, answer] of rows) {
      const item = document.createElement("li");
      const name = document.createElement("span");
      const result = document.createElement("strong");
      name.textContent = label;
      result.textContent = answer;
      item.append(name, result);
      list.append(item);
    }
    fragment.append(list);
  }
  output.replaceChildren(fragment);
}

const handlers = {
  ohms(form) {
    const fields = ["voltage", "current", "resistance"];
    const labels = { voltage: "Voltage", current: "Current", resistance: "Resistance" };
    const units = { voltage: "V", current: "A", resistance: "Ω" };
    const known = fields.filter((field) => $( `[name="${field}"]`, form).value.trim() !== "");
    if (known.length !== 2) throw new Error("Enter exactly two values; leave the value you want to find blank.");
    const values = {};
    for (const key of known) values[key] = readPositive(form, key, labels[key]);
    if (known.includes("voltage") && known.includes("current")) values.resistance = values.voltage / values.current;
    else if (known.includes("voltage") && known.includes("resistance")) values.current = values.voltage / values.resistance;
    else values.voltage = values.current * values.resistance;
    if (!Object.values(values).every((n) => Number.isFinite(n) && n > 0)) throw new Error("These values produce a result outside the supported numeric range.");
    const missing = fields.find((field) => !known.includes(field));
    setResult(`${labels[missing]} = ${withUnit(values[missing], units[missing])}`, [
      ["Voltage", withUnit(values.voltage, "V")],
      ["Current", withUnit(values.current, "A")],
      ["Resistance", withUnit(values.resistance, "Ω")],
      ["Power", withUnit(values.voltage * values.current, "W")]
    ]);
  },
  led(form) {
    const supply = readPositive(form, "supply", "Supply voltage");
    const forward = readPositive(form, "forward", "LED forward voltage");
    const milliamps = readPositive(form, "current", "LED current");
    if (forward >= supply) throw new Error("Supply voltage must be greater than the LED forward voltage.");
    const current = milliamps / 1000;
    const ideal = (supply - forward) / current;
    const resistorPower = current * current * ideal;
    const e12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
    const decade = 10 ** Math.floor(Math.log10(ideal) - 1);
    const standard = e12.map((base) => base * decade).find((value) => value >= ideal) ?? e12[0] * decade * 10;
    const selectedCurrent = (supply - forward) / standard * 1000;
    if (![ideal, resistorPower, standard, selectedCurrent].every(Number.isFinite) || ideal <= 0 || resistorPower <= 0 || selectedCurrent <= 0 || !standard) throw new Error("The required resistor is outside the calculator's supported range.");
    setResult(`Ideal resistance: ${withUnit(ideal, "Ω")}`, [
      ["Choose at least (E12)", withUnit(standard, "Ω")],
      ["Current with selected value", withUnit(selectedCurrent, "mA")],
      ["Ideal resistor dissipation", withUnit(resistorPower, "W")],
      ["Suggested power rating", `${format(resistorPower * 2)} W or higher (2× margin)`]
    ]);
  },
  divider(form) {
    const supply = readPositive(form, "supply", "Input voltage");
    const top = readPositive(form, "top", "Upper resistor");
    const bottom = readPositive(form, "bottom", "Lower resistor");
    const largest = Math.max(top, bottom);
    const scaledTop = top / largest;
    const scaledBottom = bottom / largest;
    const scaledTotal = scaledTop + scaledBottom;
    const voltage = supply * scaledBottom / scaledTotal;
    const current = (supply / largest) / scaledTotal;
    const powerTop = current * current * top;
    const powerBottom = current * current * bottom;
    if (![voltage, current, powerTop, powerBottom].every(Number.isFinite) || voltage <= 0 || current <= 0 || powerTop <= 0 || powerBottom <= 0) throw new Error("These values produce a result outside the supported numeric range.");
    setResult(`Output voltage: ${withUnit(voltage, "V")}`, [
      ["Divider current (unloaded)", withUnit(current * 1000, "mA")],
      ["Upper resistor dissipation", withUnit(powerTop, "W")],
      ["Lower resistor dissipation", withUnit(powerBottom, "W")]
    ]);
  },
  power(form) {
    const fields = ["voltage", "current", "resistance", "power"];
    const names = { voltage: "Voltage", current: "Current", resistance: "Resistance", power: "Power" };
    const units = { voltage: "V", current: "A", resistance: "Ω", power: "W" };
    const known = fields.filter((field) => $(`[name="${field}"]`, form).value.trim() !== "");
    const target = $(`[name="target"]`, form).value;
    if (known.length !== 2) throw new Error("Enter exactly two known values and leave the other two blank.");
    if (known.includes(target)) throw new Error(`Leave ${names[target].toLowerCase()} blank; it is selected as the result.`);
    const [a, b] = known;
    const values = {};
    values[a] = readPositive(form, a, names[a]);
    values[b] = readPositive(form, b, names[b]);
    const v = values.voltage, i = values.current, r = values.resistance, p = values.power;
    if (target === "voltage") {
      if (i && r) values.voltage = i * r;
      else if (i && p) values.voltage = p / i;
      else if (r && p) values.voltage = Math.sqrt(p * r);
    } else if (target === "current") {
      if (v && r) values.current = v / r;
      else if (v && p) values.current = p / v;
      else if (r && p) values.current = Math.sqrt(p / r);
    } else if (target === "resistance") {
      if (v && i) values.resistance = v / i;
      else if (v && p) values.resistance = v * v / p;
      else if (i && p) values.resistance = p / (i * i);
    } else {
      if (v && i) values.power = v * i;
      else if (v && r) values.power = v * v / r;
      else if (i && r) values.power = i * i * r;
    }
    const answer = values[target];
    if (!Number.isFinite(answer) || answer <= 0) throw new Error("These values produce a result outside the supported numeric range.");
    setResult(`${names[target]} = ${withUnit(answer, units[target])}`);
  },
  colors(form) {
    const digits = { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 };
    const multipliers = { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000, violet: 10000000, gold: .1, silver: .01 };
    const tolerances = { brown: 1, red: 2, green: .5, blue: .25, violet: .1, gray: .05, gold: 5, silver: 10 };
    const first = $(`[name="band1"]`, form).value;
    const second = $(`[name="band2"]`, form).value;
    const multiplier = $(`[name="multiplier"]`, form).value;
    const tolerance = $(`[name="tolerance"]`, form).value;
    if (![digits[first], digits[second], multipliers[multiplier], tolerances[tolerance]].every(Number.isFinite)) {
      throw new Error("Select a supported color for each resistor band.");
    }
    const value = (digits[first] * 10 + digits[second]) * multipliers[multiplier];
    if (!Number.isFinite(value) || value <= 0) throw new Error("The selected bands do not form a supported positive resistance.");
    setResult(`Resistance: ${withUnit(value, "Ω")}`, [["Tolerance", `±${format(tolerances[tolerance])}%`], ["Nominal range", `${withUnit(value * (1 - tolerances[tolerance] / 100), "Ω")} to ${withUnit(value * (1 + tolerances[tolerance] / 100), "Ω")}`]]);
    const colors = [first, second, multiplier, tolerance];
    $("[data-band-preview]", form).replaceChildren(...colors.map((color) => {
      const band = document.createElement("span");
      band.style.backgroundColor = color === "gold" ? "#c9a43b" : color === "silver" ? "#b9bdc0" : color === "violet" ? "#7041a5" : color === "gray" ? "#73777a" : color;
      band.setAttribute("aria-label", `${color} band`);
      return band;
    }));
  }
};

for (const form of $$("[data-calculator]")) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError(form);
    try {
      handlers[form.dataset.calculator](form);
    } catch (error) {
      showError(form, error instanceof Error ? error.message : "Unable to calculate. Check the values and try again.");
    }
  });
  form.addEventListener("reset", () => {
    clearError(form);
    const output = $("[data-output]");
    if (output) output.replaceChildren(Object.assign(document.createElement("p"), { className: "result-placeholder", textContent: "Enter values and select Calculate to see a result." }));
    const preview = $("[data-band-preview]", form);
    if (preview) preview.replaceChildren();
  });
}
