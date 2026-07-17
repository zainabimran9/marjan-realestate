import { useMemo, useState } from "react";
import { formatPrice } from "../lib/api";

// A straightforward down-payment + installment calculator — no interest,
// matching how property here is actually sold (booking amount + fixed
// monthly installments), not a bank loan/EMI model.
export default function InstallmentCalculator({ defaultPrice = 8500000 }) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPct, setDownPct] = useState(20);
  const [months, setMonths] = useState(24);

  const { downPayment, remaining, monthly } = useMemo(() => {
    const dp = Math.round((price * downPct) / 100);
    const rem = price - dp;
    const m = months > 0 ? Math.round(rem / months) : 0;
    return { downPayment: dp, remaining: rem, monthly: m };
  }, [price, downPct, months]);

  return (
    <div className="form-card">
      <h3 style={{ marginBottom: 4 }}>Payment Plan Calculator</h3>
      <p style={{ fontSize: ".85rem", color: "var(--ink-soft)", marginBottom: 24 }}>
        Estimate a booking amount and monthly installments — no interest, just a straightforward split.
      </p>

      <div className="field" style={{ marginBottom: 18 }}>
        <label htmlFor="calc-price">Unit Price (PKR)</label>
        <input
          type="number"
          id="calc-price"
          min="0"
          step="100000"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value) || 0)}
        />
      </div>

      <div className="field" style={{ marginBottom: 18 }}>
        <label htmlFor="calc-down">Down Payment — {downPct}%</label>
        <input
          type="range"
          id="calc-down"
          min="10"
          max="50"
          step="5"
          value={downPct}
          onChange={(e) => setDownPct(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div className="field" style={{ marginBottom: 24 }}>
        <label htmlFor="calc-months">Installment Period</label>
        <select id="calc-months" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
          <option value={12}>12 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
          <option value={48}>48 months</option>
        </select>
      </div>

      <div className="spec-list" style={{ marginTop: 0 }}>
        <div className="spec-item">
          <div className="num">{formatPrice(downPayment)}</div>
          <div className="lbl">Down Payment</div>
        </div>
        <div className="spec-item">
          <div className="num">{formatPrice(remaining)}</div>
          <div className="lbl">Remaining Balance</div>
        </div>
        <div className="spec-item" style={{ gridColumn: "1 / -1" }}>
          <div className="num" style={{ color: "var(--coral)", fontSize: "1.3rem" }}>{formatPrice(monthly)} / month</div>
          <div className="lbl">Estimated Installment &middot; {months} months</div>
        </div>
      </div>

      <p style={{ fontSize: ".78rem", color: "var(--ink-soft)", marginTop: 16 }}>
        This is an estimate for planning purposes — confirm the exact payment schedule with our sales office.
      </p>
    </div>
  );
}
