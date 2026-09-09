import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LayoutPicker-CHK4C1mo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var uid = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
var defaultColors = {
	accent: "#111111",
	name: "#111111",
	title: "#404040",
	sectionTitle: "#111111",
	subtitle: "#525252"
};
var newEntry = () => ({
	id: uid(),
	heading: "",
	subheading: "",
	meta: "",
	body: "",
	bodyFormat: "bullets"
});
var newSection = (title = "Nueva sección", kind = "text", colors) => ({
	id: uid(),
	title,
	kind,
	titleColor: colors?.title ?? defaultColors.sectionTitle,
	subtitleColor: colors?.subtitle ?? defaultColors.subtitle,
	body: "",
	entries: kind === "entries" ? [newEntry()] : []
});
var defaultAppearance = () => ({
	template: "minimal",
	font: "Inter",
	fontSize: 11,
	spacing: 1.4,
	accentColor: defaultColors.accent,
	nameColor: defaultColors.name,
	titleColor: defaultColors.title,
	margin: 18,
	atsMode: false
});
/** Apply layout + sensible default colors for that template. */
function appearanceForTemplate(template, base) {
	const a = {
		...base ?? defaultAppearance(),
		template
	};
	if (template === "classic") return {
		...a,
		accentColor: a.accentColor === "#111111" ? "#3B7A8A" : a.accentColor,
		nameColor: a.nameColor === "#111111" ? "#3B7A8A" : a.nameColor
	};
	return {
		...a,
		accentColor: a.accentColor === "#3B7A8A" ? "#111111" : a.accentColor,
		nameColor: a.nameColor === "#3B7A8A" ? "#111111" : a.nameColor
	};
}
var emptyPersonal = () => ({
	fullName: "",
	title: "",
	email: "",
	phone: "",
	city: "",
	linkedin: "",
	github: "",
	website: ""
});
var STARTER = {
	es: [
		{
			title: "Perfil profesional",
			kind: "text"
		},
		{
			title: "Experiencia",
			kind: "entries"
		},
		{
			title: "Educación",
			kind: "entries"
		},
		{
			title: "Habilidades",
			kind: "tags"
		}
	],
	en: [
		{
			title: "Professional summary",
			kind: "text"
		},
		{
			title: "Experience",
			kind: "entries"
		},
		{
			title: "Education",
			kind: "entries"
		},
		{
			title: "Skills",
			kind: "tags"
		}
	]
};
var defaultSections = (locale = "es") => STARTER[locale].map((s) => newSection(s.title, s.kind));
var newCV = (title = "Untitled CV", locale = "es", template = "minimal") => {
	const now = Date.now();
	return {
		id: uid(),
		title,
		createdAt: now,
		updatedAt: now,
		locale,
		personal: emptyPersonal(),
		sections: defaultSections(locale),
		appearance: appearanceForTemplate(template)
	};
};
function cloneBundle(personal, sections) {
	return {
		personal: { ...personal },
		sections: sections.map((s) => ({
			...s,
			entries: s.entries.map((e) => ({ ...e }))
		}))
	};
}
/** Swap active locale. First time: copies current content into the other slot (manual edit, no AI). */
function switchLocale(cv, next) {
	if (cv.locale === next) return cv;
	const current = cloneBundle(cv.personal, cv.sections);
	if (cv.otherLocale) return {
		...cv,
		locale: next,
		personal: { ...cv.otherLocale.personal },
		sections: cv.otherLocale.sections.map((s) => ({
			...s,
			entries: s.entries.map((e) => ({ ...e }))
		})),
		otherLocale: current
	};
	const seeded = cloneBundle(cv.personal, cv.sections);
	const titles = STARTER[next];
	seeded.sections = seeded.sections.map((s, i) => ({
		...s,
		title: titles[i]?.title ?? s.title
	}));
	return {
		...cv,
		locale: next,
		personal: seeded.personal,
		sections: seeded.sections,
		otherLocale: current
	};
}
function detectLocale(text) {
	const t = text.toLowerCase();
	return (t.match(/perfil profesional|experiencia|habilidades|educaci[oó]n|antecedentes|resumen|idiomas/g) ?? []).length >= (t.match(/professional summary|experience|skills|education|certifications|languages/g) ?? []).length ? "es" : "en";
}
/** Lift localStorage v1 (fixed fields) → sections model. */
function migrateCV(raw) {
	const r = raw;
	if (r && Array.isArray(r.sections)) {
		const cv = r;
		const template = cv.appearance?.template === "classic" ? "classic" : "minimal";
		return {
			...newCV(cv.title || "Untitled CV", cv.locale || "es"),
			...cv,
			locale: cv.locale === "en" ? "en" : "es",
			personal: {
				...emptyPersonal(),
				...cv.personal
			},
			appearance: {
				...defaultAppearance(),
				...cv.appearance,
				template
			},
			sections: (cv.sections ?? []).map((s) => ({
				...newSection(s.title || "Section", s.kind || "text"),
				...s,
				entries: s.entries ?? [],
				body: s.body ?? "",
				titleColor: s.titleColor || defaultColors.sectionTitle,
				subtitleColor: s.subtitleColor || defaultColors.subtitle
			}))
		};
	}
	const legacy = r;
	const accent = legacy.appearance?.accentColor ?? defaultColors.accent;
	const labels = legacy.appearance?.sectionLabels ?? {};
	const order = legacy.appearance?.sectionOrder ?? [
		"summary",
		"experience",
		"education",
		"projects",
		"skills",
		"certifications"
	];
	const sections = [];
	const push = (build) => {
		const s = build();
		if (s) sections.push(s);
	};
	for (const key of order) if (key === "summary") push(() => {
		if (!legacy.summary?.trim()) return null;
		return {
			...newSection(labels.summary || "Summary", "text", { title: accent }),
			body: legacy.summary
		};
	});
	else if (key === "experience") push(() => {
		if (!legacy.experience?.length) return null;
		return {
			...newSection(labels.experience || "Experience", "entries", { title: accent }),
			entries: legacy.experience.map((e) => ({
				id: e.id || uid(),
				heading: e.role || "",
				subheading: [
					e.company,
					e.city,
					e.modality
				].filter(Boolean).join(" · "),
				meta: [e.startDate, e.endDate].filter(Boolean).join(" — "),
				body: e.description || ""
			}))
		};
	});
	else if (key === "education") push(() => {
		if (!legacy.education?.length) return null;
		return {
			...newSection(labels.education || "Education", "entries", { title: accent }),
			entries: legacy.education.map((e) => ({
				id: e.id || uid(),
				heading: e.degree || "",
				subheading: e.institution || "",
				meta: [e.startDate, e.endDate].filter(Boolean).join(" — "),
				body: ""
			}))
		};
	});
	else if (key === "projects") push(() => {
		if (!legacy.projects?.length) return null;
		return {
			...newSection(labels.projects || "Projects", "entries", { title: accent }),
			entries: legacy.projects.map((p) => ({
				id: p.id || uid(),
				heading: p.name || "",
				subheading: p.technologies || "",
				meta: p.link || "",
				body: p.description || ""
			}))
		};
	});
	else if (key === "skills") push(() => {
		const lines = (legacy.skills ?? []).filter((g) => g.items?.length).map((g) => `${g.category}: ${g.items.join(", ")}`);
		if (!lines.length) return null;
		return {
			...newSection(labels.skills || "Skills", "tags", { title: accent }),
			body: lines.join("\n")
		};
	});
	else if (key === "certifications") push(() => {
		if (!legacy.certifications?.length) return null;
		return {
			...newSection(labels.certifications || "Certifications", "entries", { title: accent }),
			entries: legacy.certifications.map((c) => ({
				id: c.id || uid(),
				heading: c.name || "",
				subheading: c.issuer || "",
				meta: c.date || "",
				body: ""
			}))
		};
	});
	const now = Date.now();
	const blob = JSON.stringify(legacy);
	return {
		id: legacy.id || uid(),
		title: legacy.title || "Untitled CV",
		createdAt: legacy.createdAt || now,
		updatedAt: legacy.updatedAt || now,
		locale: detectLocale(blob),
		personal: {
			...emptyPersonal(),
			...legacy.personal
		},
		sections: sections.length > 0 ? sections : defaultSections(detectLocale(blob)),
		appearance: {
			...defaultAppearance(),
			...legacy.appearance,
			accentColor: accent,
			nameColor: legacy.appearance?.nameColor || accent,
			titleColor: legacy.appearance?.titleColor || defaultColors.title,
			atsMode: Boolean(legacy.appearance?.atsMode)
		}
	};
}
var KEY = "mitrilo.cvs.v1";
var read = () => {
	if (typeof window === "undefined") return {};
	try {
		const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
		const out = {};
		for (const [id, value] of Object.entries(raw)) out[id] = migrateCV(value);
		return out;
	} catch {
		return {};
	}
};
var write = (data) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY, JSON.stringify(data));
};
var localRepository = {
	async list() {
		return Object.values(read()).sort((a, b) => b.updatedAt - a.updatedAt);
	},
	async get(id) {
		return read()[id] ?? null;
	},
	async save(cv) {
		const all = read();
		const next = {
			...migrateCV(cv),
			updatedAt: Date.now()
		};
		all[cv.id] = next;
		write(all);
		return next;
	},
	async remove(id) {
		const all = read();
		delete all[id];
		write(all);
	}
};
var FONT_FAMILIES = [
	"Inter",
	"IBM Plex Sans",
	"Source Sans 3",
	"Lato"
];
var TEMPLATE_OPTIONS = [{
	id: "minimal",
	label: "Minimal B/N",
	hint: "Limpio, sin raya bajo el nombre"
}, {
	id: "classic",
	label: "Classic",
	hint: "Nombre + raya (estilo CV tipográfico)"
}];
function LayoutPicker({ value, onChange, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className),
		children: TEMPLATE_OPTIONS.map((opt) => {
			const selected = value === opt.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onChange(opt.id),
				className: cn("text-left rounded-xl border p-4 transition-colors", selected ? "border-foreground bg-neutral-50 ring-1 ring-foreground" : "border-neutral-200 hover:border-neutral-300"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-16 mb-3 rounded-md bg-white border border-neutral-100 overflow-hidden p-2.5",
						children: opt.id === "classic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2.5 w-2/3 rounded-sm",
								style: { backgroundColor: "#3B7A8A" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 h-px w-full",
								style: { backgroundColor: "#3B7A8A" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-full bg-neutral-200 rounded" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-4/5 bg-neutral-200 rounded" })]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 w-2/3 rounded-sm bg-neutral-800" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-full bg-neutral-200 rounded" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-4/5 bg-neutral-200 rounded" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-3/5 bg-neutral-200 rounded" })
							]
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: opt.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-neutral-500 mt-0.5",
						children: opt.hint
					})
				]
			}, opt.id);
		})
	});
}
//#endregion
export { cn as a, localRepository as c, newSection as d, switchLocale as f, appearanceForTemplate as i, newCV as l, FONT_FAMILIES as n, defaultColors as o, uid as p, LayoutPicker as r, detectLocale as s, Button as t, newEntry as u };
