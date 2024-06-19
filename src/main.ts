import { App } from './App'
import './style.css'
import { render } from 'solit'

render(App(), document.querySelector<HTMLDivElement>('#app')!)
