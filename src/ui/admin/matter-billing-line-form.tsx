"use client";

import { useState } from "react";

export type MatterBillingTemplateOption = {
  id: string;
  label: string;
  description: string;
  category: "TIME" | "FOLIO" | "PAGE" | "FIXED_TARIFF" | "DISBURSEMENT" | "ADJUSTMENT" | "CORRECTION";
  amountCents: number;
  vatTreatment: "VAT_ON_FEES" | "NO_VAT" | "VAT_EXEMPT" | "CUSTOM";
  displayAmount: string;
};

export type MatterBillingDraftValues = {
  description: string;
  category: MatterBillingTemplateOption["category"];
  unitAmountCents: string;
  vatTreatment: MatterBillingTemplateOption["vatTreatment"];
};

export function findBillingTemplateDraftValues(
  billingItems: readonly MatterBillingTemplateOption[],
  templateId: string
): MatterBillingDraftValues | null {
  const template = billingItems.find((item) => item.id === templateId);

  if (!template) {
    return null;
  }

  return {
    description: template.description || template.label,
    category: template.category,
    unitAmountCents: String(template.amountCents),
    vatTreatment: template.vatTreatment
  };
}

export function MatterBillingLineForm({
  matterId,
  billingItems
}: Readonly<{
  matterId: string;
  billingItems: readonly MatterBillingTemplateOption[];
}>) {
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MatterBillingTemplateOption["category"]>("TIME");
  const [unitAmountCents, setUnitAmountCents] = useState("");
  const [vatTreatment, setVatTreatment] = useState<MatterBillingTemplateOption["vatTreatment"]>("VAT_ON_FEES");

  function handleTemplateChange(value: string) {
    setSelectedTemplateId(value);
    const draftValues = findBillingTemplateDraftValues(billingItems, value);

    if (!draftValues) {
      return;
    }

    setDescription(draftValues.description);
    setCategory(draftValues.category);
    setUnitAmountCents(draftValues.unitAmountCents);
    setVatTreatment(draftValues.vatTreatment);
  }

  return (
    <form
      className="compact-admin-form"
      action={`/admin/matters/${matterId}/billing-lines/create`}
      method="post"
      aria-label="Staging matter billing line form"
    >
      <input type="hidden" name="matterId" value={matterId} />
      <label className="admin-form-field--wide">
        <span className="admin-form-field__label">Reusable invoice item</span>
        <span className="admin-form-field__help">
          Select a saved Invoice Items template to prefill this matter billing line, or keep manual entry.
        </span>
        <select
          value={selectedTemplateId}
          onChange={(event) => handleTemplateChange(event.target.value)}
          aria-label="Reusable invoice item template"
        >
          <option value="">Manual billing entry</option>
          {billingItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label} - {item.displayAmount}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-form-field--wide">
        <span className="admin-form-field__label">Billing description</span>
        <span className="admin-form-field__help">Describe the work or disbursement for this matter.</span>
        <input
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Consultation, drafting, filing fee"
          required
        />
      </label>
      <label>
        <span className="admin-form-field__label">Category</span>
        <span className="admin-form-field__help">Choose the billing type for this draft line.</span>
        <select
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value as MatterBillingTemplateOption["category"])}
        >
          <option value="TIME">Time</option>
          <option value="FOLIO">Folio</option>
          <option value="PAGE">Page</option>
          <option value="FIXED_TARIFF">Fixed tariff</option>
          <option value="DISBURSEMENT">Disbursement</option>
          <option value="ADJUSTMENT">Adjustment</option>
          <option value="CORRECTION">Correction</option>
        </select>
      </label>
      <label>
        <span className="admin-form-field__label">Quantity</span>
        <span className="admin-form-field__help">Use whole units only for staging tests.</span>
        <input name="quantity" type="number" min="1" step="1" defaultValue="1" required />
      </label>
      <label>
        <span className="admin-form-field__label">Unit amount cents</span>
        <span className="admin-form-field__help">Enter cents only. R850.00 is 85000.</span>
        <input
          name="unitAmountCents"
          type="number"
          min="0"
          step="1"
          value={unitAmountCents}
          onChange={(event) => setUnitAmountCents(event.target.value)}
          placeholder="85000"
          required
        />
      </label>
      <label>
        <span className="admin-form-field__label">VAT treatment</span>
        <span className="admin-form-field__help">VAT stays draft/configurable and is not final tax advice.</span>
        <select
          name="vatTreatment"
          value={vatTreatment}
          onChange={(event) => setVatTreatment(event.target.value as MatterBillingTemplateOption["vatTreatment"])}
        >
          <option value="VAT_ON_FEES">VAT on fees</option>
          <option value="NO_VAT">No VAT</option>
          <option value="VAT_EXEMPT">VAT exempt</option>
          <option value="CUSTOM">Custom</option>
        </select>
      </label>
      <button type="submit">Add Draft Billing Line</button>
    </form>
  );
}
