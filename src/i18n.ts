export type Translation = { [lang: string]: string; fallback: string }

export const getLanguage = (): string => {
  const browserLanguage = window.navigator.language

  const searchParams = new URLSearchParams(window.location.search)
  const querystringLanguage = searchParams.get("lang")

  if (querystringLanguage) return querystringLanguage
  if (browserLanguage) return browserLanguage

  return ""
}

export const t = (key: keyof typeof messages): string => {
  const lang = getLanguage()
  const translation = messages[key] as Translation

  return translation[lang] ?? translation.fallback
}

export const messages = {
  placeTiles: { fallback: "Place tiles.", ja: "タイルを設置してください" },
  resetTiles: {
    fallback: "Reset tiles.",
    ja: "タイルをリセットしてください",
  },
  cannotSolve: {
    fallback: "Cannot solve...",
    ja: "解けませんでした...",
  },
  found: {
    fallback: "Found.",
    ja: "答えを発見",
  },
  elapsedTime: {
    fallback: "Elapsed time: ",
    ja: "経過時間: ",
  },
  sec: {
    fallback: "sec",
    ja: "秒",
  },
  notMod6: {
    fallback: "Tiles must be placed in multiples of 6.",
    ja: "タイルは6の倍数個設置してください",
  },
} satisfies { [id: string]: Translation }

export type TranslationKey = keyof typeof messages
