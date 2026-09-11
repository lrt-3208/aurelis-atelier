export type AurelisLanguage = "en" | "zh";

type CollectionItemCopy = {
  detail: string;
  caption: string;
  alt: string;
};

type LookbookItemCopy = {
  meta: string;
  alt: string;
};

type CraftItemCopy = {
  title: string;
  description: string;
};

export type AurelisCopy = {
  languageLabel: string;
  close: string;
  index: string;
  navigationLabel: string;
  beginning: string;
  locations: string;
  appointment: string;
  loadingMeta: string;
  homeLabel: string;
  scrollToEnter: string;
  scrollToReveal: string;
  formation: string;
  hero: {
    eyebrow: string;
    titleLineOne: string;
    titleLineTwo: string;
    titleLineThree: string;
    copy: string;
    enter: string;
    enterLabel: string;
    note: string;
  };
  manifesto: {
    label: string;
    lineOne: string[];
    lineTwo: string[];
    footOne: string;
    footTwo: string;
  };
  collection: {
    eyebrow: string;
    titleLineOne: string;
    titleLineTwo: string;
    intro: string;
    items: CollectionItemCopy[];
  };
  craft: {
    eyebrow: string;
    titleLineOne: string;
    titleLineTwo: string;
    copy: string;
    readNotes: string;
    items: CraftItemCopy[];
    caption: string;
  };
  experience: {
    eyebrow: string;
    titleLineOne: string;
    titleLineTwo: string;
    copy: string;
    label: string;
    readout: string;
  };
  lookbook: {
    eyebrow: string;
    count: string;
    items: LookbookItemCopy[];
    endLabel: string;
    endLineOne: string;
    endLineTwo: string;
    beginFitting: string;
  };
  story: {
    eyebrow: string;
    copyBeforeLine: string;
    line: string;
    bottomCopy: string;
  };
  contact: {
    eyebrow: string;
    titleLineOne: string;
    titleLineTwo: string;
    copy: string;
  };
  footer: {
    collection: string;
    journal: string;
    contact: string;
    legal: string;
  };
};

