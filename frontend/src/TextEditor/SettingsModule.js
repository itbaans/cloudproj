// SettingsModule.js - Custom Quill plugin
import Quill from "quill";
import { FiMoreHorizontal } from "react-icons/fi"; // React icon
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
    wrapper.style.position = "relative";

    const button = document.createElement("button");

    const iconHTML = ReactDOMServer.renderToString(<FiMoreHorizontal />);
    button.innerHTML = iconHTML;
    button.style.cssText = `
      font-size: 18px;
      padding: 4px 8px;
      cursor: pointer;
      background: none;
      border: none;
    `;

    const menu = document.createElement("div");
    
    menu.className = "settings-menu";
    menu.style.cssText = `
      display: none;
      position: absolute;
      right: 0;
      top: 32px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);
      z-index: 1000;
    `;

    const items = [
      { label: "Export as PDF", value: "pdf" },
      { label: "Export as DOCX", value: "docx" },
      { label: "Export as Text", value: "txt" },
      { separator: true },
      { label: "Delete Note", value: "delete" },
    ];

    items.forEach((item) => {
      if (item.separator) {
        const hr = document.createElement("hr");
        hr.style.margin = "4px 0";
        menu.appendChild(hr);
      } else {
        const opt = document.createElement("div");
        opt.textContent = item.label;
        opt.dataset.value = item.value;
        opt.style.cssText = `
          padding: 6px 12px;
          cursor: pointer;
          white-space: nowrap;
        `;
        opt.addEventListener("click", () => {
          menu.style.display = "none";
          this.handleOption(item.value);
        });
        menu.appendChild(opt);
      }
    });

    button.addEventListener("click", () => {
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
        window.dispatchEvent(new CustomEvent("delete-note"));
        break;
    }
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
