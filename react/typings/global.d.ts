declare function fbq(s: string, t: string, o?: any): void

interface Event extends Event {
  data: any
}

interface Window extends Window {
  __SETTINGS__: {
    pixelId: string
  }
}