export const aurelisCopy: Record<AurelisLanguage, AurelisCopy> = {
  en: {
    languageLabel: "Language",
    close: "Close",
    index: "Index",
    navigationLabel: "Navigate the atelier",
    beginning: "The beginning",
    locations: "Paris · New York · Shanghai",
    appointment: "Available by appointment · atelier@aurelis.studio",
    loadingMeta: "Atelier digital · 2026",
    homeLabel: "Aurelis Atelier home",
    scrollToEnter: "Scroll to enter",
    scrollToReveal: "Scroll to reveal",
    formation: "Formation / 00:48",
    hero: {
      eyebrow: "Aurelis Atelier — 2026 / Collection I",
      titleLineOne: "The quiet",
      titleLineTwo: "architecture",
      titleLineThree: "of becoming.",
      copy: "Couture bridal objects for the threshold between who you were and who you are becoming.",
      enter: "Enter",
      enterLabel: "Enter collection",
      note: "A study in silk,\nlight & restraint.",
    },
    manifesto: {
      label: "Manifesto",
      lineOne: ["A", "dress", "is", "worn", "once."],
      lineTwo: ["A", "memory", "learns", "your", "shape."],
      footOne: "Not an occasion.",
      footTwo: "A feeling, made visible.",
    },
    collection: {
      eyebrow: "Collection I — The threshold",
      titleLineOne: "Three ways",
      titleLineTwo: "to arrive.",
      intro: "A study of movement, proportion, and the small distance between the body and the light.",
      items: [
        { detail: "Silk organza · 01 / 05", caption: "A line of light held in suspension.", alt: "Aster couture gown" },
        { detail: "Silk faille · 02 / 05", caption: "For the hour after midnight.", alt: "Nocturne couture gown" },
        { detail: "Washed satin · 03 / 05", caption: "The quiet architecture of a beginning.", alt: "Lumen couture gown" },
      ],
    },
    craft: {
      eyebrow: "Atelier / Craft — 03",
      titleLineOne: "Made",
      titleLineTwo: "in the pause.",
      copy: "Every Aurelis piece begins as a conversation between a hand and a length of cloth. Nothing is added until the silence asks for it.",
      readNotes: "Read the atelier notes",
      items: [
        { title: "Structure", description: "A hidden architecture, built to disappear." },
        { title: "Air", description: "Layers of silk organza, allowed to move." },
        { title: "Hand", description: "Each seam finished by one pair of hands." },
        { title: "Light", description: "The final material in every composition." },
      ],
      caption: "Aster / Detail study / Paris, 2026",
    },
    experience: {
      eyebrow: "The dress in space — 04",
      titleLineOne: "Turn toward",
      titleLineTwo: "the light.",
      copy: "Move through the sculpture. The room responds to your gaze; the cloth answers with its own slow gravity.",
      label: "Interactive study",
      readout: "Pointer / camera / silk",
    },
    lookbook: {
      eyebrow: "Lookbook — Collection I",
      count: "05 / 05",
      items: [
        { meta: "The first light", alt: "Aster look" },
        { meta: "After midnight", alt: "Nocturne look" },
        { meta: "A line of light", alt: "Lumen look" },
        { meta: "Hand finished", alt: "Oriel look" },
        { meta: "The last veil", alt: "Aureline look" },
      ],
      endLabel: "End of volume I",
      endLineOne: "The rest",
      endLineTwo: "is yours.",
      beginFitting: "Begin a fitting",
    },
    story: {
      eyebrow: "The atelier — 05",
      copyBeforeLine: "Aurelis is a small room in Paris, a long table, and the belief that",
      line: "the most lasting things do not need to announce themselves.",
      bottomCopy: "Founded between river light and winter windows. Designed for one woman at a time.",
    },
    contact: {
      eyebrow: "Private fitting — 06",
      titleLineOne: "Come closer",
      titleLineTwo: "to the cloth.",
      copy: "For a private appointment, write to the atelier. We will answer in kind.",
    },
    footer: {
      collection: "Collection",
      journal: "Journal",
      contact: "Contact",
      legal: "© 2026 Aurelis Atelier. Made slowly.",
    },
  },
  zh: {
    languageLabel: "语言",
    close: "关闭",
    index: "目录",
    navigationLabel: "探索工坊",
    beginning: "起点",
    locations: "巴黎 · 纽约 · 上海",
    appointment: "仅限预约 · atelier@aurelis.studio",
    loadingMeta: "数字工坊 · 2026",
    homeLabel: "Aurelis Atelier 首页",
    scrollToEnter: "滚动进入",
    scrollToReveal: "滚动揭示",
    formation: "成形 / 00:48",
    hero: {
      eyebrow: "Aurelis Atelier — 2026 / 系列 I",
      titleLineOne: "静谧的",
      titleLineTwo: "成为之",
      titleLineThree: "建筑。",
      copy: "为你曾经的自己与即将成为的自己之间，裁制一件婚礼礼服。",
      enter: "进入",
      enterLabel: "进入系列",
      note: "关于丝绸、光与\n克制的研究。",
    },
    manifesto: {
      label: "宣言",
      lineOne: ["一件", "礼服", "只被", "穿过", "一次。"],
      lineTwo: ["记忆", "却会", "记住", "你的", "形状。"],
      footOne: "不只是一个场合。",
      footTwo: "是一种被看见的感受。",
    },
    collection: {
      eyebrow: "系列 I — 临界之境",
      titleLineOne: "三种",
      titleLineTwo: "抵达。",
      intro: "关于动作、比例，以及身体与光之间那一小段距离的研究。",
      items: [
        { detail: "丝绸欧根纱 · 01 / 05", caption: "悬停于光线之中的一道轮廓。", alt: "Aster 高定婚纱" },
        { detail: "丝绸法雅 · 02 / 05", caption: "献给午夜之后的时刻。", alt: "Nocturne 高定婚纱" },
        { detail: "水洗缎面 · 03 / 05", caption: "一次开始的安静结构。", alt: "Lumen 高定婚纱" },
      ],
    },
    craft: {
      eyebrow: "工坊 / 工艺 — 03",
      titleLineOne: "生于",
      titleLineTwo: "停顿之间。",
      copy: "每一件 Aurelis 作品，都始于一只手与一段布料之间的对话。直到沉默提出要求之前，不再添加任何东西。",
      readNotes: "阅读工坊札记",
      items: [
        { title: "结构", description: "隐于其中的结构，最终消失于视线。" },
        { title: "空气", description: "让层叠的丝绸欧根纱自由移动。" },
        { title: "手工", description: "每一道缝线，都由一双手完成。" },
        { title: "光", description: "每一件作品中的最后一种材料。" },
      ],
      caption: "Aster / 细节研究 / 巴黎，2026",
    },
    experience: {
      eyebrow: "礼服与空间 — 04",
      titleLineOne: "转身，",
      titleLineTwo: "面向光。",
      copy: "穿行于这件雕塑之中。房间回应你的凝视，布料以自己的缓慢重力作答。",
      label: "互动研究",
      readout: "指针 / 镜头 / 丝绸",
    },
    lookbook: {
      eyebrow: "画册 — 系列 I",
      count: "05 / 05",
      items: [
        { meta: "第一束光", alt: "Aster 造型" },
        { meta: "午夜之后", alt: "Nocturne 造型" },
        { meta: "一道光线", alt: "Lumen 造型" },
        { meta: "手工收尾", alt: "Oriel 造型" },
        { meta: "最后一层面纱", alt: "Aureline 造型" },
      ],
      endLabel: "第一卷结束",
      endLineOne: "剩下的",
      endLineTwo: "由你完成。",
      beginFitting: "开始试衣",
    },
    story: {
      eyebrow: "工坊 — 05",
      copyBeforeLine: "Aurelis 是巴黎的一间小屋、一张长桌，以及这样一种信念：",
      line: "真正长久的事物，不需要急于宣告自己。",
      bottomCopy: "诞生于河流的光与冬日的窗之间。为一次只面对一位女性而设计。",
    },
    contact: {
      eyebrow: "私人试衣 — 06",
      titleLineOne: "靠近",
      titleLineTwo: "布料。",
      copy: "如需私人预约，请写信给工坊。我们会以同样的方式回应。",
    },
    footer: {
      collection: "系列",
      journal: "札记",
      contact: "联系",
      legal: "© 2026 Aurelis Atelier. 慢慢完成。",
    },
  },
};
