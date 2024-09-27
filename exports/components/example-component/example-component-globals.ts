import type ExampleComponent from "./example-component.js"

declare global {
  interface HTMLElementTagNameMap {
    'example-component': ExampleComponent
  }
}

export {}
