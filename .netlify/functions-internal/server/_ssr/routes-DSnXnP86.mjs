import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as cn, c as localRepository, d as newSection, i as appearanceForTemplate, l as newCV, o as defaultColors, p as uid, r as LayoutPicker, s as detectLocale, t as Button } from "./LayoutPicker-CHK4C1mo.mjs";
import { c as Plus, d as FileText, f as Ellipsis, g as ChevronRight, i as Upload, m as Circle, o as Trash2, r as X, v as Check } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as getDocument, t as GlobalWorkerOptions } from "../_libs/pdfjs-dist.mjs";
import { t as require_lib } from "../_libs/mammoth+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DSnXnP86.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var KNOWN_HEADER = /^(perfil(\s+profesional)?|professional\s+summary|summary|resumen|objetivo|profile|experiencia(\s+profesional|\s+laboral)?|professional\s+experience|work\s+experience|antecedentes\s+(laborales|acad[eé]micos)|employment|educaci[oó]n|education|formaci[oó]n(\s+acad[eé]mica)?|academic|proyectos|projects|portfolio|portafolio|habilidades(\s+y\s+tecnolog[ií]as)?|technical\s+skills|skills|tecnolog[ií]as|competencias|certificaciones|certifications|certificates|idiomas|languages|otros|other|additional|contacto|contact)\b/i;
var EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
var PHONE_RE = /(?:\+?\d[\d\s().-]{7,}\d)/;
var LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s|/]+/i;
var GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|/]+/i;
var URL_RE = /(?:https?:\/\/)?(?:www\.)?[a-z0-9][-a-z0-9.]*\.[a-z]{2,}(?:\/[^\s|]*)?/i;
var DATE_TOKEN = `(?:(?:ene(?:ro)?|feb(?:rero)?|mar(?:zo)?|abr(?:il)?|may(?:o)?|jun(?:io)?|jul(?:io)?|ago(?:sto)?|sep(?:t(?:iembre)?)?|oct(?:ubre)?|nov(?:iembre)?|dic(?:iembre)?|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\\s+\\d{4}|\\d{1,2}[\\/.\\-]\\d{2,4}|\\d{4})`;
var DATE_RANGE_RE = new RegExp(`((?:${DATE_TOKEN}))\\s*[-–—]\\s*((?:actual(?:idad)?|present(?:e)?|hoy|current|now|${DATE_TOKEN}))`, "i");
function normalize(text) {
	return text.replace(/\u000c/g, "\n").replace(/[\u00ad\u200b\u200c\u200d\ufeff]/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
function isBullet(line) {
	return /^[-•●▪◦*]+\s+/.test(line) || /^\u2013\s+/.test(line);
}
function stripBullet(line) {
	return line.replace(/^[-•●▪◦*\u2013]+\s+/, "").trim();
}
function isDateOnlyLine(line) {
	const t = line.replace(/[|·•]/g, " ").trim();
	const m = t.match(DATE_RANGE_RE);
	return Boolean(m && m[0].replace(/\s+/g, " ").length >= t.replace(/\s+/g, " ").length - 1);
}
function looksLikeJobHeader(line) {
	if (isBullet(line) || isDateOnlyLine(line) || line.length > 140) return false;
	if ((line.match(/\|/g) ?? []).length >= 1) return true;
	if (line === line.toUpperCase() && /[A-ZÁÉÍÓÚÑ]{3,}/.test(line) && line.length < 90 && !KNOWN_HEADER.test(line)) return true;
	return false;
}
/** Any short title-like line becomes a section (not only tech CVs). */
function looksLikeSectionHeader(line) {
	const t = line.trim();
	if (t.length < 2 || t.length > 55) return false;
	if (isBullet(t) || isDateOnlyLine(t)) return false;
	if (EMAIL_RE.test(t) || PHONE_RE.test(t)) return false;
	if (/\|/.test(t)) return false;
	if (KNOWN_HEADER.test(t)) return true;
	if (t === t.toUpperCase() && /[A-ZÁÉÍÓÚÑ]{3,}/.test(t) && !DATE_RANGE_RE.test(t)) return true;
	return false;
}
function parseContactLine(line, personal) {
	const email = line.match(EMAIL_RE)?.[0];
	if (email) personal.email = email;
	const phone = line.match(PHONE_RE)?.[0]?.replace(/\s+/g, " ").trim();
	if (phone && /[\d]{7,}/.test(phone)) personal.phone = phone;
	const linkedin = line.match(LINKEDIN_RE)?.[0];
	if (linkedin) personal.linkedin = linkedin.replace(/^https?:\/\//, "");
	const github = line.match(GITHUB_RE)?.[0];
	if (github) personal.github = github.replace(/^https?:\/\//, "");
	const parts = line.split("|").map((p) => p.trim());
	for (const p of parts) {
		if (!p) continue;
		if (EMAIL_RE.test(p) || PHONE_RE.test(p) || /linkedin|github/i.test(p) || URL_RE.test(p)) continue;
		if (!personal.city && /[a-záéíóúñ]/i.test(p)) personal.city = p;
	}
	for (const p of parts) {
		if (/linkedin|github|@/.test(p)) continue;
		const url = p.match(URL_RE)?.[0];
		if (url && !personal.website) personal.website = url.replace(/^https?:\/\//, "");
	}
}
function parseJobHeader(line) {
	const cleaned = line.replace(/\s+/g, " ").trim();
	const dateMatch = cleaned.match(DATE_RANGE_RE);
	let meta = "";
	let rest = cleaned;
	if (dateMatch) {
		meta = `${dateMatch[1].trim()} — ${dateMatch[2].trim()}`;
		rest = cleaned.replace(DATE_RANGE_RE, "").replace(/\s*[|·•]\s*$/, "").trim();
	}
	const parts = rest.split("|").map((p) => p.trim()).filter(Boolean);
	if (parts.length >= 2) return {
		heading: parts[0],
		subheading: parts.slice(1).join(" · "),
		meta
	};
	return {
		heading: parts[0] || cleaned,
		subheading: "",
		meta
	};
}
function parseEntries(body) {
	const entries = [];
	let cur = null;
	const flush = [];
	const push = () => {
		if (!cur) return;
		const lines = flush.map((l) => l.replace(/^[-•●▪◦*]+\s*/, "").trim()).filter(Boolean);
		cur.body = lines.join("\n");
		const hadBullets = flush.some((l) => /^[-•]/.test(l.trim()) || l.startsWith("•"));
		cur.bodyFormat = hadBullets || lines.length > 1 ? "bullets" : "text";
		flush.length = 0;
		entries.push(cur);
		cur = null;
	};
	for (let i = 0; i < body.length; i++) {
		const line = body[i].trim();
		if (!line) continue;
		if (looksLikeJobHeader(line)) {
			push();
			const h = parseJobHeader(line);
			const next = body[i + 1]?.trim() ?? "";
			if (!h.meta && isDateOnlyLine(next)) {
				const dm = next.match(DATE_RANGE_RE);
				h.meta = `${dm[1].trim()} — ${dm[2].trim()}`;
				i++;
			}
			cur = {
				id: uid(),
				body: "",
				bodyFormat: "bullets",
				...h
			};
			continue;
		}
		if (!cur) continue;
		if (isBullet(line)) flush.push(`• ${stripBullet(line)}`);
		else if (isDateOnlyLine(line) && !cur.meta) {
			const dm = line.match(DATE_RANGE_RE);
			cur.meta = `${dm[1].trim()} — ${dm[2].trim()}`;
		} else if (flush.length) flush[flush.length - 1] += ` ${line}`;
		else flush.push(line);
	}
	push();
	return entries;
}
function guessKind(title, body) {
	if (/habilidad|skill|competenc|tecnolog|idioma|language/i.test(title)) return "tags";
	const joined = body.filter(Boolean);
	if (joined.filter((l) => looksLikeJobHeader(l) || isDateOnlyLine(l)).length >= 1) return "entries";
	if (joined.length <= 8 && joined.every((l) => l.length < 80 || l.includes(","))) {
		if (joined.some((l) => l.includes(",")) || joined.length >= 3) return "tags";
	}
	return "text";
}
function splitBlocks(text) {
	const lines = normalize(text).split(/\n/);
	const blocks = [{
		title: "__header__",
		body: []
	}];
	let current = blocks[0];
	for (const raw of lines) {
		const line = raw.trim();
		if (!line) {
			current.body.push("");
			continue;
		}
		if (looksLikeSectionHeader(line)) {
			if (current.title === "__header__" && !current.body.some(Boolean)) {
				current.body.push(line);
				continue;
			}
			current = {
				title: line,
				body: []
			};
			blocks.push(current);
			continue;
		}
		current.body.push(line);
	}
	return blocks;
}
function parseCvText(raw, titleHint) {
	const locale = detectLocale(raw);
	const cv = newCV(titleHint ?? "Imported CV", locale);
	cv.sections = [];
	const accent = defaultColors.sectionTitle;
	const blocks = splitBlocks(raw);
	const header = blocks.find((b) => b.title === "__header__");
	if (header) {
		const nonempty = header.body.map((l) => l.trim()).filter(Boolean);
		let idx = 0;
		if (nonempty[0] && /^curriculum/i.test(nonempty[0])) idx = 1;
		if (nonempty[idx]) cv.personal.fullName = nonempty[idx];
		for (const line of nonempty.slice(idx + 1, idx + 8)) {
			if (/\|/.test(line) || EMAIL_RE.test(line) || PHONE_RE.test(line) || /contacto:|cel\.|tel\./i.test(line)) {
				parseContactLine(line, cv.personal);
				continue;
			}
			if (!cv.personal.title && line.length < 80 && !looksLikeSectionHeader(line)) cv.personal.title = line;
		}
	}
	for (const block of blocks) {
		if (block.title === "__header__") continue;
		const kind = guessKind(block.title, block.body);
		const section = {
			...newSection(block.title, kind, { title: accent }),
			kind
		};
		if (kind === "entries") {
			section.entries = parseEntries(block.body);
			if (!section.entries.length) {
				section.kind = "text";
				section.body = block.body.filter(Boolean).join("\n");
			}
		} else if (kind === "tags") section.body = block.body.filter(Boolean).map((l) => stripBullet(l)).join("\n");
		else section.body = block.body.filter(Boolean).join("\n");
		if (/portafolio|portfolio/i.test(block.title)) for (const line of block.body) {
			const url = line.match(URL_RE)?.[0];
			if (url && !/linkedin|github/i.test(url)) cv.personal.website = url.replace(/^https?:\/\//, "");
		}
		cv.sections.push(section);
	}
	if (!cv.sections.length) cv.sections = [{
		...newSection(locale === "es" ? "Contenido" : "Content", "text"),
		body: normalize(raw)
	}];
	cv.title = cv.personal.fullName || titleHint || "Imported CV";
	if (locale === "es") {
		cv.appearance.fontSize = 10.5;
		cv.appearance.spacing = 1.25;
		cv.appearance.margin = 16;
	}
	return cv;
}
GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
async function textFromPdf(data) {
	const doc = await getDocument({ data }).promise;
	const pages = [];
	for (let i = 1; i <= doc.numPages; i++) {
		const items = (await (await doc.getPage(i)).getTextContent()).items;
		const lines = [];
		for (const it of items) {
			if (!it.str) continue;
			const x = it.transform[4];
			const y = Math.round(it.transform[5]);
			let line = lines.find((l) => Math.abs(l.y - y) <= 2);
			if (!line) {
				line = {
					y,
					parts: []
				};
				lines.push(line);
			}
			line.parts.push({
				x,
				t: it.str
			});
		}
		lines.sort((a, b) => b.y - a.y);
		pages.push(lines.map((l) => l.parts.sort((a, b) => a.x - b.x).map((p) => p.t).join("").replace(/\s+/g, " ").trim()).filter(Boolean).join("\n"));
	}
	return pages.join("\n");
}
async function textFromDocx(data) {
	return (await import_lib.extractRawText({ arrayBuffer: data })).value;
}
async function importCvFromFile(file) {
	const name = file.name.replace(/\.(pdf|docx)$/i, "");
	const buf = await file.arrayBuffer();
	const lower = file.name.toLowerCase();
	let text;
	if (lower.endsWith(".pdf")) text = await textFromPdf(buf);
	else if (lower.endsWith(".docx")) text = await textFromDocx(buf);
	else throw new Error("Solo PDF o DOCX");
	if (!text.trim()) throw new Error("No se pudo leer texto del archivo");
	return parseCvText(text, name);
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function Dashboard() {
	const [cvs, setCVs] = (0, import_react.useState)([]);
	const [importing, setImporting] = (0, import_react.useState)(false);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [pickedLayout, setPickedLayout] = (0, import_react.useState)("minimal");
	const fileRef = (0, import_react.useRef)(null);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		localRepository.list().then(setCVs);
	}, []);
	const create = async (template) => {
		const cv = newCV("Untitled CV", "es", template);
		await localRepository.save(cv);
		setCreateOpen(false);
		navigate({
			to: "/cv/$id",
			params: { id: cv.id }
		});
	};
	const remove = async (id) => {
		await localRepository.remove(id);
		setCVs((prev) => prev.filter((c) => c.id !== id));
	};
	const onImport = async (file) => {
		if (!file) return;
		setImporting(true);
		try {
			const cv = await importCvFromFile(file);
			cv.appearance = appearanceForTemplate(cv.appearance.template ?? "minimal", cv.appearance);
			await localRepository.save(cv);
			toast.success("CV importado — revisá los campos y ajustá lo que falte");
			navigate({
				to: "/cv/$id",
				params: { id: cv.id }
			});
		} catch (err) {
			console.error(err);
			toast.error(err instanceof Error ? err.message : "No se pudo importar el archivo");
		} finally {
			setImporting(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	};
	const openCreate = () => {
		setPickedLayout("minimal");
		setCreateOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-neutral-100",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-4xl mx-auto px-6 h-14 flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-5 rounded bg-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold tracking-tight",
								children: "Mitrilo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-neutral-400",
								children: "/ Resumes"
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "max-w-4xl mx-auto px-6 py-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between mb-10 gap-4 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight",
						children: "Your resumes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-neutral-500 mt-1",
						children: "Importá un PDF/DOCX, editá los campos y exportá de nuevo a PDF."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
								className: "hidden",
								onChange: (e) => onImport(e.target.files?.[0])
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "h-9 gap-1.5",
								disabled: importing,
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), importing ? "Importando…" : "Import PDF/DOCX"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: openCreate,
								className: "h-9 gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New resume"]
							})
						]
					})]
				}), cvs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full border border-dashed border-neutral-200 rounded-xl py-20 flex flex-col items-center justify-center text-neutral-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
							className: "h-6 w-6 mb-3",
							strokeWidth: 1.5
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: "Todavía no hay resumes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs mt-1 text-neutral-400 mb-4",
							children: "Importá tu CV o empezá en blanco"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								disabled: importing,
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5 mr-1.5" }), "Import PDF/DOCX"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: openCreate,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1.5" }), "New resume"]
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-neutral-100 border-y border-neutral-100",
					children: cvs.map((cv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "group flex items-center justify-between py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cv/$id",
							params: { id: cv.id },
							className: "flex-1 flex items-center gap-4 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-8 rounded-sm border border-neutral-200 bg-white flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-4 bg-neutral-300 rounded-full" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium truncate",
									children: cv.personal.fullName || cv.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-neutral-500 truncate",
									children: [
										cv.appearance.template === "classic" ? "Classic" : "Minimal",
										" ·",
										" ",
										cv.personal.title || "No title",
										" · Edited",
										" ",
										new Date(cv.updatedAt).toLocaleDateString()
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 opacity-0 group-hover:opacity-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
							align: "end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => remove(cv.id),
								className: "text-destructive focus:text-destructive",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-2" }), " Delete"]
							})
						})] })]
					}, cv.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Elegí el layout" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Podés cambiarlo después en el editor. Esto solo define el punto de partida." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutPicker, {
							value: pickedLayout,
							onChange: setPickedLayout
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setCreateOpen(false),
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => create(pickedLayout),
								children: "Crear resume"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Dashboard as component };
