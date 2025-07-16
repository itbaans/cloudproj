// SettingsModule.js - Custom Quill plugin
import Quill from "quill";
import { 
  FiMoreHorizontal, 
  FiFileText, 
  FiDownload, 
  FiType, 
  FiTrash2,
  FiAlertTriangle 
} from "react-icons/fi";
import ReactDOMServer from "react-dom/server";
import { useAuth } from "../Authentication/AuthContext";
import { useNote } from "../Components/NoteContext";

class SettingsModule {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.toolbar = quill.getModule("toolbar");
    this.init();
  }

  init() {
    setTimeout(() => {
      this.addSettingsDropdown();
    }, 100);
  }

  addSettingsDropdown() {
    const toolbar = document.querySelector("#custom-toolbar");
    if (!toolbar || toolbar.querySelector(".settings-dropdown")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "toolbar-group settings-dropdown";
    wrapper.style.cssText = `
      position: relative;
      display: inline-block;
    `;

    const button = document.createElement("button");
    const iconHTML = ReactDOMServer.renderToString(<FiMoreHorizontal />);
    button.innerHTML = iconHTML;
    button.style.cssText = `
      font-size: 18px;
      padding: 6px 8px;
      cursor: pointer;
      background: none;
      border: none;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      color: #374151;
    `;

    // Add hover effects
    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = "#f3f4f6";
      button.style.color = "#111827";
    });

    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = "transparent";
      button.style.color = "#374151";
    });

    const menu = document.createElement("div");
    menu.className = "settings-menu";
    menu.style.cssText = `
      display: none;
      position: absolute;
      right: 0;
      top: 40px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 1000;
      min-width: 180px;
      overflow: hidden;
    `;

    const items = [
      { 
        label: "Export as PDF", 
        value: "pdf", 
        icon: <FiFileText />,
        color: "#dc2626"
      },
      { 
        label: "Export as DOCX", 
        value: "docx", 
        icon: <FiDownload />,
        color: "#2563eb"
      },
      { 
        label: "Export as Text", 
        value: "txt", 
        icon: <FiType />,
        color: "#059669"
      },
      { separator: true },
      { 
        label: "Delete Note", 
        value: "delete", 
        icon: <FiTrash2 />,
        color: "#dc2626",
        danger: true
      },
    ];

    items.forEach((item) => {
      if (item.separator) {
        const hr = document.createElement("hr");
        hr.style.cssText = `
          margin: 4px 0;
          border: none;
          border-top: 1px solid #e5e7eb;
        `;
        menu.appendChild(hr);
      } else {
        const opt = document.createElement("div");
        
        const iconHTML = ReactDOMServer.renderToString(item.icon);
        opt.innerHTML = `
          <span class="menu-icon" style="color: ${item.color};">${iconHTML}</span>
          <span class="menu-label">${item.label}</span>
        `;
        
        opt.dataset.value = item.value;
        opt.style.cssText = `
          padding: 10px 12px;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          color: ${item.danger ? '#dc2626' : '#374151'};
          font-size: 14px;
          font-weight: 500;
        `;

        // Add hover effects for menu items
        opt.addEventListener("mouseenter", () => {
          opt.style.backgroundColor = item.danger ? "#fef2f2" : "#f9fafb";
          opt.style.color = item.danger ? "#b91c1c" : "#111827";
        });

        opt.addEventListener("mouseleave", () => {
          opt.style.backgroundColor = "transparent";
          opt.style.color = item.danger ? "#dc2626" : "#374151";
        });

        opt.addEventListener("click", () => {
          menu.style.display = "none";
          this.handleOption(item.value);
        });
        
        menu.appendChild(opt);
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        menu.style.display = "none";
      }
    });

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    });

    wrapper.appendChild(button);
    wrapper.appendChild(menu);
    toolbar.appendChild(wrapper);
  }

  handleOption(option) {
    const content = this.quill.root.innerHTML;
    const text = this.quill.getText();

    switch (option) {
      case "pdf":
        this.exportAsPDF(content);
        break;
      case "docx":
        this.exportAsDocx(content);
        break;
      case "txt":
        this.exportAsText(text);
        break;
      case "delete":
        this.showDeleteConfirmation();
        break;
    }
  }

  showDeleteConfirmation() {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create modal
    const modal = document.createElement("div");
    modal.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: modalSlideIn 0.3s ease-out;
    `;

    // Add animation keyframes
    const style = document.createElement("style");
    style.textContent = `
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    document.head.appendChild(style);

    const iconHTML = ReactDOMServer.renderToString(<FiAlertTriangle />);
    
    modal.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="color: #f59e0b; font-size: 24px;">${iconHTML}</div>
        <h3 style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">Delete Note</h3>
      </div>
      <p style="color: #6b7280; margin: 0 0 20px 0; line-height: 1.5;">
        Are you sure you want to delete this note? This action cannot be undone.
      </p>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button id="cancel-delete" style="
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        ">Cancel</button>
        <button id="confirm-delete" style="
          padding: 8px 16px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        ">Delete</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add button hover effects
    const cancelBtn = modal.querySelector("#cancel-delete");
    const confirmBtn = modal.querySelector("#confirm-delete");

    cancelBtn.addEventListener("mouseenter", () => {
      cancelBtn.style.backgroundColor = "#f9fafb";
      cancelBtn.style.borderColor = "#9ca3af";
    });

    cancelBtn.addEventListener("mouseleave", () => {
      cancelBtn.style.backgroundColor = "white";
      cancelBtn.style.borderColor = "#d1d5db";
    });

    confirmBtn.addEventListener("mouseenter", () => {
      confirmBtn.style.backgroundColor = "#b91c1c";
    });

    confirmBtn.addEventListener("mouseleave", () => {
      confirmBtn.style.backgroundColor = "#dc2626";
    });

    // Handle clicks
    cancelBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
      document.head.removeChild(style);
    });

    confirmBtn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("delete-note"));
      document.body.removeChild(overlay);
      document.head.removeChild(style);
    });

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        document.head.removeChild(style);
      }
    });

    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        document.body.removeChild(overlay);
        document.head.removeChild(style);
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);
  }

  exportAsPDF(content) {
    import("html2pdf.js").then((html2pdf) => {
      html2pdf.default()
        .from(content)
        .set({
          margin: 0.5,
          filename: "document.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save();
    });
  }

  exportAsDocx(content) {
    import("html-docx-js/dist/html-docx").then((htmlDocx) => {
      const doc = htmlDocx.default.asBlob(content);
      const url = URL.createObjectURL(doc);
      const link = document.createElement("a");
      link.href = url;
      link.download = "document.docx";
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  exportAsText(text) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.txt";
    link.click();
    URL.revokeObjectURL(url);
  }
}

Quill.register("modules/settings", SettingsModule);
export default SettingsModule;
