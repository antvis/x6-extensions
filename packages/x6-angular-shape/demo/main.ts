import '@angular/compiler'
import 'zone.js'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { importProvidersFrom } from '@angular/core'
import { DemoRootComponent } from './App'

bootstrapApplication(DemoRootComponent, {
  providers: [importProvidersFrom(BrowserModule)],
})
