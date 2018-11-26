declare function fbq(s: string, t: string, o: any): void

interface RuntimeContext {
  culture: {
    currency: string
  }
}

declare const __RUNTIME__ : RuntimeContext

interface Event extends Event {
  data: any
}

interface Window extends Window {
  __SETTINGS__: {
    pixelId: string
  }
}
