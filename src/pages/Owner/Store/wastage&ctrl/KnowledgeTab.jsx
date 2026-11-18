
import { useState } from "react";
import { Brain, Search, BookOpen, FileText, ShieldCheck } from "lucide-react";



const KNOWLEDGE_DATA = [
  {
    keywords: ["chicken biryani", "biryani", "prepare biryani"],
    title: "Chicken Biryani Preparation",
    category: "Approved Recipe",
    content: [
      "Measure basmati rice and chicken according to the approved recipe card.",
      "Prepare the biryani masala using the specified ingredients and quantities.",
      "Cook chicken thoroughly. Verify the core temperature reaches at least 75°C.",
      "Combine rice and chicken masala and finish the dum cooking process.",
      "Record the batch quantity and update production stock.",
    ],
  },
  {
    keywords: ["stock write-off", "write off", "stock wastage"],
    title: "Stock Write-off Procedure",
    category: "Inventory SOP",
    content: [
      "Identify the damaged, expired or unusable stock.",
      "Record the item name, quantity and reason for write-off.",
      "Capture the required manager approval.",
      "Update the inventory ledger with a WASTE or WRITE-OFF movement.",
      "Retain the incident and approval details for audit.",
    ],
  },
  {
    keywords: ["chicken", "chicken variance", "variance"],
    title: "Chicken Stock Variance",
    category: "Inventory Policy",
    content: [
      "Compare opening stock, purchases, transfers and closing stock.",
      "Check chicken usage against the approved recipe BOM.",
      "Review portion sizes and kitchen issue records.",
      "Record the variance reason and investigate unusual differences.",
      "Obtain manager approval for any required stock adjustment.",
    ],
  },
  {
    keywords: ["food safety", "temperature", "cold chain", "chiller"],
    title: "Food Safety Temperature SOP",
    category: "Food Safety SOP",
    content: [
      "Maintain chilled food at 5°C or below.",
      "Maintain frozen stock at the approved freezer operating temperature.",
      "Maintain hot-held food at 65°C or above.",
      "Record temperature readings and investigate breaches.",
      "Quarantine potentially unsafe food until it is assessed and released by an authorized person.",
    ],
  },
  {
    keywords: ["purchase", "purchase order", "po approval"],
    title: "Purchase Order Approval",
    category: "Purchase Policy",
    content: [
      "Review the stock requirement and reorder quantity.",
      "Verify the approved vendor and purchase rate.",
      "Submit the purchase order for authorized approval.",
      "Record received quantity against the purchase order.",
      "Update inventory after goods receipt verification.",
    ],
  },
  {
    keywords: ["recipe", "bom", "ingredients"],
    title: "Recipe and BOM Policy",
    category: "Recipe SOP",
    content: [
      "Use only approved recipe cards.",
      "Follow the specified ingredient quantities and units.",
      "Record recipe version changes after authorization.",
      "Deduct ingredients based on approved recipe consumption.",
      "Review recipe adherence and investigate variances.",
    ],
  },
];

function KnowledgeTab() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState("");

  const askKnowledge = (value = question) => {
    const query = value.trim().toLowerCase();

    if (!query) {
      setError("Please enter a question.");
      setAnswer(null);
      return;
    }

    setQuestion(value);
    setError("");

    const result = KNOWLEDGE_DATA.find((item) =>
      item.keywords.some((keyword) => query.includes(keyword))
    );

    if (!result) {
      setAnswer(null);
      setError(
        "No matching approved knowledge article found. Please check the approved recipe cards, SOPs or policies."
      );
      return;
    }

    setAnswer(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      askKnowledge();
    }
  };

  return (
    <div className="knowledge-brain">

      <div className="knowledge-brain-card">

        {/* HEADER */}
        <div className="knowledge-brain-header">
          <div className="knowledge-brain-heading">
            <Brain size={18} />
            <span>Restaurant knowledge brain</span>
          </div>

          <span className="knowledge-brain-status">
            <ShieldCheck size={13} />
            Approved knowledge
          </span>
        </div>

        {/* SEARCH */}
        <div className="knowledge-brain-search">
          <div className="knowledge-brain-input-wrap">
            <Search size={16} />

            <input
              type="text"
              placeholder="e.g. How do I prepare chicken biryani? · stock write-off procedure"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="knowledge-brain-ask"
            onClick={() => askKnowledge()}
          >
            Ask
          </button>
        </div>

        {/* ANSWER */}
        <div className="knowledge-brain-output">

          {error && (
            <div className="knowledge-brain-error">
              {error}
            </div>
          )}

          {answer && (
            <div className="knowledge-brain-result">

              <div className="knowledge-brain-result-header">
                <div>
                  <span className="knowledge-brain-category">
                    <FileText size={12} />
                    {answer.category}
                  </span>

                  <h3>{answer.title}</h3>
                </div>

                <BookOpen size={19} />
              </div>

              <ol className="knowledge-brain-list">
                {answer.content.map((item, index) => (
                  <li key={index}>
                    <span className="knowledge-brain-number">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>

              <div className="knowledge-brain-source">
                <ShieldCheck size={13} />
                Answer from demo approved knowledge data.
              </div>

            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="knowledge-brain-note">
          Answers come from approved recipe cards, SOPs and
          policies — the same source that drives stock deduction.
        </div>

      </div>

    </div>
  );
}

export default KnowledgeTab;
