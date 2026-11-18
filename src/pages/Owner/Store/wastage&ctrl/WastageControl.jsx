
import { useState } from "react";
import {
  MessageCircle,
  Sparkles,
  Store,
  Factory,
  Snowflake,
  Brain,
  Send,
  ArrowLeft,
} from "lucide-react";

import "../../../../assets/styles/admin/waste-control.css";
import WhatIfSimulatorTab from "./WhatIfSimulatorTab";
import OutletTab from "./OutletTab";
import CentralKitchenTab from "./CentralKitchenTab";
import ColdChainTab from "./ColdChainTab";
import KnowledgeTab from "./KnowledgeTab";
import { useNavigate } from "react-router-dom";

const TABS = [
  { id: "wa", label: "WhatsApp", icon: MessageCircle },
  { id: "wi", label: "What-if", icon: Sparkles },
  { id: "out", label: "Outlets", icon: Store },
  { id: "ck", label: "Central kitchen", icon: Factory },
  { id: "cc", label: "Cold chain", icon: Snowflake },
  { id: "kb", label: "Knowledge", icon: Brain },
];

const QUICK_PROMPTS = [
  "Today's status",
  "Approve PO 1824",
  "Yes",
  "What if biryani +₹20",
  "What if chicken +15%",
  "Why is waste high?",
  "Chicken variance",
  "Compare outlets",
  "How do I prepare chicken biryani?",
  "Stock write-off procedure",
];

const BOT_REPLIES = {
  "Today's status":
    "Today's sales: ₹45,680. 12 orders pending, 3 KOTs in kitchen and 4 stock alerts. Overall operations running normally.",

  "Approve PO 1824":
    "PO #1824 is pending approval. Vendor: Sri Lakshmi Traders. Amount: ₹6,195. Do you want to approve?",

  "What if biryani +₹20":
    "If biryani price increases by ₹20, contribution per plate increases by ₹20, assuming sales volume and costs remain unchanged.",

  "What if chicken +15%":
    "Chicken purchase cost increases by 15%. This reduces contribution margin on chicken-based dishes. Review recipe costing and selling prices.",

  "Why is waste high?":
    "Waste is above the expected level. Check production overages, expired stock, portion control and kitchen returns.",

  "Chicken variance":
    "Chicken stock variance detected. Check opening stock, purchase entries, production usage, sales consumption and closing stock.",

  "Compare outlets":
    "Outlet comparison: Review Anna Nagar, T Nagar and OMR sales, food cost, wastage and order volume to identify the best-performing outlet.",

  "How do I prepare chicken biryani?":
    "Chicken Biryani SOP:\n1. Verify ingredients.\n2. Prepare masala.\n3. Cook chicken.\n4. Add rice.\n5. Dum cook.\n6. Complete quality checks. Ensure the required core cooking temperature reaches 75°C.",

  "Stock write-off procedure":
    "Stock write-off procedure:\n1. Select stock item.\n2. Enter quantity.\n3. Provide write-off reason.\n4. Attach supporting evidence.\n5. Submit for manager approval.\n6. Record adjustment in stock ledger.",
};

function WasteControl() {
  const [activeTab, setActiveTab] = useState("wa");
  const [message, setMessage] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi Rajesh 👋 Ask me anything — try Today's status, Approve PO 1824, What if biryani +₹20.",
    },
  ]);

  // SEND CHAT MESSAGE
  const sendChat = (text = message) => {
    const value = text.trim();

    if (!value) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { type: "user", text: value },
    ]);

    setMessage("");

    let reply = BOT_REPLIES[value];

    // PO approval request
    if (value === "Approve PO 1824") {
      setPendingApproval(true);
    }

    // PO approval confirmation
    else if (value.toLowerCase() === "yes") {
      if (pendingApproval) {
        reply =
          "✅ PO #1824 approval confirmed in demo mode. Audit entry created.";

        setPendingApproval(false);
      } else {
        reply =
          "No pending approval found. Please request PO approval first.";
      }
    }

    // Default reply
    if (!reply) {
      reply =
        "I'm BOS Assistant 🤖 Please ask about sales, purchases, stock, waste, production or outlet performance.";
    }

    // Add bot reply
    setMessages((prev) => [
      ...prev,
      { type: "bot", text: reply },
    ]);
  };

  // ENTER KEY
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendChat();
    }
  };

  return (
    <div className="waste-control">

      {/* HEADER */}
      <div className="waste-control-header">
        <div className="waste-control-title">
          🎛 Control tower
          <span className="waste-control-badge">owner</span>
        </div>

        <span className="waste-control-muted">
          All outlets
        </span>
      </div>

      {/* TABS */}
      <div className="waste-control-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              className={`waste-control-chip ${activeTab === tab.id ? "active" : ""
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="waste-control-content">

        {activeTab === "wa" && (
          <div className="waste-control-grid">

            {/* WHATSAPP CHAT */}
            <div className="waste-control-card waste-control-chat-card">

              <div className="waste-control-card-header">
                <span>BOS on WhatsApp</span>

                <span className="waste-control-online">
                  online
                </span>
              </div>

              {/* CHAT MESSAGES */}
              <div className="waste-control-chat-box">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`waste-control-message ${msg.type === "user" ? "user" : "bot"
                      }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* MESSAGE INPUT */}
              <div className="waste-control-input-row">
                <input
                  type="text"
                  placeholder="Message BOS..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <button
                  className="waste-control-send"
                  onClick={() => sendChat()}
                >
                  Send
                  <Send size={13} />
                </button>
              </div>

            </div>

            {/* QUICK PROMPTS */}
            <div className="waste-control-card">

              <div className="waste-control-card-header">
                Try these
              </div>

              <div className="waste-control-prompts">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className="waste-control-chip"
                    onClick={() => sendChat(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <p className="waste-control-note">
                Approvals ask for confirmation first and are
                written to the audit trail. Live Business API
                wiring comes later; this runs on the live demo data.
              </p>

            </div>

          </div>
        )}
        {activeTab === "wi" && (
          <WhatIfSimulatorTab />
        )}
        {activeTab === "out" && (
          <OutletTab />
        )}
        {activeTab === "ck" && (
          <CentralKitchenTab />
        )}
        {activeTab === "cc" && (
          <ColdChainTab />
        )}
        {activeTab === "kb" && (
          <KnowledgeTab />
        )}
        <div className="wastage-back">
          <button className="staff-back-btn" onClick={() => navigate('/admin/store')}>
            <ArrowLeft size={14} />  Store
          </button>
        </div>
      </div>

    </div>
  );
}

export default WasteControl;
