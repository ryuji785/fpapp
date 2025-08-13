import { defineStore } from 'pinia'
import { GoldenLayout, type LayoutConfig } from 'golden-layout'
import { createApp } from 'vue'
import Dashboard from '@/panels/DashboardPanel.vue'
import DataEntry from '@/panels/DataEntryPanel.vue'
import List from '@/panels/ListPanel.vue'
import FutureCF from '@/panels/FutureCFPanel.vue'
import LifeEvents from '@/panels/LifeEventsPanel.vue'
import Settings from '@/panels/SettingsPanel.vue'

const REGISTRY = {
  'dashboard':  Dashboard,
  'data-entry': DataEntry,
  'list':       List,
  'future-cf':  FutureCF,
  'life-events':LifeEvents,
  'settings':   Settings
} as const

export const useGLStore = defineStore('gl', {
  state: () => ({ layout: null as unknown as GoldenLayout }),
  actions: {
    mount(container: HTMLElement){
      const saved = localStorage.getItem('gl-layout-v1')
      const base: LayoutConfig = saved ? JSON.parse(saved) : {
        root:{
          type:'row',
          content:[
            { type:'column', content:[{type:'stack',content:[]}] },
            { type:'column', content:[{type:'stack',content:[]}] },
            { type:'column', content:[{type:'stack',content:[]}] }
          ]
        }
      }
      this.layout = new GoldenLayout(base, container) as any
      Object.entries(REGISTRY).forEach(([key,Comp])=>{
        this.layout.registerComponentFactoryFunction(key, c => {
          const el = document.createElement('div')
          c.element.append(el)
          const app = createApp(Comp)
          app.mount(el)
          c.on('destroy', ()=> app.unmount())
        })
      })
      this.layout.init()
      this.layout.on('stateChanged', ()=> localStorage.setItem('gl-layout-v1', JSON.stringify(this.layout.saveLayout())))
    },
    restore(){
      const saved = localStorage.getItem('gl-layout-v1')
      return !!saved
    },
    openOrActivatePanel(key:string){
      const comps = this.layout.root.getItemsByType('component')
      const found = comps.find((it:any)=> it.componentType === key)
      if(found) { found.parent?.setActiveContentItem(found); return }
      const stacks = this.layout.root.getItemsByType('stack')
      const target = stacks[0] || this.layout.root
      target.addComponent(key, { })
    }
  }
})
