"use client";

import {
  CaretDown,
  CheckCircle,
  Code,
  DownloadSimple,
  Eye,
  FileText,
  GearSix,
  Plus,
  UploadSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { ChangeEvent, CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PaperSize = "A4" | "A5" | "Letter" | "Legal";
type Orientation = "portrait" | "landscape";
type MarginSize = "small" | "normal" | "large";
type DocumentTheme = "light" | "dark";
type MobileTab = "editor" | "preview";

type Settings = {
  paperSize: PaperSize;
  orientation: Orientation;
  margin: MarginSize;
  theme: DocumentTheme;
};

type Notice = {
  type: "success" | "error";
  message: string;
};

const DEFAULT_MARKDOWN = `# Catatan yang siap dibagikan

Tulis Markdown di sebelah kiri. Hasilnya langsung terlihat sebagai dokumen yang rapi.

## Yang bisa Anda lakukan

- [x] Menulis dan melihat preview langsung
- [x] Mengunggah file \`.md\`
- [x] Mengatur halaman dokumen
- [ ] Menyimpan hasil sebagai PDF

> Semua isi diproses di browser Anda. Dokumen tidak dikirim ke server.

## Contoh tabel

| Fitur | Status |
| --- | --- |
| Preview langsung | Siap |
| GitHub Flavored Markdown | Siap |
| Ekspor PDF | Siap |

## Potongan kode

\`\`\`js
const dokumen = "Markdown";
console.log(\`\${dokumen} siap menjadi PDF\`);
\`\`\`

Mulai ubah contoh ini atau unggah dokumen Anda sendiri.`;

const DEFAULT_SETTINGS: Settings = {
  paperSize: "A4",
  orientation: "portrait",
  margin: "normal",
  theme: "light",
};

const STORAGE_KEY = "md-to-pdf:document:v1";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const PAPER_RATIOS: Record<PaperSize, { portrait: number; landscape: number }> = {
  A4: { portrait: 297 / 210, landscape: 210 / 297 },
  A5: { portrait: 210 / 148, landscape: 148 / 210 },
  Letter: { portrait: 11 / 8.5, landscape: 8.5 / 11 },
  Legal: { portrait: 14 / 8.5, landscape: 8.5 / 14 },
};

const PAPER_PRINT_NAMES: Record<PaperSize, string> = {
  A4: "A4",
  A5: "A5",
  Letter: "letter",
  Legal: "legal",
};

const MARGIN_VALUES: Record<MarginSize, { preview: string; print: string }> = {
  small: { preview: "42px", print: "12mm" },
  normal: { preview: "64px", print: "18mm" },
  large: { preview: "86px", print: "25mm" },
};

function sanitizeBaseName(fileName: string | null) {
  const source = fileName?.replace(/\.(md|markdown)$/i, "") || "document";
  const cleaned = source
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return cleaned || "document";
}

export default function MarkdownWorkspace() {
  const [source, setSource] = useState(DEFAULT_MARKDOWN);
  const [fileName, setFileName] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("editor");
  const [notice, setNotice] = useState<Notice | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          source?: string;
          fileName?: string | null;
          settings?: Partial<Settings>;
        };
        if (typeof parsed.source === "string") setSource(parsed.source);
        if (typeof parsed.fileName === "string" || parsed.fileName === null) {
          setFileName(parsed.fileName);
        }
        if (parsed.settings) {
          setSettings((current) => ({ ...current, ...parsed.settings }));
        }
      }
    } catch {
      setNotice({
        type: "error",
        message: "Draft lokal tidak dapat dipulihkan. Editor tetap dapat digunakan.",
      });
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const saveTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ source, fileName, settings }),
        );
        setIsDirty(false);
      } catch {
        setNotice({
          type: "error",
          message: "Draft tidak dapat disimpan di browser ini.",
        });
      }
    }, 700);

    return () => window.clearTimeout(saveTimer);
  }, [fileName, isHydrated, settings, source]);

  useEffect(() => {
    if (!notice) return;
    const noticeTimer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(noticeTimer);
  }, [notice]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [settingsOpen]);

  const lineCount = useMemo(() => Math.max(1, source.split("\n").length), [source]);
  const wordCount = useMemo(() => {
    const stripped = source
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>*_`[\]()!-]/g, " ")
      .trim();
    return stripped ? stripped.split(/\s+/).length : 0;
  }, [source]);

  const paperStyle = useMemo(() => {
    const ratio = PAPER_RATIOS[settings.paperSize][settings.orientation];
    return {
      "--paper-margin": MARGIN_VALUES[settings.margin].preview,
      "--print-margin": MARGIN_VALUES[settings.margin].print,
      "--paper-min-height": `${Math.round(720 * ratio)}px`,
    } as CSSProperties;
  }, [settings]);

  const onSourceChange = (value: string) => {
    setSource(value);
    setIsDirty(true);
  };

  const updateSetting = <Key extends keyof Settings>(
    key: Key,
    value: Settings[Key],
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setIsDirty(true);
  };

  const handleNewDocument = () => {
    if (source.trim() && !window.confirm("Hapus isi editor dan mulai dokumen baru?")) {
      return;
    }
    setSource("");
    setFileName(null);
    setIsDirty(true);
    setMobileTab("editor");
    setNotice({ type: "success", message: "Dokumen baru siap digunakan." });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!/\.(md|markdown)$/i.test(file.name)) {
      setNotice({
        type: "error",
        message: "Gunakan file dengan ekstensi .md atau .markdown.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setNotice({
        type: "error",
        message: "Ukuran file melebihi batas 5 MB.",
      });
      return;
    }

    if (
      source.trim() &&
      source !== DEFAULT_MARKDOWN &&
      !window.confirm("Ganti isi editor dengan file yang dipilih?")
    ) {
      return;
    }

    try {
      const contents = await file.text();
      setSource(contents);
      setFileName(file.name);
      setIsDirty(true);
      setNotice({ type: "success", message: `${file.name} berhasil dimuat.` });
    } catch {
      setNotice({
        type: "error",
        message: "File tidak dapat dibaca. Isi editor tidak berubah.",
      });
    }
  };

  const handleEditorScroll = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  const handleExport = () => {
    if (!source.trim()) {
      setNotice({
        type: "error",
        message: "Tulis atau unggah Markdown sebelum membuat PDF.",
      });
      return;
    }

    setIsExporting(true);
    const previousTitle = document.title;
    const exportName = sanitizeBaseName(fileName);
    document.title = exportName;

    document.getElementById("md-print-config")?.remove();
    const printStyle = document.createElement("style");
    printStyle.id = "md-print-config";
    printStyle.textContent = `@page { size: ${PAPER_PRINT_NAMES[settings.paperSize]} ${settings.orientation}; margin: 0; }`;
    document.head.appendChild(printStyle);

    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      document.title = previousTitle;
      setIsExporting(false);
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);

    window.setTimeout(() => {
      setNotice({
        type: "success",
        message: `Pilih "Save as PDF" pada dialog cetak untuk menyimpan ${exportName}.pdf.`,
      });
      window.print();
      window.setTimeout(restore, 1500);
    }, 180);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand" aria-label="MD to PDF">
          <span className="brand-mark">
            <FileText size={19} weight="duotone" aria-hidden="true" />
          </span>
          <span className="brand-name">
            MD <span className="brand-arrow">to</span> PDF
          </span>
        </div>

        <div className="document-identity">
          <p className="document-name">{fileName || "Dokumen tanpa judul"}</p>
          <p className="save-status" aria-live="polite">
            {isDirty ? "Menyimpan perubahan..." : "Tersimpan di perangkat"}
          </p>
        </div>

        <div className="topbar-actions">
          <button
            className="button button-quiet"
            type="button"
            onClick={handleNewDocument}
            aria-label="Dokumen baru"
            title="Dokumen baru"
          >
            <Plus size={18} aria-hidden="true" />
          </button>

          <input
            ref={fileInputRef}
            className="hidden-input"
            type="file"
            accept=".md,.markdown,text/markdown,text/plain"
            onChange={handleFileChange}
            aria-label="Pilih file Markdown"
          />
          <button
            className="button button-secondary"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadSimple size={17} aria-hidden="true" />
            <span className="button-label-optional">Unggah</span>
          </button>

          <button
            className="button button-primary"
            type="button"
            onClick={handleExport}
            disabled={isExporting}
          >
            <DownloadSimple size={17} aria-hidden="true" />
            {isExporting ? "Menyiapkan..." : "Unduh PDF"}
          </button>
        </div>
      </header>

      <div className="mobile-tabs" role="tablist" aria-label="Tampilan dokumen">
        <button
          className="mobile-tab"
          type="button"
          role="tab"
          aria-selected={mobileTab === "editor"}
          onClick={() => setMobileTab("editor")}
        >
          Editor
        </button>
        <button
          className="mobile-tab"
          type="button"
          role="tab"
          aria-selected={mobileTab === "preview"}
          onClick={() => setMobileTab("preview")}
        >
          Preview
        </button>
      </div>

      <section className="workspace" aria-label="Editor dan preview Markdown">
        <section
          className="panel"
          aria-labelledby="editor-title"
          data-mobile-active={mobileTab === "editor"}
        >
          <header className="panel-header">
            <div className="panel-title-group">
              <Code size={17} color="#533afd" aria-hidden="true" />
              <h1 className="panel-title" id="editor-title">
                Markdown
              </h1>
            </div>
            <span className="panel-meta">
              {lineCount} baris, {wordCount} kata
            </span>
          </header>

          <div className="editor-wrap">
            <div className="line-numbers" ref={lineNumbersRef} aria-hidden="true">
              {Array.from({ length: lineCount }, (_, index) => (
                <span key={index}>{index + 1}</span>
              ))}
            </div>
            <textarea
              className="markdown-input"
              value={source}
              onChange={(event) => onSourceChange(event.target.value)}
              onScroll={handleEditorScroll}
              spellCheck="false"
              aria-label="Editor Markdown"
              placeholder="# Mulai menulis Markdown..."
            />
          </div>
        </section>

        <section
          className="panel print-surface"
          aria-labelledby="preview-title"
          data-mobile-active={mobileTab === "preview"}
        >
          <header className="panel-header">
            <div className="panel-title-group">
              <Eye size={17} color="#533afd" aria-hidden="true" />
              <h2 className="panel-title" id="preview-title">
                Preview
              </h2>
              <span className="panel-meta">
                {settings.paperSize},{" "}
                {settings.orientation === "portrait" ? "Potret" : "Lanskap"}
              </span>
            </div>
            <div className="panel-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setSettingsOpen(true)}
                aria-haspopup="dialog"
              >
                <GearSix size={17} aria-hidden="true" />
                Pengaturan
              </button>
            </div>
          </header>

          <div className="preview-wrap">
            <div className="paper-shell">
              <article
                className="document-page"
                data-theme={settings.theme}
                style={paperStyle}
              >
                {source.trim() ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ children, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                      img: ({ alt, ...props }) => (
                        <img {...props} alt={alt || "Gambar dokumen"} loading="lazy" />
                      ),
                    }}
                  >
                    {source}
                  </ReactMarkdown>
                ) : (
                  <div className="empty-preview">
                    <div className="empty-preview-inner">
                      <FileText size={34} weight="duotone" aria-hidden="true" />
                      <h2>Dokumen masih kosong</h2>
                      <p>Tulis Markdown di editor atau unggah file untuk melihat hasilnya.</p>
                    </div>
                  </div>
                )}
              </article>
            </div>
          </div>
        </section>
      </section>

      {settingsOpen && (
        <>
          <button
            className="settings-backdrop"
            type="button"
            onClick={() => setSettingsOpen(false)}
            aria-label="Tutup pengaturan"
          />
          <aside
            className="settings-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <header className="settings-header">
              <h2 id="settings-title">Pengaturan dokumen</h2>
              <button
                className="button button-quiet"
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Tutup pengaturan"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>

            <div className="settings-content">
              <div className="setting-group">
                <label className="setting-label" htmlFor="paper-size">
                  Ukuran kertas
                </label>
                <div className="select-wrap">
                  <select
                    id="paper-size"
                    value={settings.paperSize}
                    onChange={(event) =>
                      updateSetting("paperSize", event.target.value as PaperSize)
                    }
                  >
                    <option value="A4">A4</option>
                    <option value="A5">A5</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                  <CaretDown size={15} aria-hidden="true" />
                </div>
              </div>

              <div className="setting-group">
                <span className="setting-label">Orientasi</span>
                <div className="segmented-control" aria-label="Orientasi halaman">
                  <button
                    className="segment"
                    type="button"
                    aria-pressed={settings.orientation === "portrait"}
                    onClick={() => updateSetting("orientation", "portrait")}
                  >
                    Potret
                  </button>
                  <button
                    className="segment"
                    type="button"
                    aria-pressed={settings.orientation === "landscape"}
                    onClick={() => updateSetting("orientation", "landscape")}
                  >
                    Lanskap
                  </button>
                </div>
              </div>

              <div className="setting-group">
                <label className="setting-label" htmlFor="page-margin">
                  Margin
                </label>
                <div className="select-wrap">
                  <select
                    id="page-margin"
                    value={settings.margin}
                    onChange={(event) =>
                      updateSetting("margin", event.target.value as MarginSize)
                    }
                  >
                    <option value="small">Kecil</option>
                    <option value="normal">Normal</option>
                    <option value="large">Besar</option>
                  </select>
                  <CaretDown size={15} aria-hidden="true" />
                </div>
              </div>

              <div className="setting-group">
                <span className="setting-label">Tema dokumen</span>
                <div className="segmented-control" aria-label="Tema dokumen">
                  <button
                    className="segment"
                    type="button"
                    aria-pressed={settings.theme === "light"}
                    onClick={() => updateSetting("theme", "light")}
                  >
                    Terang
                  </button>
                  <button
                    className="segment"
                    type="button"
                    aria-pressed={settings.theme === "dark"}
                    onClick={() => updateSetting("theme", "dark")}
                  >
                    Gelap
                  </button>
                </div>
                <p className="setting-help">
                  Warna tema ikut diterapkan saat dokumen dicetak.
                </p>
              </div>
            </div>

            <footer className="settings-footer">
              <button
                className="button button-primary"
                type="button"
                onClick={() => setSettingsOpen(false)}
              >
                Terapkan
              </button>
            </footer>
          </aside>
        </>
      )}

      {notice && (
        <div className="notice" data-type={notice.type} role="status" aria-live="polite">
          {notice.type === "success" ? (
            <CheckCircle size={19} weight="fill" aria-hidden="true" />
          ) : (
            <WarningCircle size={19} weight="fill" aria-hidden="true" />
          )}
          <span>{notice.message}</span>
        </div>
      )}
    </main>
  );
}
