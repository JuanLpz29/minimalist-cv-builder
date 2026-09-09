import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Route } from "./router-CQBtpYks.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn, c as localRepository, d as newSection, f as switchLocale, i as appearanceForTemplate, n as FONT_FAMILIES, r as LayoutPicker, t as Button, u as newEntry } from "./LayoutPicker-CHK4C1mo.mjs";
import { _ as ChevronDown, a as Undo2, c as Plus, h as ChevronUp, l as ImagePlus, n as ZoomIn, o as Trash2, p as Download, s as Redo2, t as ZoomOut, u as GripVertical, v as Check, y as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cv._id-BXGKD0_J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
function useCV(id) {
	const [cv, setCV] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const timer = (0, import_react.useRef)(null);
	const history = (0, import_react.useRef)([]);
	const future = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		if (!id) return;
		setLoading(true);
		localRepository.get(id).then((c) => {
			setCV(c);
			setLoading(false);
		});
	}, [id]);
	const persist = (0, import_react.useCallback)((next) => {
		if (timer.current) clearTimeout(timer.current);
		setSaving(true);
		timer.current = setTimeout(async () => {
			await localRepository.save(next);
			setSaving(false);
		}, 400);
	}, []);
	return {
		cv,
		setCV,
		loading,
		saving,
		update: (0, import_react.useCallback)((updater) => {
			setCV((prev) => {
				if (!prev) return prev;
				history.current.push(prev);
				if (history.current.length > 50) history.current.shift();
				future.current = [];
				const next = updater(prev);
				persist(next);
				return next;
			});
		}, [persist]),
		undo: (0, import_react.useCallback)(() => {
			setCV((prev) => {
				if (!prev) return prev;
				const previous = history.current.pop();
				if (!previous) return prev;
				future.current.push(prev);
				persist(previous);
				return previous;
			});
		}, [persist]),
		redo: (0, import_react.useCallback)(() => {
			setCV((prev) => {
				if (!prev) return prev;
				const next = future.current.pop();
				if (!next) return prev;
				history.current.push(prev);
				persist(next);
				return next;
			});
		}, [persist]),
		canUndo: (0, import_react.useMemo)(() => history.current.length > 0, [cv]),
		canRedo: (0, import_react.useMemo)(() => future.current.length > 0, [cv])
	};
}
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
function Field({ label, value, onChange, placeholder, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-[11px] font-medium text-neutral-500 uppercase tracking-wide",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			type,
			className: "h-9 bg-transparent border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-0 shadow-none"
		})]
	});
}
function SectionHeader({ title, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-sm font-semibold tracking-tight",
			children: title
		}), action]
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var areaCls = "min-h-[100px] bg-transparent border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-0 shadow-none text-sm leading-relaxed";
function Group({ title, children, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "py-6 border-b border-neutral-100 last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title,
			action: right
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children
		})]
	});
}
function ColorField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-[11px] font-medium text-neutral-500 uppercase tracking-wide",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "color",
				value: value || "#111111",
				onChange: (e) => onChange(e.target.value),
				className: "h-9 w-12 rounded border border-neutral-200 bg-transparent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value,
				onChange: (e) => onChange(e.target.value),
				className: "h-9 border-neutral-200 shadow-none"
			})]
		})]
	});
}
function readImage(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}
function patchSection(sections, id, patch) {
	return sections.map((s) => s.id === id ? {
		...s,
		...patch
	} : s);
}
function patchEntry(sections, sectionId, entryId, patch) {
	return sections.map((s) => s.id !== sectionId ? s : {
		...s,
		entries: s.entries.map((e) => e.id === entryId ? {
			...e,
			...patch
		} : e)
	});
}
function CVEditor({ cv, update }) {
	const [dragId, setDragId] = (0, import_react.useState)(null);
	const photoRef = (0, import_react.useRef)(null);
	const setSections = (sections) => update((p) => ({
		...p,
		sections
	}));
	const onDrop = (targetId) => {
		if (!dragId || dragId === targetId) return;
		const list = [...cv.sections];
		const from = list.findIndex((s) => s.id === dragId);
		const to = list.findIndex((s) => s.id === targetId);
		if (from < 0 || to < 0) return;
		const [item] = list.splice(from, 1);
		list.splice(to, 0, item);
		setSections(list);
		setDragId(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "divide-y divide-neutral-100",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
				title: "Layout",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutPicker, {
					value: cv.appearance.template === "classic" ? "classic" : "minimal",
					onChange: (template) => update((p) => ({
						...p,
						appearance: appearanceForTemplate(template, p.appearance)
					}))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
				title: "Idioma / Language",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 rounded-lg border border-neutral-200 px-3 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: "Versión del CV"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-neutral-500",
						children: "ES y EN son independientes. Al cambiar por primera vez se copia el contenido para que lo edites."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-xs font-medium ${cv.locale === "es" ? "text-foreground" : "text-neutral-400"}`,
								children: "ES"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: cv.locale === "en",
								onCheckedChange: (en) => update((p) => switchLocale(p, en ? "en" : "es"))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-xs font-medium ${cv.locale === "en" ? "text-foreground" : "text-neutral-400"}`,
								children: "EN"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
				title: "Personal information",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 mb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => photoRef.current?.click(),
							className: "h-16 w-16 rounded-full border border-dashed border-neutral-300 flex items-center justify-center overflow-hidden bg-neutral-50 hover:border-neutral-400",
							children: cv.personal.photoDataUrl && !cv.appearance.atsMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: cv.personal.photoDataUrl,
								alt: "",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-5 w-5 text-neutral-400" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: photoRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: async (e) => {
								const f = e.target.files?.[0];
								if (!f) return;
								const dataUrl = await readImage(f);
								update((p) => ({
									...p,
									personal: {
										...p.personal,
										photoDataUrl: dataUrl
									}
								}));
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-neutral-500 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Foto de perfil (opcional)" }),
								cv.personal.photoDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "underline",
									onClick: () => update((p) => ({
										...p,
										personal: {
											...p.personal,
											photoDataUrl: void 0
										}
									})),
									children: "Quitar foto"
								}),
								cv.appearance.atsMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-amber-700",
									children: "Oculta en modo ATS"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							value: cv.personal.fullName,
							onChange: (v) => update((p) => ({
								...p,
								personal: {
									...p.personal,
									fullName: v
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title",
							value: cv.personal.title,
							onChange: (v) => update((p) => ({
								...p,
								personal: {
									...p.personal,
									title: v
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							value: cv.personal.email,
							onChange: (v) => update((p) => ({
								...p,
								personal: {
									...p.personal,
									email: v
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							value: cv.personal.phone,
							onChange: (v) => update((p) => ({
								...p,
								personal: {
									...p.personal,
									phone: v
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							value: cv.personal.city,
							onChange: (v) => update((p) => ({
								...p,
								personal: {
									...p.personal,
									city: v
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "LinkedIn",
							value: cv.personal.linkedin,
							onChange: (v) => update((p) => ({
								...p,
								personal: {
									...p.personal,
									linkedin: v
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "GitHub",
							value: cv.personal.github,
							onChange: (v) => update((p) => ({
								...p,
								personal: {
									...p.personal,
									github: v
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Website",
							value: cv.personal.website,
							onChange: (v) => update((p) => ({
								...p,
								personal: {
									...p.personal,
									website: v
								}
							}))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
				title: "Sections",
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-8 gap-1 text-xs",
							onClick: () => setSections([...cv.sections, newSection(cv.locale === "es" ? "Nueva sección" : "New section", "text")]),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Text"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-8 gap-1 text-xs",
							onClick: () => setSections([...cv.sections, newSection(cv.locale === "es" ? "Nueva sección" : "New section", "entries")]),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Entries"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							className: "h-8 gap-1 text-xs",
							onClick: () => setSections([...cv.sections, newSection(cv.locale === "es" ? "Nueva sección" : "New section", "tags")]),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Tags"]
						})
					]
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-neutral-500 -mt-2",
					children: "Arrastrá el asa para reordenar."
				}), cv.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					draggable: true,
					onDragStart: () => setDragId(section.id),
					onDragOver: (e) => e.preventDefault(),
					onDrop: () => onDrop(section.id),
					className: `rounded-lg border border-neutral-200 p-4 space-y-3 bg-white ${dragId === section.id ? "opacity-60" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-2 text-neutral-400 cursor-grab active:cursor-grabbing",
									"aria-label": "Drag",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 grid grid-cols-2 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Section title",
											value: section.title,
											onChange: (v) => setSections(patchSection(cv.sections, section.id, { title: v }))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] font-medium text-neutral-500 uppercase tracking-wide",
												children: "Type"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: section.kind,
												onValueChange: (v) => setSections(patchSection(cv.sections, section.id, {
													kind: v,
													entries: v === "entries" && !section.entries.length ? [newEntry()] : section.entries
												})),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-9",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "text",
														children: "Text"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "entries",
														children: "Entries (jobs, edu…)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "tags",
														children: "Tags / list"
													})
												] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
											label: "Title color",
											value: section.titleColor,
											onChange: (v) => setSections(patchSection(cv.sections, section.id, { titleColor: v }))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
											label: "Subtitle color",
											value: section.subtitleColor,
											onChange: (v) => setSections(patchSection(cv.sections, section.id, { subtitleColor: v }))
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "h-8 w-8 text-neutral-400 hover:text-destructive",
									onClick: () => setSections(cv.sections.filter((s) => s.id !== section.id)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							]
						}),
						section.kind === "text" || section.kind === "tags" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: section.body,
							onChange: (e) => setSections(patchSection(cv.sections, section.id, { body: e.target.value })),
							className: areaCls,
							placeholder: section.kind === "tags" ? "One item per line, or Category: a, b, c" : "Section content…"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [section.entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border border-neutral-100 p-3 space-y-2 relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "absolute top-1 right-1 h-7 w-7 text-neutral-400",
										onClick: () => setSections(cv.sections.map((s) => s.id === section.id ? {
											...s,
											entries: s.entries.filter((e) => e.id !== entry.id)
										} : s)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 pr-8",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Heading",
												value: entry.heading,
												onChange: (v) => setSections(patchEntry(cv.sections, section.id, entry.id, { heading: v }))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Subheading",
												value: entry.subheading,
												onChange: (v) => setSections(patchEntry(cv.sections, section.id, entry.id, { subheading: v }))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "col-span-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													label: "Meta (dates, link…)",
													value: entry.meta,
													onChange: (v) => setSections(patchEntry(cv.sections, section.id, entry.id, { meta: v }))
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px] font-medium text-neutral-500 uppercase tracking-wide",
												children: "Description"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-xs ${(entry.bodyFormat ?? "bullets") === "text" ? "text-neutral-400" : "text-foreground font-medium"}`,
														children: "Bullets"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
														checked: (entry.bodyFormat ?? "bullets") === "text",
														onCheckedChange: (toText) => setSections(patchEntry(cv.sections, section.id, entry.id, {
															bodyFormat: toText ? "text" : "bullets",
															body: toText ? entry.body.split("\n").map((l) => l.replace(/^[-•●▪◦*]+\s*/, "").trim()).filter(Boolean).join("\n") : entry.body.split("\n").map((l) => l.replace(/^[-•●▪◦*]+\s*/, "").trim()).filter(Boolean).join("\n")
														}))
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-xs ${(entry.bodyFormat ?? "bullets") === "text" ? "text-foreground font-medium" : "text-neutral-400"}`,
														children: "Texto"
													})
												]
											})]
										}), (entry.bodyFormat ?? "bullets") === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: entry.body,
											onChange: (e) => setSections(patchEntry(cv.sections, section.id, entry.id, { body: e.target.value })),
											className: areaCls,
											placeholder: "Párrafo libre de descripción…"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [(entry.body.split("\n").length === 0 || entry.body === "" ? [""] : entry.body.split("\n")).map((line, idx, arr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-neutral-400 text-sm shrink-0 w-3",
														children: "•"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: line.replace(/^[-•●▪◦*]+\s*/, ""),
														className: "h-9 bg-transparent border-neutral-200 focus-visible:border-neutral-400 focus-visible:ring-0 shadow-none text-sm",
														placeholder: "Logro o responsabilidad…",
														onChange: (e) => {
															const lines = entry.body === "" && arr.length === 1 ? [e.target.value] : entry.body.split("\n");
															lines[idx] = e.target.value;
															setSections(patchEntry(cv.sections, section.id, entry.id, {
																body: lines.join("\n"),
																bodyFormat: "bullets"
															}));
														},
														onKeyDown: (e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																const lines = entry.body === "" ? [""] : entry.body.split("\n");
																lines.splice(idx + 1, 0, "");
																setSections(patchEntry(cv.sections, section.id, entry.id, {
																	body: lines.join("\n"),
																	bodyFormat: "bullets"
																}));
															}
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "button",
														size: "icon",
														variant: "ghost",
														className: "h-8 w-8 shrink-0 text-neutral-400",
														disabled: arr.length <= 1 && !line.trim(),
														onClick: () => {
															const lines = entry.body.split("\n").filter((_, i) => i !== idx);
															setSections(patchEntry(cv.sections, section.id, entry.id, {
																body: lines.length ? lines.join("\n") : "",
																bodyFormat: "bullets"
															}));
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
													})
												]
											}, idx)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												size: "sm",
												variant: "ghost",
												className: "h-7 text-xs gap-1",
												onClick: () => {
													const lines = entry.body === "" ? [""] : entry.body.split("\n");
													lines.push("");
													setSections(patchEntry(cv.sections, section.id, entry.id, {
														body: lines.join("\n"),
														bodyFormat: "bullets"
													}));
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add bullet"]
											})]
										})]
									})
								]
							}, entry.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-8",
								onClick: () => setSections(cv.sections.map((s) => s.id === section.id ? {
									...s,
									entries: [...s.entries, newEntry()]
								} : s)),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), " Add entry"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] text-neutral-500",
									children: "Section image"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "file",
									accept: "image/*",
									className: "h-8 text-xs",
									onChange: async (e) => {
										const f = e.target.files?.[0];
										if (!f) return;
										const dataUrl = await readImage(f);
										setSections(patchSection(cv.sections, section.id, { imageDataUrl: dataUrl }));
									}
								}),
								section.imageDataUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-8 text-xs",
									onClick: () => setSections(patchSection(cv.sections, section.id, { imageDataUrl: void 0 })),
									children: "Remove"
								})
							]
						})
					]
				}, section.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
				title: "Appearance",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 rounded-lg border border-neutral-200 px-3 py-2.5 mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: "Modo ATS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-neutral-500",
						children: "Oculta fotos e imágenes al exportar / preview"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: cv.appearance.atsMode,
						onCheckedChange: (atsMode) => update((p) => ({
							...p,
							appearance: {
								...p.appearance,
								atsMode
							}
						}))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-[11px] font-medium text-neutral-500 uppercase tracking-wide",
								children: "Font"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: cv.appearance.font,
								onValueChange: (v) => update((p) => ({
									...p,
									appearance: {
										...p.appearance,
										font: v
									}
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FONT_FAMILIES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: f,
									children: f
								}, f)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Accent (default)",
							value: cv.appearance.accentColor,
							onChange: (v) => update((p) => ({
								...p,
								appearance: {
									...p.appearance,
									accentColor: v
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Name color",
							value: cv.appearance.nameColor,
							onChange: (v) => update((p) => ({
								...p,
								appearance: {
									...p.appearance,
									nameColor: v
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							label: "Title / subtitle color",
							value: cv.appearance.titleColor,
							onChange: (v) => update((p) => ({
								...p,
								appearance: {
									...p.appearance,
									titleColor: v
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Font size (pt)",
							type: "number",
							value: String(cv.appearance.fontSize),
							onChange: (v) => update((p) => ({
								...p,
								appearance: {
									...p.appearance,
									fontSize: Math.max(9, Math.min(14, Number(v) || 11))
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Line height",
							type: "number",
							value: String(cv.appearance.spacing),
							onChange: (v) => update((p) => ({
								...p,
								appearance: {
									...p.appearance,
									spacing: Math.max(1, Math.min(2, Number(v) || 1.4))
								}
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Margin (mm)",
							type: "number",
							value: String(cv.appearance.margin),
							onChange: (v) => update((p) => ({
								...p,
								appearance: {
									...p.appearance,
									margin: Math.max(8, Math.min(30, Number(v) || 18))
								}
							}))
						})
					]
				})]
			})
		]
	});
}
function SectionBody({ section, atsMode }) {
	const showImg = Boolean(section.imageDataUrl && !atsMode);
	if (section.kind === "entries") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3.5",
		children: [showImg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: section.imageDataUrl,
			alt: "",
			className: "max-h-24 mb-2 rounded object-cover"
		}), section.entries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-between gap-4 items-baseline",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-semibold uppercase tracking-wide text-[0.95em] min-w-0",
				style: { color: section.subtitleColor },
				children: [
					e.heading,
					e.subheading,
					e.meta
				].filter(Boolean).join(" | ") || "—"
			})
		}), e.body && (e.bodyFormat === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 whitespace-pre-wrap text-neutral-700",
			children: e.body
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-1 space-y-0.5 text-neutral-700 list-none pl-0",
			children: e.body.split("\n").map((l) => l.replace(/^[-•●▪◦*]+\s*/, "").trim()).filter(Boolean).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 select-none",
					children: "•"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0",
					children: line
				})]
			}, i))
		}))] }, e.id))]
	});
	if (section.kind === "tags") {
		const lines = section.body.split("\n").map((l) => l.trim()).filter(Boolean);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1.5",
			children: [showImg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: section.imageDataUrl,
				alt: "",
				className: "max-h-24 mb-2 rounded object-cover"
			}), lines.map((line, i) => {
				const idx = line.indexOf(":");
				if (idx > 0 && idx < 40) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					style: { color: section.subtitleColor },
					children: line.slice(0, idx)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-neutral-700",
					children: line.slice(idx + 1).trim()
				})] }, i);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-neutral-700",
					children: line
				}, i);
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [showImg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: section.imageDataUrl,
		alt: "",
		className: "max-h-28 mb-2 rounded object-cover"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "whitespace-pre-wrap text-neutral-700",
		children: section.body
	})] });
}
function PageShell({ cv, children }) {
	const { appearance } = cv;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cv-page shadow-page mx-auto",
		style: {
			padding: `${appearance.margin}mm`,
			fontFamily: `"${appearance.font}", ui-sans-serif, system-ui, sans-serif`,
			fontSize: `${appearance.fontSize}pt`,
			lineHeight: appearance.spacing,
			color: "#111"
		},
		children
	});
}
function Photo({ src, atsMode }) {
	if (!src || atsMode) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		className: "h-20 w-20 rounded-full object-cover shrink-0 border border-neutral-200"
	});
}
function ContactLine({ bits }) {
	if (!bits.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[9.5pt] text-neutral-500 flex flex-wrap gap-x-0",
		children: bits.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mx-1.5 text-neutral-300",
			children: "|"
		}), b] }, i))
	});
}
/** Clean B/W layout — no accent rule under the name. */
function MinimalTemplate({ cv }) {
	const { personal, sections, appearance } = cv;
	const contactBits = [
		personal.city,
		personal.email,
		personal.phone,
		personal.linkedin,
		personal.github,
		personal.website
	].filter(Boolean);
	const showPhoto = Boolean(personal.photoDataUrl && !appearance.atsMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		cv,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: `mb-6 ${showPhoto ? "flex gap-4 items-start" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
				src: personal.photoDataUrl,
				atsMode: appearance.atsMode
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[22pt] font-semibold tracking-tight leading-tight",
						style: { color: appearance.nameColor || "#111" },
						children: personal.fullName || "Your Name"
					}),
					personal.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-neutral-600",
						style: { color: appearance.titleColor },
						children: personal.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactLine, { bits: contactBits })
					})
				]
			})]
		}), sections.map((section) => {
			if (section.kind === "entries" ? section.entries.length === 0 : !section.body.trim() && !section.imageDataUrl) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[10.5px] font-semibold uppercase tracking-[0.14em] mb-2",
					style: { color: section.titleColor || "#111" },
					children: section.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionBody, {
					section,
					atsMode: appearance.atsMode
				})]
			}, section.id);
		})]
	});
}
/**
* Classic layout matching typical “ruled header” CVs:
* colored name + full-width hairline under the title, contact below the rule.
*/
function ClassicTemplate({ cv }) {
	const { personal, sections, appearance } = cv;
	const accent = appearance.nameColor || appearance.accentColor || "#3B7A8A";
	const contactBits = [
		personal.city,
		personal.email,
		personal.phone,
		personal.linkedin,
		personal.github,
		personal.website
	].filter(Boolean);
	const showPhoto = Boolean(personal.photoDataUrl && !appearance.atsMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		cv,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: `mb-6 ${showPhoto ? "flex gap-4 items-start" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photo, {
				src: personal.photoDataUrl,
				atsMode: appearance.atsMode
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[20pt] font-semibold tracking-tight leading-tight",
						style: { color: accent },
						children: personal.fullName || "Your Name"
					}),
					personal.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[11pt]",
						style: { color: appearance.titleColor || "#525252" },
						children: personal.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2.5 mb-2 h-px w-full",
						style: { backgroundColor: accent }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactLine, { bits: contactBits })
				]
			})]
		}), sections.map((section) => {
			if (section.kind === "entries" ? section.entries.length === 0 : !section.body.trim() && !section.imageDataUrl) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] font-semibold uppercase tracking-[0.12em] mb-2",
					style: { color: section.titleColor || accent },
					children: section.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionBody, {
					section,
					atsMode: appearance.atsMode
				})]
			}, section.id);
		})]
	});
}
function CVPreview({ cv, printRoot = false }) {
	const Template = cv.appearance.template === "classic" ? ClassicTemplate : MinimalTemplate;
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Template, { cv });
	return printRoot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: "print-root",
		children: content
	}) : content;
}
var ZOOM_MIN = .5;
var ZOOM_MAX = 1.5;
var ZOOM_STEP = .1;
function EditorPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const { cv, update, loading, saving, undo, redo, canUndo, canRedo } = useCV(id);
	const [zoom, setZoom] = (0, import_react.useState)(.85);
	(0, import_react.useEffect)(() => {
		if (!loading && !cv) navigate({ to: "/" });
	}, [
		loading,
		cv,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const mod = e.metaKey || e.ctrlKey;
			if (mod && e.key === "z" && !e.shiftKey) {
				e.preventDefault();
				undo();
			}
			if (mod && (e.key === "y" || e.key === "z" && e.shiftKey)) {
				e.preventDefault();
				redo();
			}
			if (mod && e.key === "p") {
				e.preventDefault();
				window.print();
			}
			if (mod && (e.key === "=" || e.key === "+")) {
				e.preventDefault();
				setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10));
			}
			if (mod && e.key === "-") {
				e.preventDefault();
				setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10));
			}
			if (mod && e.key === "0") {
				e.preventDefault();
				setZoom(.85);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [undo, redo]);
	if (loading || !cv) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-sm text-neutral-500",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-screen flex flex-col bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "no-print border-b border-neutral-100 h-14 flex items-center px-4 gap-3 shrink-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "p-1.5 -ml-1.5 rounded-md hover:bg-neutral-100 text-neutral-600",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: cv.title,
					onChange: (e) => update((p) => ({
						...p,
						title: e.target.value
					})),
					className: "h-8 w-64 border-transparent shadow-none focus-visible:border-neutral-200 focus-visible:ring-0 text-sm font-medium px-2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 ml-2 text-xs text-neutral-400",
					children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Saving…" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Saved"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-0.5 mr-1 rounded-md border border-neutral-200 px-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-7 w-7",
							disabled: zoom <= ZOOM_MIN,
							onClick: () => setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10)),
							title: "Alejar (⌘-)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "h-7 min-w-[3rem] px-1 text-xs tabular-nums text-neutral-600 hover:text-foreground",
							onClick: () => setZoom(.85),
							title: "Restablecer zoom (⌘0)",
							children: [Math.round(zoom * 100), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-7 w-7",
							disabled: zoom >= ZOOM_MAX,
							onClick: () => setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10)),
							title: "Acercar (⌘+)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-3.5 w-3.5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "h-8 w-8",
					disabled: !canUndo,
					onClick: undo,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "h-8 w-8",
					disabled: !canRedo,
					onClick: redo,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redo2, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "h-8 gap-1.5",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Generate PDF"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,480px)_1fr] overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-print border-r border-neutral-100 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 max-w-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CVEditor, {
						cv,
						update
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-auto bg-neutral-100/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-10 px-6 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							transform: `scale(${zoom})`,
							transformOrigin: "top center"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CVPreview, {
							cv,
							printRoot: true
						})
					})
				})
			})]
		})]
	});
}
//#endregion
export { EditorPage as component };
