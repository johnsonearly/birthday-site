/** Fractions (0–1) of the source image to keep. Use to trim letterbox bars / screenshots. */
export interface Crop { x: number; y: number; w: number; h: number }
export interface Photo {
  src: string
  alt: string
  /** Optional crop of the source image. Frames always follow the (cropped) photo's natural aspect ratio. */
  crop?: Crop
  /** CSS object-position used where a photo is shown in a small round/cover crop, e.g. "50% 30%" (keeps faces in view). */
  focus?: string
}
export interface GalleryPhoto extends Photo {
  caption: string
  /** Optional date or short memory description. */
  note?: string
}
export interface Friend {
  name: string
  relationship?: string
  avatar: string
  message: string
}
export interface BirthdayContent {
  herName: string
  myName: string
  heading: string
  introSubtitle: string
  introCta: string
  introPhotos: Photo[]
  gallery: {
    heading: string
    subtitle: string
    photos: GalleryPhoto[]
  }
  letter: {
    heading: string
    paragraphs: string[]
    signoff: string
    closing: string
  }
  friends: {
    heading: string
    subtitle: string
    list: Friend[]
  }
  finale: {
    lead: string
    paragraphs: string[]
    closingLine: string
  }
  audio?: string
}
